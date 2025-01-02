import './style.css'

const defaultFilePath: string = 'pass.txt';

document.getElementById("check_btn")?.addEventListener("click", () => {
  const input = document.getElementById("fileInput") as HTMLInputElement;
  if (input) handleUploadedFile(input);
});

document.getElementById("check_default")?.addEventListener("click", () => {
  handleDefaultFile();
});

function handleUploadedFile(input: HTMLInputElement): void {
  const file = input.files?.[0];
  if (!file) {
    alert("Будь ласка, виберіть файл.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e: ProgressEvent<FileReader>) {
    const fileContent = e.target?.result as string;
    const { count, validPasswords } = countValidPasswords(fileContent);
    const resultElement = document.getElementById("result");
    if (resultElement) {
      resultElement.textContent = `Кількість валідних паролів: ${count}, паролі: ${validPasswords.join(', ')}`;
    }
  };

  reader.onerror = function () {
    alert("Не вдалося прочитати файл.");
  };

  reader.readAsText(file);
}

function handleDefaultFile(): void {
  console.log(defaultFilePath);
  fetch(defaultFilePath)
    .then(response => {
      if (!response.ok) {
        throw new Error("Не вдалося завантажити файл за замовчуванням.");
      }
      return response.text();
    })
    .then(fileContent => {
      const { count, validPasswords } = countValidPasswords(fileContent);
      const resultElement = document.getElementById("result");
      if (resultElement) {
        resultElement.textContent = `Кількість валідних паролів у файлі за замовчуванням: ${count}, паролі: ${validPasswords.join(', ')}`;
      }
    })
    .catch(error => {
      alert(error.message);
    });
}

function countValidPasswords(data: string): { count: number, validPasswords: string[] } {
  const lines: string[] = data.trim().split("\n");
  let validCount = 0;
  const validPasswords: string[] = [];

  lines.forEach(line => {
    const [requirement, password] = line.split(":").map(part => part.trim());
    const [char, range] = requirement.split(" ");
    const [min, max] = range.split("-").map(Number);

    const charCount = [...password].filter(c => c === char).length;

    if (charCount >= min && charCount <= max) {
      validCount++;
      validPasswords.push(password);
    }
  });

  return { count: validCount, validPasswords };
}

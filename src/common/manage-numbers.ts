import fs from "fs";

export abstract class ManageNumbers {
  protected numbers: string[];
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, "[]");
    }
    const fileContent = fs.readFileSync(this.filePath).toString();
    this.numbers = JSON.parse(fileContent);
  }

  add(number: string) {
    if (!this.has(number)) {
      this.numbers.push(number);
      this.saveFile();
    }
  }

  has(number: string): boolean {
    return this.numbers.includes(number);
  }

  protected saveFile() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.numbers));
  }
}

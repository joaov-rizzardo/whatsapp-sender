import { ManageNumbers } from "./manage-numbers";

const PHONE_NUMBERS_FILE_PATH = "data/phone-numbers.json";

export class PhoneNumbers extends ManageNumbers {
  constructor() {
    super(PHONE_NUMBERS_FILE_PATH);
  }

  getNextNumber() {
    const nextNumber = this.numbers.shift();
    this.saveFile();
    return nextNumber;
  }

  public get size() {
    return this.numbers.length;
  }
}

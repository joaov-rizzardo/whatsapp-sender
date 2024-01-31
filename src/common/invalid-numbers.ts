import { ManageNumbers } from "./manage-numbers";

const INVALID_NUMBERS_FILE_PATH = "data/number-history.json";

export class InvalidNumbers extends ManageNumbers {
  constructor() {
    super(INVALID_NUMBERS_FILE_PATH);
  }
}

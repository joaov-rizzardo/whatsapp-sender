import { ManageNumbers } from "./manage-numbers";

const NUMBER_HISTORY_FILE_PATH = "data/number-history.json";

export class NumberHistory extends ManageNumbers {
  constructor() {
    super(NUMBER_HISTORY_FILE_PATH);
  }
}

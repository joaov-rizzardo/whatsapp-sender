export class MaturationAlreadyRunningError extends Error {
  constructor() {
    super("Maturation already running");
  }
}

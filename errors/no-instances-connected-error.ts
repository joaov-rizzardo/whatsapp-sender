export class NoInstancesConnectedError extends Error {
  constructor() {
    super("No instances connected");
  }
}

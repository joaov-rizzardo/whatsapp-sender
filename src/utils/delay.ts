export async function delay(milliseconds: number) {
  return await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

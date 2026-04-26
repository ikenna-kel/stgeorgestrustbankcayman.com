export async function generateAccountNumber(): Promise<string> {
  const prefix = "10"; // bank prefix
  const random = Math.floor(100000000000 + Math.random() * 899999999999).toString();
  return prefix + random;
}

export function generateLastFourDigits(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

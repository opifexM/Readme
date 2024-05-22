export interface CryptoProtocol {
  hashPassword(password: string): Promise<string>;

  verifyPassword(inputPassword: string, storedHash: string): Promise<boolean>;
}

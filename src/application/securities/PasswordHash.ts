export abstract class PasswordHash {
  abstract hash(password: string): Promise<string>;
  abstract comparePassword(password: string, dbPassword: string): Promise<boolean>;
}

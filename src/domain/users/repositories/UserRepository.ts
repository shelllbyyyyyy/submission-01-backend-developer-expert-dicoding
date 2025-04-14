import { RegisteredUser } from '../entities/RegisteredUser';
import { RegisterUser } from '../entities/RegisterUser';

export abstract class UserRepository {
  abstract addUser(payload: RegisterUser): Promise<RegisteredUser>;
  abstract verifyAvailableUsername(username: string): Promise<void>;
  abstract getPasswordByUsername(username: string): Promise<string>;
  abstract getIdByUsername(username: string): Promise<string>;
}

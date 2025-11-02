import * as bcrypt from 'bcrypt';

const saltOrRounds = 10;

export class HashPassword {
  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, saltOrRounds);
  }
  static async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}

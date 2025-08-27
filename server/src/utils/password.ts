import bcrypt from 'bcryptjs';

const ROUNDS = 10;

export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(ROUNDS);
  return bcrypt.hash(plain, salt);
}

export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}



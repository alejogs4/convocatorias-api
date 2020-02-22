// packages
import jwt from 'jsonwebtoken';

// types
export interface TokenService {
  generateTokenFromUser(payload: object): string;
}

function generateTokenFromUser(payload: object): string {
  return jwt.sign(payload, process.env.TOKEN_SECRET_KEY as string, { expiresIn: '7days' });
}

const tokenService: TokenService = { generateTokenFromUser };

export default tokenService;

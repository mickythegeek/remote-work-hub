import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { RegisterInput, LoginInput } from '../validators/auth.schema';
import { unifiedConfig } from '../config/unifiedConfig';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(data: RegisterInput) {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Hash password strongly
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    const newUser = await this.userRepository.create({
      email: data.email,
      passwordHash,
      name: data.name,
    });

    return this.generateToken(newUser.id, newUser.email);
  }

  async login(data: LoginInput) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    return this.generateToken(user.id, user.email);
  }

  private generateToken(userId: string, email: string) {
    const secret = unifiedConfig.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not configured properly in .env');
    }

    // Token expires in 7 days
    const token = jwt.sign({ userId, email }, secret, { expiresIn: '7d' });
    
    return {
      token,
      user: {
        id: userId,
        email,
      }
    };
  }
}

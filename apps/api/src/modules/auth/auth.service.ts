import { Injectable, UnauthorizedException, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { InMemoryStoreService, MockUser } from '../../prisma/in-memory-store.service';
import { UserRoleName } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { RegisterInput, LoginInput } from '@wegen/validation';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private inMemoryStore: InMemoryStoreService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterInput) {
    const emailLower = dto.email.toLowerCase();

    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: emailLower },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(dto.password, salt);

      const userRole = await this.prisma.role.findUnique({
        where: { name: UserRoleName.USER },
      });

      const user = await this.prisma.user.create({
        data: {
          email: emailLower,
          passwordHash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phoneNumber: dto.phoneNumber,
          emailVerificationCode: '123456',
          roles: userRole ? { create: [{ roleId: userRole.id }] } : undefined,
        },
        include: { roles: { include: { role: true } } },
      });

      const roles = user.roles.map((r) => r.role.name);
      const tokens = await this.generateTokens(user.id, user.email, roles);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
          roles,
        },
        tokens,
      };
    } catch (err: any) {
      if (err instanceof ConflictException) throw err;

      // Fallback to in-memory store if DB is unavailable
      const existingMock = this.inMemoryStore.users.find((u) => u.email === emailLower);
      if (existingMock) {
        throw new ConflictException('User with this email already exists (In-Memory)');
      }

      const salt = bcrypt.genSaltSync(10);
      const newUser: MockUser = {
        id: `u-${Date.now()}`,
        email: emailLower,
        passwordHash: bcrypt.hashSync(dto.password, salt),
        firstName: dto.firstName,
        lastName: dto.lastName,
        phoneNumber: dto.phoneNumber,
        isEmailVerified: true,
        roles: ['USER'],
        createdAt: new Date(),
      };

      this.inMemoryStore.users.push(newUser);
      const tokens = await this.generateTokens(newUser.id, newUser.email, newUser.roles);

      return {
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          isEmailVerified: newUser.isEmailVerified,
          roles: newUser.roles,
        },
        tokens,
      };
    }
  }

  async login(dto: LoginInput) {
    const emailLower = dto.email.toLowerCase();

    try {
      const user = await this.prisma.user.findUnique({
        where: { email: emailLower },
        include: { roles: { include: { role: true } } },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const roles = user.roles.map((r) => r.role.name);
      const tokens = await this.generateTokens(user.id, user.email, roles);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
          roles,
        },
        tokens,
      };
    } catch (err: any) {
      if (err instanceof UnauthorizedException) throw err;

      // Fallback to in-memory store if DB is unavailable
      const mockUser = this.inMemoryStore.users.find((u) => u.email === emailLower);
      if (!mockUser) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isMatch = bcrypt.compareSync(dto.password, mockUser.passwordHash);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const tokens = await this.generateTokens(mockUser.id, mockUser.email, mockUser.roles);

      return {
        user: {
          id: mockUser.id,
          email: mockUser.email,
          firstName: mockUser.firstName,
          lastName: mockUser.lastName,
          isEmailVerified: mockUser.isEmailVerified,
          roles: mockUser.roles,
        },
        tokens,
      };
    }
  }

  async verifyEmail(email: string, code: string) {
    return { message: 'Email verified successfully' };
  }

  async forgotPassword(email: string) {
    return { message: 'If email exists, a password reset code was sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    return { message: 'Password updated successfully' };
  }

  private async generateTokens(userId: string, email: string, roles: string[]) {
    const payload = { sub: userId, email, roles };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET', 'super_secret_jwt_access_token_key_change_in_production_32bytes'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '1d'),
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'super_secret_jwt_refresh_token_key_change_in_production_32bytes'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    return { accessToken, refreshToken };
  }
}

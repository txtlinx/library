import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminCreateUserDto, AdminUpdateUserDto, LoginDto, RegisterDto } from './dto/auth.dto';
import { signAuthToken, verifyAuthToken } from '../common/auth-token.util';

@Injectable()
export class AuthService {
  private readonly secret = process.env.AUTH_SECRET || 'change-me-auth-secret';

  constructor(private readonly prisma: PrismaService) {}

  private hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, stored: string) {
    const [salt, hash] = String(stored || '').split(':');
    if (!salt || !hash) return false;
    const candidate = scryptSync(password, salt, 64).toString('hex');
    return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(candidate, 'hex'));
  }

  async register(dto: RegisterDto) {
    const exists = await (this.prisma as any).user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (exists) throw new BadRequestException('email ya registrado');
    const userCount = await (this.prisma as any).user.count();
    const user = await (this.prisma as any).user.create({
      data: {
        email: dto.email.toLowerCase(),
        username: dto.username?.trim() || null,
        passwordHash: this.hashPassword(dto.password),
        role: userCount === 0 ? 'ADMIN' : 'USER',
      },
      select: { id: true, email: true, username: true, role: true, isActive: true },
    });
    const token = signAuthToken({ sub: user.id, email: user.email, role: user.role }, this.secret);
    return { token, user };
  }

  async login(dto: LoginDto) {
    const identifierRaw = String(dto.identifier || dto.email || '').trim();
    if (!identifierRaw) throw new UnauthorizedException('credenciales inválidas');
    const identifier = identifierRaw.toLowerCase();
    const user = await (this.prisma as any).user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: { equals: identifierRaw, mode: 'insensitive' } },
        ],
      },
    });
    if (!user || !this.verifyPassword(dto.password, user.passwordHash)) {
      throw new UnauthorizedException('credenciales inválidas');
    }
    if (!user.isActive) throw new UnauthorizedException('usuario inactivo');
    const token = signAuthToken({ sub: user.id, email: user.email, role: user.role }, this.secret);
    return {
      token,
      user: { id: user.id, email: user.email, username: user.username, role: user.role, isActive: user.isActive },
    };
  }

  async meFromToken(token: string) {
    const payload = verifyAuthToken(token, this.secret);
    if (!payload) throw new UnauthorizedException('token inválido');
    const user = await (this.prisma as any).user.findUnique({ where: { id: payload.sub }, select: { id: true, email: true, username: true, role: true, isActive: true } });
    if (!user) throw new UnauthorizedException('usuario no existe');
    return user;
  }

  decodeToken(token: string) {
    return verifyAuthToken(token, this.secret);
  }

  async resetPassword(email: string, newPassword: string) {
    const user = await (this.prisma as any).user.findUnique({ where: { email: String(email || '').toLowerCase() } });
    if (!user) throw new UnauthorizedException('usuario no existe');
    await (this.prisma as any).user.update({
      where: { id: user.id },
      data: { passwordHash: this.hashPassword(newPassword) },
    });
    return { ok: true };
  }

  async listUsers() {
    return (this.prisma as any).user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, username: true, role: true, isActive: true, createdAt: true, updatedAt: true },
    });
  }

  async createUserByAdmin(dto: AdminCreateUserDto) {
    const email = String(dto.email || '').toLowerCase();
    const username = dto.username?.trim() || null;
    const role = dto.role === 'ADMIN' ? 'ADMIN' : 'USER';
    const isActive = dto.isActive !== false;
    const existsEmail = await (this.prisma as any).user.findUnique({ where: { email } });
    if (existsEmail) throw new BadRequestException('email ya registrado');
    if (username) {
      const existsUser = await (this.prisma as any).user.findFirst({ where: { username: { equals: username, mode: 'insensitive' } } });
      if (existsUser) throw new BadRequestException('username ya registrado');
    }
    return (this.prisma as any).user.create({
      data: {
        email,
        username,
        passwordHash: this.hashPassword(dto.password),
        role,
        isActive,
      },
      select: { id: true, email: true, username: true, role: true, isActive: true, createdAt: true, updatedAt: true },
    });
  }

  async updateUserByAdmin(id: number, dto: AdminUpdateUserDto, actorId?: number) {
    const user = await (this.prisma as any).user.findUnique({ where: { id } });
    if (!user) throw new BadRequestException('usuario no existe');
    const data: any = {};
    if (dto.email != null) {
      const email = String(dto.email || '').toLowerCase();
      const existsEmail = await (this.prisma as any).user.findUnique({ where: { email } });
      if (existsEmail && Number(existsEmail.id) !== Number(id)) throw new BadRequestException('email ya registrado');
      data.email = email;
    }
    if (dto.username !== undefined) {
      const username = dto.username ? dto.username.trim() : null;
      if (username) {
        const existsUser = await (this.prisma as any).user.findFirst({ where: { username: { equals: username, mode: 'insensitive' } } });
        if (existsUser && Number(existsUser.id) !== Number(id)) throw new BadRequestException('username ya registrado');
      }
      data.username = username;
    }
    if (dto.password) data.passwordHash = this.hashPassword(dto.password);
    if (dto.role) data.role = dto.role;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (actorId && Number(actorId) === Number(id) && dto.isActive === false) {
      throw new BadRequestException('no puedes desactivar tu propio usuario');
    }
    return (this.prisma as any).user.update({
      where: { id },
      data,
      select: { id: true, email: true, username: true, role: true, isActive: true, createdAt: true, updatedAt: true },
    });
  }

  async deleteUserByAdmin(id: number, actorId?: number) {
    if (actorId && Number(actorId) === Number(id)) throw new BadRequestException('no puedes eliminar tu propio usuario');
    const user = await (this.prisma as any).user.findUnique({ where: { id } });
    if (!user) throw new BadRequestException('usuario no existe');
    await (this.prisma as any).user.delete({ where: { id } });
    return { ok: true };
  }
}

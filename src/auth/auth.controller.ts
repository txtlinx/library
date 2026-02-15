import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminCreateUserDto, AdminUpdateUserDto, LoginDto, RegisterDto, ResetPasswordDto } from './dto/auth.dto';
import { AuthGuard } from './auth.guard';
import { extractBearerToken } from '../common/auth-token.util';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@Req() req: any) {
    return this.authService.meFromToken(`${req.headers?.authorization || ''}`.replace(/^Bearer\s+/i, ''));
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto, @Req() req: any) {
    const token = extractBearerToken(req?.headers?.authorization);
    const payload = token ? this.authService.decodeToken(token) : null;
    const resetSecret = String(req?.headers?.['x-reset-secret'] || '');
    const envSecret = String(process.env.AUTH_RESET_SECRET || '');
    const allowedByAdmin = !!payload && payload.role === 'ADMIN';
    const allowedBySecret = !!envSecret && resetSecret === envSecret;
    if (!allowedByAdmin && !allowedBySecret) {
      throw new UnauthorizedException('no autorizado para resetear password');
    }
    return this.authService.resetPassword(dto.email, dto.newPassword);
  }

  @Get('users')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  listUsers() {
    return this.authService.listUsers();
  }

  @Post('users')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  createUserByAdmin(@Body() dto: AdminCreateUserDto) {
    return this.authService.createUserByAdmin(dto);
  }

  @Patch('users/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateUserByAdmin(@Param('id', ParseIntPipe) id: number, @Body() dto: AdminUpdateUserDto, @Req() req: any) {
    return this.authService.updateUserByAdmin(id, dto, Number(req?.user?.sub || 0) || undefined);
  }

  @Delete('users/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  deleteUserByAdmin(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.authService.deleteUserByAdmin(id, Number(req?.user?.sub || 0) || undefined);
  }
}

import { Controller, Get, Res } from '@nestjs/common';
import { join } from 'path';
import { Response } from 'express';
import { networkInterfaces } from 'os';

@Controller()
export class AppController {
  private isPrivateIPv4(ip: string): boolean {
    const p = ip.split('.').map((n) => Number(n));
    if (p.length !== 4 || p.some((n) => Number.isNaN(n))) return false;
    if (p[0] === 10) return true;
    if (p[0] === 172 && p[1] >= 16 && p[1] <= 31) return true;
    if (p[0] === 192 && p[1] === 168) return true;
    if (p[0] === 127) return true;
    return false;
  }

  private isPrivateIPv6(ip: string): boolean {
    const value = String(ip || '').toLowerCase();
    return value.startsWith('fc') || value.startsWith('fd') || value === '::1';
  }

  @Get()
  root(@Res() res: Response) {
    return res.sendFile(join(process.cwd(), 'client', 'dist', 'index.html'));
  }

  @Get('network/private-ip')
  getPrivateIp() {
    const nets = networkInterfaces();
    const ipv4: string[] = [];
    const ipv6: string[] = [];
    Object.values(nets).forEach((entries) => {
      (entries || []).forEach((entry) => {
        if (!entry?.address) return;
        if (entry.family === 'IPv4' && this.isPrivateIPv4(entry.address)) ipv4.push(entry.address);
        if (entry.family === 'IPv6' && this.isPrivateIPv6(entry.address)) ipv6.push(entry.address);
      });
    });
    return {
      ipv4: [...new Set(ipv4)],
      ipv6: [...new Set(ipv6)],
    };
  }
}

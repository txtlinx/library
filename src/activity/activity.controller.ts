import { Controller, Delete, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('activity-logs')
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
export class ActivityController {
  constructor(private readonly activity: ActivityService) {}

  @Get()
  list(@Query('limit') limit?: string) {
    return this.activity.list(limit ? Number(limit) : 100);
  }

  @Delete()
  clear() {
    return this.activity.clearAll();
  }

  @Delete(':id')
  removeOne(@Param('id', ParseIntPipe) id: number) {
    return this.activity.removeOne(id);
  }
}

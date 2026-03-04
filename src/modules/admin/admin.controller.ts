import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PaginatedTasksResponseDto } from './dto/paginated-tasks.dto';
import { FindTasksQueryDto } from './dto/find-tasks-query.dto';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN) 
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('tasks')
  @ApiOperation({ summary: 'Listar todas as tarefas (apenas admin)' })  
  @ApiResponse({ status: 200, type: PaginatedTasksResponseDto })
  async findAll(@Query() query: FindTasksQueryDto) {

    const { page, limit, overdue } = query;    

    if (overdue) {
      return this.adminService.findOverdueTasks(page, limit);
    }
    return this.adminService.findAllTasks(page, limit);
  }
}
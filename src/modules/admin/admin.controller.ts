import { Controller, Get, Query, UseGuards, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PaginatedTodosResponseDto } from './dto/paginated-tasks.dto';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN) 
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('todos')
  @ApiOperation({ summary: 'Listar todas as tarefas (apenas admin)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'overdue', required: false, type: Boolean, description: 'Filtrar apenas atrasadas' })
  @ApiResponse({ status: 200, type: PaginatedTodosResponseDto })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('overdue') overdue?: string,
  ) {
        
    const isOverdue = overdue === 'true';

    if (isOverdue) {
      return this.adminService.findOverdueTodos(page, limit);
    }
    return this.adminService.findAllTodos(page, limit);
  }
}
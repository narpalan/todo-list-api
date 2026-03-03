import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../decorators/current-user.decorator';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import type { UserPayload } from '../../interfaces/user-payload.interface';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova tarefa' })
  create(@CurrentUser() user: UserPayload, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as tarefas do usuário logado' })
  findAll(@CurrentUser() user: UserPayload) {
    return this.tasksService.findAllByUser(user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar descrição e/ou prazo (apenas se não concluída)' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, user.id, dto);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Marcar tarefa como concluída' })
  complete(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.tasksService.complete(id, user.id);
  }
}
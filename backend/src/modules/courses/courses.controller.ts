import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CoursesService } from './courses.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AddCommentDto } from './dto/add-comment.dto';
import { User } from '../../database/entities/user.entity';

@ApiTags('Cursos')
@ApiBearerAuth()
@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

    @Get('modules')
    @ApiOperation({ summary: 'Listar todos os módulos com progresso do usuário' })
    async getAllModules(@CurrentUser() user: User) {
        return this.coursesService.getAllModulesWithProgress(user);
    }

    @Get('lessons/:id')
    @ApiOperation({ summary: 'Obter detalhes de uma aula específica' })
    async getLesson(@CurrentUser() user: User, @Param('id') id: string) {
        return this.coursesService.getLessonById(user, id);
    }

    @Get('lessons/:id/comments')
    @ApiOperation({ summary: 'Listar comentários de uma aula' })
    async getLessonsComments(@CurrentUser() user: User, @Param('id') id: string){
        return this.coursesService.getLessonComments(user.id, id);
    }

    @Post('lessons/:id/comments')
    @ApiOperation({ summary: 'Adicionar comentário a uma aula' })
    async addComment(
        @CurrentUser() user: User,
        @Param('id') id: string,
        @Body() addCommentDto: AddCommentDto,
    ) {
        return this.coursesService.addComment(user, id, addCommentDto.text);
    }

    @Post('comments/:commentId/like')
    @ApiOperation({ summary: 'Curtir ou descurtir um comentário' })
    async toggleLikeComment(
        @CurrentUser() user: User,
        @Param('commentId') commentId: string,
    ) {
        return this.coursesService.toggleLikeComment(user.id, commentId);
    }
}

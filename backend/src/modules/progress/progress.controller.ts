import { Controller, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ProgressService } from './progress.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { MarkProgressDto } from './dto/mark-progress.dto';
import { RateLessonDto } from './dto/rate-lesson.dto';
import { User } from '../../database/entities/user.entity';

@ApiTags('Progresso')
@ApiBearerAuth()
@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
    constructor(private readonly progressService: ProgressService) {}

    @Post('lessons/complete')
    @ApiOperation({ summary: 'Marcar aula como completa' })
    @ApiResponse({ status: 200, description: 'Progresso atualizado.' })
    async completeLesson(
        @CurrentUser() user: User,
        @Body() markProgressDto: MarkProgressDto,
    ) {
        return this.progressService.markLessonAsComplete(user, markProgressDto.lessonId);
    }

    @Post(':lessonId/toggle')
    @ApiOperation({ summary: 'Alternar estado de conclusão de uma aula' })
    @ApiResponse({ status: 200, description: 'Estado alternado com sucesso.' })
    async toggleLesson(
        @CurrentUser() user: User,
        @Param('lessonId') lessonId: string,
    ) {
        return this.progressService.toggleLessonCompletion(user, lessonId);
    }

    @Post('lessons/rate')
    @ApiOperation({ summary: 'Avaliar uma aula' })
    @ApiResponse({ status: 200, description: 'Avaliação registrada.' })
    async rateLesson(
        @CurrentUser() user: User,
        @Body() rateLessonDto: RateLessonDto,
    ) {
        return this.progressService.rateLesson(user, rateLessonDto.lessonId, rateLessonDto.rating);
    }
}

import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { QuizzesService } from './quizzes.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { User } from '../../database/entities/user.entity';

@ApiTags('Quizzes')
@ApiBearerAuth()
@Controller('quizzes')
@UseGuards(JwtAuthGuard)
export class QuizzesController {
    constructor(private readonly quizzesService: QuizzesService){}

    @Get(':moduleId')
    @ApiOperation({ summary: 'Obter quiz por ID do módulo' })
    @ApiResponse({ status: 200, description: 'Quiz retornado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Quiz não encontrado.' })
    async getQuizForModule(@Param('moduleId') moduleId: string) {
        return this.quizzesService.getQuizByModule(moduleId);
    }

    @Post('submit')
    @ApiOperation({ summary: 'Submeter respostas de um quiz' })
    @ApiResponse({ status: 200, description: 'Respostas processadas e pontuação retornada.' })
    @ApiResponse({ status: 404, description: 'Quiz não encontrado.' })
    @Post('submit')
    async submitQuiz(
        @CurrentUser() user: User,
        @Body() submitQuizDto: SubmitQuizDto,
    ) {
        return this.quizzesService.submitQuiz(user, submitQuizDto);
    }
}

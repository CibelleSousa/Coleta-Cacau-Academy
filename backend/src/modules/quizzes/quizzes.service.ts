import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Quiz } from '../../database/entities/quiz.entity';
import { QuizAttempt } from '../../database/entities/quiz-attempt.entity';
import { User } from '../../database/entities/user.entity';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Injectable()
export class QuizzesService {
    constructor(
        @InjectRepository(Quiz)
        private readonly quizRepository: Repository<Quiz>,
        @InjectRepository(QuizAttempt)
        private readonly attemptRepository: Repository<QuizAttempt>,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async getQuizByModule(moduleId: string) {
        const quiz = await this.quizRepository.findOne({
            where: { moduleId },
            relations: ['questions', 'questions.options'],
        });

        if (!quiz) {
            throw new NotFoundException('Quiz not found for this module');
        }

        // SECURITY: Strip the 'isCorrect' flag from options before sending to client
        const safeQuestions = quiz.questions.map((q) => ({
            id: q.id,
            text: q.text,
            options: q.options.map((opt) => ({
                id: opt.id,
                text: opt.text,
            })),
        }));

        return {
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            passingScore: quiz.passingScore,
            questions: safeQuestions,
        };
    }

    async submitQuiz(user: User, submitQuizDto: SubmitQuizDto) {
        const quiz = await this.quizRepository.findOne({
            where: { id: submitQuizDto.quizId },
            relations: ['questions', 'questions.options'],
        });

        if (!quiz) {
            throw new NotFoundException('Quiz not found');
        }

        const totalQuestions = quiz.questions.length;
        let correctCount = 0;

        // Using a Map to ensure O(1) lookup and prevent duplicate answer manipulation
        const answerMap = new Map<string, string>();
        for (const answer of submitQuizDto.answers) {
            if (!answerMap.has(answer.questionId)) {
                answerMap.set(answer.questionId, answer.selectedOptionId);
            }
        }

        for (const question of quiz.questions) {
            const userAnswerOptionId = answerMap.get(question.id);
            if (!userAnswerOptionId) continue;

            const correctOption = question.options.find((opt) => opt.isCorrect);
            if (correctOption && userAnswerOptionId === correctOption.id) {
                correctCount++;
            }
        }

        const scorePercentage = totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100);
        const passed = totalQuestions === 0? false : scorePercentage >= quiz.passingScore;

        // Save attempt record
        const attempt = this.attemptRepository.create({
            userId: user.id,
            quizId: quiz.id,
            score: scorePercentage,
            passed,
        });
        await this.attemptRepository.save(attempt);

        if (passed) {
            this.eventEmitter.emit('quiz.passed', { user });
        }

        return {
            score: scorePercentage,
            passed,
            correctCount,
            totalQuestions,
        };
    }
}

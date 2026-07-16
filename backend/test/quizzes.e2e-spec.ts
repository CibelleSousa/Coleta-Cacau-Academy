import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { agent as request } from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { QuizzesModule } from '../src/modules/quizzes/quizzes.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Quiz } from '../src/database/entities/quiz.entity';
import { QuizAttempt } from '../src/database/entities/quiz-attempt.entity';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('QuizzesController (e2e)', () => {
    let app: INestApplication;

    const mockUser = { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Test User' };

    // Valid UUIDs for DTOs
    const moduleId = '123e4567-e89b-12d3-a456-426614174000';
    const quizId = '223e4567-e89b-12d3-a456-426614174000';
    const questionId = '323e4567-e89b-12d3-a456-426614174000';
    const correctOptionId = '423e4567-e89b-12d3-a456-426614174000';

    // Mock Quiz Data
    const mockQuiz = {
        id: quizId,
        moduleId,
        title: 'Test Quiz',
        passingScore: 50,
        questions: [
            {
                id: questionId,
                text: 'What is React Native?',
                options: [
                    { id: correctOptionId, text: 'A framework', isCorrect: true },
                    { id: '523e4567-e89b-12d3-a456-426614174000', text: 'A language', isCorrect: false },
                ],
            },
        ],
    };

    // Mock Repositories
    const mockQuizRepo = {
        findOne: jest.fn().mockResolvedValue(mockQuiz),
    };

    const mockAttemptRepo = {
        create: jest.fn().mockImplementation((dto) => dto),
        save: jest.fn().mockResolvedValue({}),
    };

    // Mock EventEmitter2
    const mockEventEmitter = {
        emit: jest.fn(),
        removeAllListeners: jest.fn(),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true }),
                EventEmitterModule.forRoot(),
                QuizzesModule,
            ],
        })
        .overrideProvider(getRepositoryToken(Quiz))
        .useValue(mockQuizRepo)
        .overrideProvider(getRepositoryToken(QuizAttempt))
        .useValue(mockAttemptRepo)
        .overrideProvider(EventEmitter2)
        .useValue(mockEventEmitter)
        .overrideGuard(JwtAuthGuard)
        .useValue({ canActivate: () => true })
        .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

        // Inject mock user
        app.use((req, res, next) => {
            req.user = mockUser;
            next();
        });

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /quizzes/:moduleId', () => {
        it('should return 200 and the quiz for the given module', async () => {
            const response = await request(app.getHttpServer())
                .get(`/quizzes/${moduleId}`)
                .expect(200);

            expect(response.body).toHaveProperty('id', quizId);
            expect(response.body.questions[0].options[0]).not.toHaveProperty('isCorrect'); // Security: should be stripped
            
            expect(mockQuizRepo.findOne).toHaveBeenCalledWith({
                where: { moduleId },
                relations: ['questions', 'questions.options'],
            });
        });
    });

    describe('POST /quizzes/submit', () => {
        it('should calculate score, save attempt, emit quiz.passed event, and return 201', async () => {
            const payload = {
                quizId,
                answers: [
                    { questionId, selectedOptionId: correctOptionId }, // Correct answer
                ],
            };

            const response = await request(app.getHttpServer())
                .post('/quizzes/submit')
                .send(payload)
                .expect(201);

            // Verify response body
            expect(response.body).toHaveProperty('score', 100); // 1/1 correct = 100%
            expect(response.body).toHaveProperty('passed', true);
            expect(response.body).toHaveProperty('correctCount', 1);
            expect(response.body).toHaveProperty('totalQuestions', 1);

            // Verify attempt was saved
            expect(mockAttemptRepo.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    userId: mockUser.id,
                    quizId,
                    score: 100,
                    passed: true,
                })
            );

            // CRITICAL: Verify the event was emitted
            expect(mockEventEmitter.emit).toHaveBeenCalledWith('quiz.passed', { user: mockUser });
        });

        it('should return 400 if payload is invalid (missing answers)', async () => {
            const payload = { quizId }; // Missing answers array

            await request(app.getHttpServer())
                .post('/quizzes/submit')
                .send(payload)
                .expect(400);
        });
    });
});

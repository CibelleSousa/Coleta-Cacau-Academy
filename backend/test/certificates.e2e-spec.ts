import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { agent as request } from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { CertificatesModule } from '../src/modules/certificates/certificates.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Lesson } from '../src/database/entities/lesson.entity';
import { UserProgress } from '../src/database/entities/user-progress.entity';
import { Quiz } from '../src/database/entities/quiz.entity';
import { QuizAttempt } from '../src/database/entities/quiz-attempt.entity';
import { Certification } from '../src/database/entities/certification.entity';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';

describe('CertificatesController (e2e)', () => {
    let app: INestApplication;

    const mockUser = { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Test User' };

    // Mock Repositories
    const mockLessonRepo = { count: jest.fn() };
    const mockProgressRepo = { count: jest.fn() };
    const mockQuizRepo = { count: jest.fn() };
    const mockAttemptRepo = { find: jest.fn() };
    const mockCertRepo = { findOne: jest.fn(), create: jest.fn().mockImplementation(dto => dto), save: jest.fn() };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true }),
                CertificatesModule,
            ],
        })
        .overrideProvider(getRepositoryToken(Lesson))
        .useValue(mockLessonRepo)
        .overrideProvider(getRepositoryToken(UserProgress))
        .useValue(mockProgressRepo)
        .overrideProvider(getRepositoryToken(Quiz))
        .useValue(mockQuizRepo)
        .overrideProvider(getRepositoryToken(QuizAttempt))
        .useValue(mockAttemptRepo)
        .overrideProvider(getRepositoryToken(Certification))
        .useValue(mockCertRepo)
        .overrideGuard(JwtAuthGuard)
        .useValue({ canActivate: () => true })
        .compile();

        app = moduleFixture.createNestApplication();

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

    describe('GET /certificates/issue', () => {
        it('Scenario 1 (Not Eligible): should return 403 if lessons are not completed', async () => {
            // Mock: 10 lessons total, only 5 completed
            mockLessonRepo.count.mockResolvedValue(10);
            mockProgressRepo.count.mockResolvedValue(5);

            const response = await request(app.getHttpServer())
                .get('/certificates/issue')
                .expect(403);

            expect(response.body).toHaveProperty('statusCode', 403);
            expect(response.body).toHaveProperty('message', 'You have not completed all lessons yet.');
        });

        it('Scenario 2 (Eligible): should return 200 and stream a PDF if all requirements are met', async () => {
            // Mock: 1 lesson total, 1 completed
            mockLessonRepo.count.mockResolvedValue(1);
            mockProgressRepo.count.mockResolvedValue(1);

            // Mock: 1 quiz total, user passed 1 unique quiz
            mockQuizRepo.count.mockResolvedValue(1);
            mockAttemptRepo.find.mockResolvedValue([{ quizId: 'quiz-uuid-1' }]);

            // Mock: Certificate does not exist yet
            mockCertRepo.findOne.mockResolvedValue(null);

            const response = await request(app.getHttpServer())
                .get('/certificates/issue')
                .expect(200);

            // Verify headers for PDF streaming
            expect(response.headers['content-type']).toContain('application/pdf');
            expect(response.headers['content-disposition']).toContain('inline; filename="Certificado de Conclusao - Desenvolvimento Mobile com React Native.pdf"');
            
            // Verify the body is a Buffer (PDF data)
            expect(Buffer.isBuffer(response.body)).toBe(true);
            
            // Verify certificate was saved to DB
            expect(mockCertRepo.save).toHaveBeenCalled();
        });
    });
});

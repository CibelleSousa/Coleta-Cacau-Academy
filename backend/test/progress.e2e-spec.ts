import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { agent as request } from 'supertest';
import { ProgressModule } from '../src/modules/progress/progress.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserProgress } from '../src/database/entities/user-progress.entity';
import { Lesson } from '../src/database/entities/lesson.entity';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';

describe('ProgressController (e2e)', () => {
    let app: INestApplication;

    const mockUser = { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Test User' };
    const validLessonId = '123e4567-e89b-12d3-a456-426614174000'; // Valid UUID for DTO

    // Mock Repositories
    const mockLessonRepo = {
        findOne: jest.fn().mockResolvedValue({ id: validLessonId, title: 'Test Lesson' }),
    };

    const mockUserProgressRepo = {
        findOne: jest.fn().mockResolvedValue(null), // No existing progress
        create: jest.fn().mockImplementation((dto) => dto),
        save: jest.fn().mockImplementation((entity) => Promise.resolve({...entity, id: 'progress-uuid'})),
        remove: jest.fn().mockResolvedValue(undefined),
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
                ProgressModule,
            ],
        })
        .overrideProvider(getRepositoryToken(UserProgress))
        .useValue(mockUserProgressRepo)
        .overrideProvider(getRepositoryToken(Lesson))
        .useValue(mockLessonRepo)
        // CRITICAL: Mock EventEmitter2 to prevent startup errors and verify emission
        .overrideProvider(EventEmitter2)
        .useValue(mockEventEmitter)
        .overrideGuard(JwtAuthGuard)
        .useValue({ canActivate: () => true })
        .compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

        // Inject mock user into request for @CurrentUser()
        app.use((req, res, next) => {
            req.user = mockUser;
            next();
        });

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /progress/lessons/complete', () => {
        it('should mark a lesson as complete, return 201, and emit event', async () => {
            const payload = { lessonId: validLessonId };

            const response = await request(app.getHttpServer())
                .post('/progress/lessons/complete')
                .send(payload)
                .expect(201); // NestJS default for POST

            // Verify response
            expect(response.body).toHaveProperty('message', 'Progress updated successfully');
            expect(response.body).toHaveProperty('lessonId', validLessonId);
            expect(response.body).toHaveProperty('done', true);

            // Verify lesson was fetched
            expect(mockLessonRepo.findOne).toHaveBeenCalledWith({ where: { id: validLessonId } });

            // Verify progress was saved
            expect(mockUserProgressRepo.save).toHaveBeenCalled();

            // CRITICAL: Verify the event was emitted
            expect(mockEventEmitter.emit).toHaveBeenCalledWith('lesson.completed', { user: mockUser });
        });

        it('should return 400 Bad Request if lessonId is not a valid UUID', async () => {
            const payload = { lessonId: 'invalid-uuid' };

            await request(app.getHttpServer())
                .post('/progress/lessons/complete')
                .send(payload)
                .expect(400); // Fails ValidationPipe
        });
    });

    describe('POST /progress/:lessonId/toggle', () => {
        it('should mark a lesson as complete (Like) and return 201', async () => {
            mockUserProgressRepo.findOne.mockResolvedValue(null); // Not completed yet
            const response = await request(app.getHttpServer())
                .post(`/progress/${validLessonId}/toggle`)
                .expect(201);

            expect(response.body).toHaveProperty('lessonId', validLessonId);
            expect(response.body).toHaveProperty('done', true);
            expect(mockUserProgressRepo.save).toHaveBeenCalled();
        });

        it('should unmark a completed lesson (Unlike) and return 201', async () => {
            mockUserProgressRepo.findOne.mockResolvedValue({ id: 'progress-uuid', lessonId: validLessonId, userId: mockUser.id, completed: true }); // Already completed
            const response = await request(app.getHttpServer())
                .post(`/progress/${validLessonId}/toggle`)
                .expect(201);

            expect(response.body).toHaveProperty('done', false);
            expect(mockUserProgressRepo.remove).toHaveBeenCalled();
        });
    });
});
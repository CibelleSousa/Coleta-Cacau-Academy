import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { agent as request }from 'supertest';
import { CourseModule } from '../src/modules/courses/courses.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CourseModule as CourseModuleEntity } from '../src/database/entities/course-module.entity';
import { Lesson } from '../src/database/entities/lesson.entity';
import { UserProgress } from '../src/database/entities/user-progress.entity';
import { LessonComment } from '../src/database/entities/lesson-comment.entity';
import { CommentLike } from '../src/database/entities/comment-like.entity';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';

describe('CoursesController (e2e)', () => {
    let app: INestApplication;

    const mockUser = { id: '123e4567-e89b-12d3-a456-426614174000', name: 'Test User' };
    const commentId = '323e4567-e89b-12d3-a456-426614174000';

    // Mock Data
    const mockModules = [
        {
            id: 'module-uuid-1',
            title: '1. Introdução',
            description: 'Intro module',
            order: 1,
            type: 'THEORY',
            lessons: [
                {   id: 'lesson-uuid-1', 
                    title: 'Lesson 1', 
                    slug: 'lesson-1', 
                    duration: '10 min', 
                    type: 'read' 
                },
            ],
        },
    ];

    const mockLesson = {
        id: 'lesson-uuid-1',
        title: 'Lesson 1',
        slug: 'lesson-1',
        content: 'Lesson content here',
        videoUrl: null,
        duration: '10 min',
        type: 'read',
        module: { id: 'module-uuid-1', title: '1. Introdução' },
    };

    const mockComment = {
        id: commentId,
        text: 'Test comment',
        createdAt: new Date(),
        userId: mockUser.id,
        lessonId: mockLesson.id,
        user: { id: mockUser.id, name: mockUser.name, avatarUrl: null },
        likes: []
    };

    // Mock Repositories
    const mockCourseModuleRepo = {
        find: jest.fn().mockResolvedValue(mockModules),
    };

    const mockLessonRepo = {
        findOne: jest.fn().mockResolvedValue(mockLesson),
    };

    const mockUserProgressRepo = {
        find: jest.fn().mockResolvedValue([{ lessonId: 'lesson-uuid-1', completed: true }]),
        findOne: jest.fn().mockResolvedValue(null), // For getLessonById
    };

    const mockCommentRepo = {
        find: jest.fn().mockResolvedValue([mockComment]),
        findOne: jest.fn().mockResolvedValue(mockComment),
        create: jest.fn().mockImplementation(dto => dto),
        save: jest.fn(),
    };

    const mockLikeRepo = {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation(dto => dto),
        save: jest.fn(),
        remove: jest.fn(),
        count: jest.fn().mockResolvedValue(1)
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true }),
                CourseModule,
            ],
        })
        .overrideProvider(getRepositoryToken(CourseModuleEntity))
        .useValue(mockCourseModuleRepo)
        .overrideProvider(getRepositoryToken(Lesson))
        .useValue(mockLessonRepo)
        .overrideProvider(getRepositoryToken(UserProgress))
        .useValue(mockUserProgressRepo)
        .overrideProvider(getRepositoryToken(LessonComment))
        .useValue(mockCommentRepo)
        .overrideProvider(getRepositoryToken(CommentLike))
        .useValue(mockLikeRepo)
        .overrideGuard(JwtAuthGuard)
        .useValue({ canActivate: () => true })
        .compile();

        app = moduleFixture.createNestApplication();

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

    describe('GET /courses/modules', () => {
        it('should return 200 and a list of modules with progress', async () => {
            const response = await request(app.getHttpServer())
                .get('/courses/modules')
                .expect(200);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0]).toHaveProperty('id', 'module-uuid-1');
            expect(response.body[0].lessons[0]).toHaveProperty('done', true); // Because our mock progress matched
            
            // Verify repository calls
            expect(mockCourseModuleRepo.find).toHaveBeenCalled();
            expect(mockUserProgressRepo.find).toHaveBeenCalledWith({
                where: { userId: mockUser.id, completed: true },
            });
        });
    });

    describe('GET /courses/lessons/:id', () => {
        it('should return 200 and the specific lesson details', async () => {
            const response = await request(app.getHttpServer())
                .get('/courses/lessons/lesson-uuid-1')
                .expect(200);

            expect(response.body).toHaveProperty('id', 'lesson-uuid-1');
            expect(response.body).toHaveProperty('title', 'Lesson 1');
            expect(response.body).toHaveProperty('module.title', '1. Introdução');
            
            // Verify repository calls
            expect(mockLessonRepo.findOne).toHaveBeenCalledWith({
                where: { id: 'lesson-uuid-1' },
                relations: ['module'],
            });
        });
    });

    describe('POST /courses/comments/:commentId/like', () => {
        it('should toggle like successfully (Like)', async () => {
            mockLikeRepo.findOne.mockResolvedValue(null); // No existing like
            const response = await request(app.getHttpServer())
                .post(`/courses/comments/${commentId}/like`)
                .expect(201);

            expect(response.body).toHaveProperty('isLiked', true);
            expect(response.body).toHaveProperty('likeCount', 1);
            expect(mockLikeRepo.save).toHaveBeenCalled();
        });

        it('should toggle like successfully (Unlike)', async () => {
            mockLikeRepo.findOne.mockResolvedValue({ userId: mockUser.id, commentId }); // Existing like found
            const response = await request(app.getHttpServer())
                .post(`/courses/comments/${commentId}/like`)
                .expect(201);

            expect(response.body).toHaveProperty('isLiked', false);
            expect(mockLikeRepo.remove).toHaveBeenCalled();
        });
    });
});
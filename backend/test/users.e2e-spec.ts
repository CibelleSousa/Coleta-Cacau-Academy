import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import {agent as request} from 'supertest';
import { UsersModule } from '../src/modules/users/users.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/database/entities/user.entity';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { ConfigModule } from '@nestjs/config';

describe('UsersController (e2e)', () => {
    let app: INestApplication;

    // Mock user data
    const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Test User',
        email: 'test@test.com',
        avatarUrl: 'http://example.com/avatar.png',
        role: 'STUDENT',
        streakCount: 0,
    };

    // Mock User Repository
    const mockUserRepository = {
        findOne: jest.fn().mockResolvedValue(mockUser),
        save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true }),
                UsersModule,
            ],
        })
        .overrideProvider(getRepositoryToken(User))
        .useValue(mockUserRepository)
        // Bypass JWT Auth Guard entirely
        .overrideGuard(JwtAuthGuard)
        .useValue({ canActivate: () => true })
        .compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

        // Middleware to inject a mock user into the request for the @CurrentUser() decorator
        app.use((req, res, next) => {
            req.user = mockUser;
            next();
        });

        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /users/me', () => {
        it('should return 200 and the user profile', async () => {
            const response = await request(app.getHttpServer())
                .get('/users/me')
                .expect(200);

            expect(response.body).toEqual({
                id: mockUser.id,
                name: mockUser.name,
                email: mockUser.email,
                avatarUrl: mockUser.avatarUrl,
                role: mockUser.role,
                streakCount: mockUser.streakCount,
            });
        });
    });

    describe('PATCH /users/me', () => {
        it('should update the user name and return 200 with updated profile', async () => {
            const updateDto = { name: 'Updated Name' };

            // Update mock to return the updated name on save
            mockUserRepository.save.mockResolvedValue({ ...mockUser, ...updateDto });

            const response = await request(app.getHttpServer())
                .patch('/users/me')
                .send(updateDto)
                .expect(200);

            expect(response.body.name).toBe('Updated Name');
            expect(response.body.id).toBe(mockUser.id);
            
            // Verify repository methods were called correctly
            expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
            expect(mockUserRepository.save).toHaveBeenCalled();
        });

        it('should return 400 if name is shorter than 3 characters', async () => {
            const updateDto = { name: 'ab' };
            await request(app.getHttpServer())
                .patch('/users/me')
                .send(updateDto)
                .expect(400);
        });
    });
});
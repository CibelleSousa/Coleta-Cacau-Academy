import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { agent as request} from 'supertest';
import { AuthModule } from '../src/modules/auth/auth.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/database/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('AuthController (e2e)', () => {
    let app: INestApplication;

    // Mock User Repository
    const mockUserRepository = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    // Mock ConfigService to return fake secrets for our strategies
    const mockConfigService = {
        get: jest.fn((key: string) => {
            const config: Record<string, string> = {
                'jwt.secret': 'test_jwt_secret',
                'jwt.expiresIn': '1h',
                // Chaves flat usadas no google.strategy.ts
                'GOOGLE_CLIENT_ID': 'test_google_client_id',
                'GOOGLE_CLIENT_SECRET': 'test_google_client_secret',
                'GOOGLE_CALLBACK_URL': 'http://localhost:3001/auth/google/callback',
                // Chaves aninhadas (mantidas para compatibilidade com controllers)
                'google.clientID': 'test_google_client_id',
                'google.clientSecret': 'test_google_client_secret',
                'google.callbackURL': 'http://localhost:3001/auth/google/callback',
                'frontendUrl': 'http://localhost:3000',
                'nodeEnv': 'test'
            };
            return config[key];
        }),
    };

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ isGlobal: true }),
                AuthModule
            ],
        })
        .overrideProvider(getRepositoryToken(User))
        .useValue(mockUserRepository)
        .overrideProvider(ConfigService)
        .useValue(mockConfigService)
        .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /auth/logout', () => {
        it('should return 200 and clear the access_token cookie', async () => {
            const response = await request(app.getHttpServer())
                .get('/auth/logout')
                .expect(200);

            // Verify the response body
            expect(response.body).toHaveProperty('message', 'Logged out successfully');

            // Verify the Set-Cookie header clears the access_token
            const setCookieHeader = response.headers['set-cookie'];
            expect(setCookieHeader).toBeDefined();
            
            const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
            const accessTokenCookie = cookieArray.find((cookie: string) => cookie.startsWith('access_token='));
            
            expect(accessTokenCookie).toBeDefined();
            // A cleared cookie usually has an immediate expiration or empty value
            expect(accessTokenCookie).toContain('access_token=;');
        });
    });

    describe('GET /auth/google', () => {
        it('should initiate Google OAuth flow and return 302 Redirect', async () => {
            const response = await request(app.getHttpServer())
                .get('/auth/google')
                .expect(302);

            // Verify it redirects to Google's OAuth endpoint
            expect(response.headers.location).toContain('accounts.google.com');
        });
    });
});
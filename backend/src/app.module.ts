import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { CertificatesModule } from './modules/certificates/certificates.module';
import { CourseModule } from './modules/courses/courses.module';
import { ProgressModule } from './modules/progress/progress.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { UsersModule } from './modules/users/users.module';
import { RolesGuard } from './common/guards/roles.guard';
import { StreakInterceptor } from './common/interceptors/streak.interceptor';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    EventEmitterModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    DatabaseModule,
    AuthModule,
    CertificatesModule,
    CourseModule,
    ProgressModule,
    QuizzesModule,
    UsersModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Interceptors rodam depois dos guards, então request.user já existe.
    {
      provide: APP_INTERCEPTOR,
      useClass: StreakInterceptor,
    },
    RolesGuard
  ],
})
export class AppModule {}

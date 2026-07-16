import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';


import { User } from './entities/user.entity';
import { CourseModule } from './entities/course-module.entity';
import { Lesson } from './entities/lesson.entity';
import { Quiz } from './entities/quiz.entity';
import { Question } from './entities/question.entity';
import { Option } from './entities/option.entity';
import { UserProgress } from './entities/user-progress.entity';
import { QuizAttempt } from './entities/quiz-attempt.entity';
import { Certification } from './entities/certification.entity';
import { LessonComment } from './entities/lesson-comment.entity';
import { CommentLike } from './entities/comment-like.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [
          User,
          CourseModule,
          Lesson,
          Quiz,
          Question,
          Option,
          UserProgress,
          QuizAttempt,
          Certification,
          LessonComment,
          CommentLike
        ],
        synchronize: configService.get<string>('nodeEnv') === 'development', // Disable in production!
        logging: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
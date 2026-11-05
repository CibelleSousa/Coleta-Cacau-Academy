import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';


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
        // O schema é controlado por migrations (src/database/migrations).
        // synchronize infere o schema das entidades e pode apagar dados sem aviso —
        // nunca é usado, nem em desenvolvimento, para que dev e produção sigam
        // exatamente o mesmo caminho.
        synchronize: false,
        // __dirname aponta para dist/database em tempo de execução.
        migrations: [path.join(__dirname, 'migrations', '*.js')],
        // Aplica migrations pendentes no boot. Simplifica o deploy (um passo a
        // menos), mas assume uma única instância subindo por vez. Com várias
        // réplicas, troque por um passo explícito de `npm run migration:run`
        // antes de subir a aplicação.
        migrationsRun: true,
        logging: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
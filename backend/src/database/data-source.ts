import 'dotenv/config';
import { DataSource } from 'typeorm';

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

/**
 * DataSource usado exclusivamente pela CLI do TypeORM (generate/run/revert).
 *
 * A aplicação continua configurada em database.module.ts via forRootAsync —
 * aquela forma não é acessível pela CLI, que precisa de um DataSource exportado
 * como default de um arquivo.
 *
 * `synchronize` é sempre false aqui: a partir de agora o schema é controlado
 * por migrations, nunca inferido das entidades.
 */
export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
    CommentLike,
  ],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: false,
});

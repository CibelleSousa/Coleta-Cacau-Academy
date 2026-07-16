import 'dotenv/config';
import { DataSource, Repository } from 'typeorm';
import { CourseModule, ModuleType } from './entities/course-module.entity';
import { Lesson, LessonType } from './entities/lesson.entity';
import { Quiz } from './entities/quiz.entity';
import { Question } from './entities/question.entity';
import { Option } from './entities/option.entity';
import { Modules } from './data';
import { SeedModule } from './data/types';
import { UserProgress } from './entities/user-progress.entity';
import { User } from './entities/user.entity';
import { QuizAttempt } from './entities/quiz-attempt.entity';
import { Certification } from './entities/certification.entity';
import { LessonComment } from './entities/lesson-comment.entity';
import { CommentLike } from './entities/comment-like.entity';

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [CourseModule, Lesson, Quiz, Question, Option, UserProgress, User, QuizAttempt, Certification, LessonComment, CommentLike],
    synchronize: true,
});

async function seed() {
    try {
        console.log('Initializing database connection...');
        await AppDataSource.initialize();

        const moduleRepo = AppDataSource.getRepository(CourseModule);
        const lessonRepo = AppDataSource.getRepository(Lesson);
        const quizRepo = AppDataSource.getRepository(Quiz);
        const questionRepo = AppDataSource.getRepository(Question);
        const optionRepo = AppDataSource.getRepository(Option);

        console.log('Clearing existing modules and related data...');
        await moduleRepo.query('TRUNCATE TABLE "course_modules" CASCADE;');

        const modulesToSeed: SeedModule[] = [
            Modules.module1,
            Modules.module2,
            Modules.module3,
            Modules.module4,
            Modules.module5,
            Modules.module6,
            Modules.module8
        ];

        for (const data of modulesToSeed){
            console.log(`Seeding Module: ${data.title}`);

            const module = moduleRepo.create({
                title: data.title,
                description: data.description,
                order: data.order,
                duration: data.duration,
                type: data.type
            });
            await moduleRepo.save(module);

            const lessons = data.lessons.map(l => lessonRepo.create({
                ...l,
                module: module,
            }));
            await lessonRepo.save(lessons);

            if (data.quiz) {
                const quiz = quizRepo.create({
                    title: data.quiz.title,
                    description: data.quiz.description,
                    passingScore: data.quiz.passingScore,
                    module: module
                });
                await quizRepo.save(quiz);

                for (const qData of data.quiz.questions) {
                    const question = questionRepo.create({
                        text: qData.text,
                        quiz: quiz
                    });
                    await questionRepo.save(question);

                    const options = qData.options.map(opt => optionRepo.create({
                        text: opt.text,
                        isCorrect: opt.isCorrect,
                        question: question
                    }));
                    await optionRepo.save(options);
                }
            }
        }
        console.log('Curriculum seeded successfully!');
    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        await AppDataSource.destroy();
    }
}

seed();

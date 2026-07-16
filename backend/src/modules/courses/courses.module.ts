import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CourseModule as CourseModuleEntity } from '../../database/entities/course-module.entity';
import { Lesson } from '../../database/entities/lesson.entity';
import { UserProgress } from '../../database/entities/user-progress.entity';
import { LessonComment } from '../../database/entities/lesson-comment.entity';
import { CommentLike } from '../../database/entities/comment-like.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            CourseModuleEntity,
            Lesson,
            UserProgress,
            LessonComment,
            CommentLike,
        ]),
    ],
    controllers: [CoursesController],
    providers: [CoursesService],
    exports: [CoursesService],
})
export class CourseModule {}
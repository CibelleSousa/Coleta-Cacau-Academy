import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseModule } from '../../database/entities/course-module.entity';
import { Lesson } from '../../database/entities/lesson.entity';
import { UserProgress } from '../../database/entities/user-progress.entity';
import { LessonComment } from '../../database/entities/lesson-comment.entity';
import { CommentLike } from '../../database/entities/comment-like.entity';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(CourseModule)
        private readonly moduleRepository: Repository<CourseModule>,
        @InjectRepository(Lesson)
        private readonly lessonRepository: Repository<Lesson>,
        @InjectRepository(UserProgress)
        private readonly progressRepository: Repository<UserProgress>,
        @InjectRepository(LessonComment)
        private readonly commentRepository: Repository<LessonComment>,
        @InjectRepository(CommentLike)
        private readonly likeRepository: Repository<CommentLike>,
    ) {}

    async getAllModulesWithProgress(user: User) {
        // Fetch all modules along with their lessons
        const modules = await this.moduleRepository.find({
            relations: ['lessons'],
            order: { order: 'ASC' },
        });

        // Fetch all progress records for this specific user
        const userProgress = await this.progressRepository.find({
            where: { userId: user.id, completed: true },
        });
        const completedLessonIds = new Set(userProgress.map((p) => p.lessonId));

        // Map the progress state onto the lesson objects safely
        return modules.map((module) => {
            const lessons = module.lessons.map((lesson) => ({
                id: lesson.id,
                title: lesson.title,
                slug: lesson.slug,
                duration: lesson.duration,
                type: lesson.type,
                done: completedLessonIds.has(lesson.id),
            }));

            return {
                id: module.id,
                title: module.title,
                description: module.description,
                order: module.order,
                type: module.type,
                lessons,
            };
        });
    }

    async getLessonById(user: User, lessonId: string) {
        const lesson = await this.lessonRepository.findOne({
            where: { id: lessonId },
            relations: ['module'],
        });

        if (!lesson) {
            throw new NotFoundException('Lesson not found');
        }

        // Check if the user has completed this specific lesson
        const progress = await this.progressRepository.findOne({
            where: { userId: user.id, lessonId: lesson.id },
        });

        return {
            id: lesson.id,
            title: lesson.title,
            slug: lesson.slug,
            content: lesson.content,
            subtitle: lesson.subtitle,
            description: lesson.description,
            videoUrl: lesson.videoUrl,
            duration: lesson.duration,
            type: lesson.type,
            done: progress?.completed || false,
            rating: progress?.rating || null,
            module: {
                id: lesson.module.id,
                title: lesson.module.title,
            },
        };
    }

    async getLessonComments(userId: string, lessonId: string) {
        const comments = await this.commentRepository.find({
            where: { lessonId },
            relations: ['user', 'likes'],
            order: { createdAt: 'DESC' },
        });

        return comments.map((c) => {
            const likeCount = c.likes ? c.likes.length : 0;
            const isLiked = c.likes ? c.likes.some(like => like.userId === userId) : false;
            return {
                id: c.id,
                text: c.text,
                createdAt: c.createdAt,
                user: {
                    id: c.user.id,
                    name: c.user.name,
                    avatarUrl: c.user.avatarUrl
                },
                likeCount,
                isLiked
            }
        });
    }

    async addComment(user: User, lessonId: string, text: string) {
        const lesson = await this.lessonRepository.findOne({ where: { id: lessonId } });
        if(!lesson){
            throw new NotFoundException('Lesson not found');
        }

        const comment = this.commentRepository.create({
            userId: user.id,
            lessonId,
            text,
        });

        await this.commentRepository.save(comment);

        return {
            id: comment.id,
            text: comment.text,
            createdAt: comment.createdAt,
            user: {
                id: user.id,
                name: user.name,
                avatarUrl: user.avatarUrl
            },
            likeCount: 0,
            isLiked: false,
        };
    }

    async toggleLikeComment(userId: string, commentId: string) {
        const comment = await this.commentRepository.findOne({ where: { id: commentId } });
        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        const existingLike = await this.likeRepository.findOne({ 
            where: { userId, commentId } 
        });

        if (existingLike) {
            await this.likeRepository.remove(existingLike);
            
            const likeCount = await this.likeRepository.count({ where: { commentId } });
            
            return { 
                id: commentId, 
                isLiked: false, 
                likeCount 
            };
        } else {
            const like = this.likeRepository.create({ userId, commentId });
            
            await this.likeRepository.save(like);
            
            const likeCount = await this.likeRepository.count({ where: { commentId } });
            
            return { 
                id: commentId, 
                isLiked: true, 
                likeCount 
            };
        }
    }
}
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Lesson } from './lesson.entity';
import { CommentLike } from './comment-like.entity';

@Entity('lesson_comments')
export class LessonComment {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index()
    @Column({ type: 'uuid' })
    userId!: string;

    @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
    user!: User;

    @Index()
    @Column({ type: 'uuid' })
    lessonId!: string;

    @ManyToOne(() => Lesson, (lesson) => lesson.comments, { onDelete: 'CASCADE' })
    lesson!: Lesson;

    @Column({ type: 'text' })
    text!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @OneToMany(() => CommentLike, (like) => like.comment)
    likes!: CommentLike[];
}
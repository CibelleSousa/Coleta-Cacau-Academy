import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { LessonComment } from './lesson-comment.entity';

@Entity('comment_likes')
export class CommentLike {
    @PrimaryColumn({ type: 'uuid' })
    userId!: string;

    @PrimaryColumn({ type: 'uuid' })
    commentId!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: User;

    @ManyToOne(() => LessonComment, (comment) => comment.likes, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'commentId' })
    comment!: LessonComment;

    @CreateDateColumn()
    createdAt!: Date;
}
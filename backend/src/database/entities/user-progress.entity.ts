import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Unique, Index } from 'typeorm';
import { User } from './user.entity';
import { Lesson } from './lesson.entity';

@Entity('user_progress')
@Unique(['userId', 'lessonId'])
export class UserProgress {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index()
    @Column({ type: 'uuid' })
    userId!: string;

    @ManyToOne(() => User, (user) => user.progress, { onDelete: 'CASCADE' })
    user!: User;

    @Index()
    @Column({ type: 'uuid' })
    lessonId!: string;

    @ManyToOne(() => Lesson, (lesson) => lesson.userProgress, { onDelete: 'CASCADE' })
    lesson!: Lesson;

    @Column({ default: false })
    completed!: boolean;

    // A coluna é nullable no banco; o tipo precisa refletir isso para que
    // desmarcar uma aula possa limpar a data sem recorrer a `as any`.
    @Column({ type: 'timestamptz', nullable: true })
    completedAt!: Date | null;

    @Column({ type: 'int', nullable: true })
    rating!: number | null;

    @CreateDateColumn()
    createdAt!: Date;
}

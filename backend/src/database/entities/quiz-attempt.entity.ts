import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { User } from './user.entity';

@Entity('quiz_attempts')
export class QuizAttempt {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index()
    @Column({ type: 'uuid' })
    userId!: string;

    @ManyToOne(() => User, (user) => user.quizAttempts, { onDelete: 'CASCADE' })
    user!: User;

    @Column({ type: 'uuid' })
    quizId!: string;

    @Column()
    score!: number;

    @Column()
    passed!: boolean;

    @CreateDateColumn()
    attemptedAt!: Date;
}

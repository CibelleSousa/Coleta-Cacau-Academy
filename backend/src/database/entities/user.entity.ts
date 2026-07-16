import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { UserProgress } from './user-progress.entity';
import { QuizAttempt } from './quiz-attempt.entity';
import { Certification } from './certification.entity';
import { LessonComment } from './lesson-comment.entity';

export enum UserRole {
    STUDENT = 'STUDENT',
    ADMIN = 'ADMIN',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index({ unique: true })
    @Column()
    googleId!: string;

    @Column()
    name!: string;

    @Index({ unique: true })
    @Column()
    email!: string;

    @Column({ nullable: true })
    avatarUrl!: string;

    @Column({ default: 0 })
    streakCount!: number;

    @Column({ type: 'date', nullable: true })
    lastLoginDate?: Date;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
    role!: UserRole;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => UserProgress, (progress) => progress.user)
    progress!: UserProgress[];

    @OneToMany(() => QuizAttempt, (attempt) => attempt.user)
    quizAttempts!: QuizAttempt[];

    @OneToMany(() => Certification, (cert) => cert.user)
    certifications!: Certification[];

    @OneToMany(() => LessonComment, (comment) => comment.user)
    comments!: LessonComment[];
}

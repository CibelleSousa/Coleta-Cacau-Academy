import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Index } from 'typeorm';
import { CourseModule } from './course-module.entity';
import { UserProgress } from './user-progress.entity';
import { LessonComment } from './lesson-comment.entity';

export enum LessonType {
    READ = 'READ',
    VIDEO = 'VIDEO',
}

@Entity('lessons')
export class Lesson {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index()
    @Column({ type: 'uuid' })
    moduleId!: string;

    @ManyToOne(() => CourseModule, (module) => module.lessons, { onDelete: 'CASCADE' })
    module!: CourseModule;

    @Column()
    title!: string;

    @Column({ nullable: true })
    subtitle!: string;

    @Column({ type: 'text', nullable: true })
    description!: string;

    @Index({ unique: true })
    @Column()
    slug!: string;

    @Column({ type: 'text', nullable: true })
    content!: string;

    @Column({ nullable: true })
    videoUrl!: string;

    @Column()
    duration!: string;

    @Column({ type: 'enum', enum: LessonType })
    type!: LessonType;

    @Column()
    order!: number;

    @OneToMany(() => UserProgress, (progress) => progress.lesson)
    userProgress!: UserProgress[];

    @OneToMany(() => LessonComment, (comment) => comment.lesson)
    comments!: LessonComment[];
}

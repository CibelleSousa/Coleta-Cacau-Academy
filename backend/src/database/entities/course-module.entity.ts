import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Lesson } from './lesson.entity';
import { Quiz } from './quiz.entity';

export enum ModuleType {
    THEORY = 'THEORY',
    PRACTICAL = 'PRACTICAL',
}

@Entity('course_modules')
export class CourseModule {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column()
    description!: string;

    @Column()
    order!: number;

    @Column()
    duration!: number;

    @Column({ type: 'enum', enum: ModuleType })
    type!: ModuleType;

    @OneToMany(() => Lesson, (lesson) => lesson.module, { cascade: true })
    lessons!: Lesson[];

    @OneToOne(() => Quiz, (quiz) => quiz.module, { cascade: true })
    quiz!: Quiz;
}

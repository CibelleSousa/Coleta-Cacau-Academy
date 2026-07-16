import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { CourseModule } from './course-module.entity';
import { Question } from './question.entity';

@Entity('quizzes')
export class Quiz {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid', unique: true })
    moduleId!: string;

    @OneToOne(() => CourseModule, (module) => module.quiz, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'moduleId' })
    module!: CourseModule;

    @Column()
    title!: string;

    @Column({ nullable: true })
    description!: string;

    @Column({ default: 70 })
    passingScore!: number;

    @OneToMany(() => Question, (question) => question.quiz, { cascade: true })
    questions!: Question[];
}

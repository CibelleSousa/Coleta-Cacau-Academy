import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { Question } from './question.entity';

@Entity('options')
export class Option {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index()
    @Column({ type: 'uuid' })
    questionId!: string;

    @ManyToOne(() => Question, (question) => question.options, { onDelete: 'CASCADE' })
    question!: Question;

    @Column()
    text!: string;

    @Column({ default: false })
    isCorrect!: boolean;
}

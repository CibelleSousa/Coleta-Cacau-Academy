import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index } from 'typeorm';
import { User } from './user.entity';

@Entity('certifications')
export class Certification {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index({ unique: true })
    @Column({ type: 'uuid' })
    userId!: string;

    @ManyToOne(() => User, (user) => user.certifications, { onDelete: 'CASCADE' })
    user!: User;

    @CreateDateColumn()
    issuedAt!: Date;

    @Column({ nullable: true })
    certificateUrl!: string;
}

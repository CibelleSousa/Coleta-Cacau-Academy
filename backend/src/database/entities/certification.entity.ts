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

    /**
     * Código público de verificação, impresso no PDF e usado na URL.
     *
     * Deliberadamente separado de `id` e de `userId`: identificadores
     * internos não devem circular em links que qualquer pessoa pode ver.
     * Gerado pelo banco para que nunca falte em registros novos.
     */
    @Index({ unique: true })
    @Column({ type: 'uuid', generated: 'uuid' })
    verificationCode!: string;

    @Column({ nullable: true })
    certificateUrl!: string;
}

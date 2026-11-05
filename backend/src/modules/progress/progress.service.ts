import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserProgress } from '../../database/entities/user-progress.entity';
import { Lesson } from '../../database/entities/lesson.entity';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class ProgressService {
    constructor(
        @InjectRepository(UserProgress)
        private readonly progressRepository: Repository<UserProgress>,
        @InjectRepository(Lesson)
        private readonly lessonRepository: Repository<Lesson>,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async markLessonAsComplete(user: User, lessonId: string) {
        const lesson = await this.lessonRepository.findOne({ where: { id: lessonId } });
        if (!lesson) {
            throw new NotFoundException('Lesson not found');
        }

        // Upsert logic: Check if progress exists, if so update it, else create it
        let progress = await this.progressRepository.findOne({
        where: { userId: user.id, lessonId },
        });

        if (!progress) {
            progress = this.progressRepository.create({
                userId: user.id,
                lessonId,
                completed: true,
                completedAt: new Date(),
            });
        } else if (!progress.completed) {
            progress.completed = true;
            progress.completedAt = new Date();
        }

        await this.progressRepository.save(progress);

        this.eventEmitter.emit('lesson.completed', { user });

        return { message: 'Progress updated successfully', lessonId, done: true };
    }

    async toggleLessonCompletion(user: User, lessonId: string) {
        const lesson = await this.lessonRepository.findOne({ where: { id: lessonId } });
        if (!lesson) {
            throw new NotFoundException('Lesson not found');
        }

        const progress = await this.progressRepository.findOne({
            where: { userId: user.id, lessonId },
        });

        // O estado alternado é `completed`, não a existência da linha.
        // Avaliar uma aula também cria o registro em user_progress, então
        // decidir por "a linha existe" fazia o toggle desmarcar uma aula que
        // nunca tinha sido concluída.
        if (progress?.completed) {
            progress.completed = false;
            progress.completedAt = null;

            // Desmarcar não pode apagar a linha quando há avaliação: `rating`
            // mora na mesma tabela e seria destruído junto. Sem avaliação, não
            // resta nada de útil e removemos para não acumular linhas vazias.
            if (progress.rating == null) {
                await this.progressRepository.remove(progress);
            } else {
                await this.progressRepository.save(progress);
            }

            return { lessonId, done: false };
        }

        // Marcar como concluída: reaproveita a linha existente (preservando a
        // avaliação) ou cria uma nova.
        const atualizado = progress ?? this.progressRepository.create({
            userId: user.id,
            lessonId,
        });
        atualizado.completed = true;
        atualizado.completedAt = new Date();

        await this.progressRepository.save(atualizado);
        this.eventEmitter.emit('lesson.completed', { user });

        return { lessonId, done: true };
    }

    async rateLesson(user: User, lessonId: string, rating: number){
        const lesson = await this.lessonRepository.findOne({ where: { id: lessonId } });
        if (!lesson){
            throw new NotFoundException('Lesson not found');
        }

        let progress = await this.progressRepository.findOne({
            where: { userId: user.id, lessonId },
        });
        if(!progress){
            progress = this.progressRepository.create({
                userId: user.id,
                lessonId,
                rating,
            });
        } else {
            progress.rating = rating;
        }

        await this.progressRepository.save(progress);

        return { message: 'Rating updated successfully' };
    }
}

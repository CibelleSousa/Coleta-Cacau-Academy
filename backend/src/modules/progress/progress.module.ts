import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { UserProgress } from '../../database/entities/user-progress.entity';
import { Lesson } from '../../database/entities/lesson.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserProgress, Lesson])],
    controllers: [ProgressController],
    providers: [ProgressService],
    exports: [ProgressService],
})
export class ProgressModule {}

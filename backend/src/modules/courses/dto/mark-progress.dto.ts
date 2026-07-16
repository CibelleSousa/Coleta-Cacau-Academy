import { IsString, IsUUID } from 'class-validator';

export class MarkProgressDto {
    @IsString()
    @IsUUID()
    lessonId!: string;
}

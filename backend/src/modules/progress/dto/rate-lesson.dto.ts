import { IsUUID, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RateLessonDto {
    @ApiProperty({ 
        description: 'ID da aula (UUID)', 
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    lessonId!: string;

    @ApiProperty({ 
        description: 'Nota da aula (1 a 5)', 
        minimum: 1, 
        maximum: 5, 
        example: 5 
    })
    @IsInt()
    @Min(1)
    @Max(5)
    rating!: number;
}
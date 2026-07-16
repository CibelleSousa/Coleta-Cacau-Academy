import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MarkProgressDto {
    @ApiProperty({ 
        description: 'ID da aula (UUID)', 
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsString()
    @IsUUID()
    lessonId!: string;
}

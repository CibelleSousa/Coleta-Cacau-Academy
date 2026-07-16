import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddCommentDto {
    @ApiProperty({ 
        description: 'Conteúdo do comentário', 
        minLength: 1, 
        example: 'Excelente aula, muito esclarecedora!' 
    })
    @IsString()
    @MinLength(1)
    text!: string;
}
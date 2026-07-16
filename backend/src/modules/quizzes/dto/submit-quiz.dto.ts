import { IsArray, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class AnswerDto {
  @ApiProperty({ 
    description: 'ID da questão (UUID)', 
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  questionId!: string;

  @ApiProperty({ 
    description: 'ID da opção selecionada (UUID)', 
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsUUID()
  selectedOptionId!: string;
}

export class SubmitQuizDto {
    @ApiProperty({ 
        description: 'ID do Quiz (UUID)', 
        example: '123e4567-e89b-12d3-a456-426614174002'
    })
    @IsUUID()
    quizId!: string;

    @ApiProperty({ 
        description: 'Array de respostas', 
        type: [AnswerDto] 
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AnswerDto)
    answers!: AnswerDto[];
}

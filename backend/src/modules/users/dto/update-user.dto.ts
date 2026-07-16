import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({ 
        required: false, 
        description: 'Nome completo do usuário', 
        minLength: 3,
        example: 'João da Silva' 
    })
    @IsString()
    @MinLength(3)
    @IsOptional()
    name?: string;

    @ApiProperty({ 
        required: false, 
        description: 'URL da imagem do avatar',
        example: 'https://example.com/avatar.png'
    })
    @IsString()
    @IsOptional()
    avatarUrl?: string;
}

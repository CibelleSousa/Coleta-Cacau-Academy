import { IsString, IsOptional, IsUrl, MinLength } from 'class-validator';
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
        description: 'URL da imagem do avatar (http ou https)',
        example: 'https://lh3.googleusercontent.com/a/exemplo'
    })
    // @IsString() aceitava qualquer texto, que ia direto para o src de um
    // <img>. Exigir protocolo explícito descarta entradas como "javascript:"
    // ou caminhos relativos.
    @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
    @IsOptional()
    avatarUrl?: string;
}

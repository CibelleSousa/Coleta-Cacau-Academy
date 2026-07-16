import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'ID único do Google', example: 'google-oauth2|123456789' })
    @IsString()
    googleId!: string;

    @ApiProperty({ description: 'Nome completo do usuário', example: 'Maria Oliveira' })
    @IsString()
    name!: string;

    @ApiProperty({ description: 'E-mail do usuário', example: 'maria.oliveira@email.com' })
    @IsEmail()
    email!: string;

    @ApiProperty({ required: false, description: 'URL da foto de perfil do Google' })
    @IsString()
    avatarUrl?: string;
}

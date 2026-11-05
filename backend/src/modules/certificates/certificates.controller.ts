import { Controller, Get, UseGuards, Res } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiProduces } from '@nestjs/swagger';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CertificatesService } from './certificates.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../database/entities/user.entity';

@ApiTags('Certificados')
@ApiBearerAuth()
@Controller('certificates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CertificatesController {
    constructor(private readonly certificatesService: CertificatesService) {}

    @Get('eligibility')
    @ApiOperation({ summary: 'Consultar elegibilidade para o certificado' })
    @ApiResponse({
        status: 200,
        description:
            'Situação do aluno: se já pode emitir e quanto falta de aulas e quizzes.',
    })
    async getEligibility(@CurrentUser() user: User) {
        return this.certificatesService.getEligibility(user);
    }

   @Get('issue')
    @ApiOperation({ summary: 'Emitir certificado em PDF (se elegível)' })
    @ApiProduces('application/pdf')
    @ApiResponse({ status: 200, description: 'PDF do certificado gerado.', schema:{ type: 'string', format: 'binary' } })
    @ApiResponse({ status: 403, description: 'Usuário não elegível para certificado.' })
    async issueCertificate(@CurrentUser() user: User, @Res() res: Response) {
        const result = await this.certificatesService.checkAndIssueCertificate(user);

        if(!result.eligible){
            return res.status(403).json({
                statusCode: 403,
                message: result.message
            });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="Certificado de Conclusao - Desenvolvimento Mobile com React Native.pdf"');

        return res.status(200).send(result.pdfBuffer);
    }
}

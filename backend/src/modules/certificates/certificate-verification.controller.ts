import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CertificatesService } from './certificates.service';

/**
 * Rota PÚBLICA de verificação de certificados.
 *
 * Deliberadamente separada do CertificatesController, que tem
 * `@UseGuards(JwtAuthGuard, RolesGuard)` no nível da classe. Abrir uma
 * exceção dentro de um controller protegido é frágil: quem ler depois
 * presume que tudo ali exige autenticação. Um controller próprio torna a
 * natureza pública explícita.
 *
 * O ThrottlerGuard global continua valendo e limita varredura de códigos.
 */
@ApiTags('Certificados')
@Controller('certificates')
export class CertificateVerificationController {
    constructor(private readonly certificatesService: CertificatesService) {}

    @Get('verify/:code')
    @ApiOperation({
        summary: 'Verificar autenticidade de um certificado (público)',
    })
    @ApiParam({ name: 'code', description: 'Código de verificação impresso no PDF' })
    @ApiResponse({
        status: 200,
        description: 'Certificado válido. Devolve nome do aluno, curso e data.',
    })
    @ApiResponse({ status: 404, description: 'Certificado não encontrado.' })
    async verify(
        // ParseUUIDPipe rejeita entradas malformadas antes de consultar o
        // banco, transformando varredura em 400 barato em vez de query.
        @Param('code', new ParseUUIDPipe({ version: '4' })) code: string,
    ) {
        return this.certificatesService.verifyByCode(code);
    }
}

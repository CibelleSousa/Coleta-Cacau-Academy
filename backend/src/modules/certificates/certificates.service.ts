import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { Lesson } from '../../database/entities/lesson.entity';
import { UserProgress } from '../../database/entities/user-progress.entity';
import { Quiz } from '../../database/entities/quiz.entity';
import { QuizAttempt } from '../../database/entities/quiz-attempt.entity';
import { Certification } from '../../database/entities/certification.entity';
import { User } from '../../database/entities/user.entity';
import * as fs from 'fs';
import * as path from  'path';
import PDFDocument from 'pdfkit';

@Injectable()
export class CertificatesService {
  constructor(
    @InjectRepository(Lesson) private readonly lessonRepository: Repository<Lesson>,
    @InjectRepository(UserProgress) private readonly progressRepository: Repository<UserProgress>,
    @InjectRepository(Quiz) private readonly quizRepository: Repository<Quiz>,
    @InjectRepository(QuizAttempt) private readonly attemptRepository: Repository<QuizAttempt>,
    @InjectRepository(Certification) private readonly certificationRepository: Repository<Certification>,
  ) {}

  private readonly logger = new Logger(CertificatesService.name);

  @OnEvent('lesson.completed')
  async handleLessonCompletedEvent(payload: { user: User }) {
    try {
      await this.checkAndIssueCertificate(payload.user);
    } catch (error) {
      this.logger.error(
        `Falha ao verificar/emitir certificado após conclusão de aula (user ${payload.user.id})`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  @OnEvent('quiz.passed')
  async handleQuizPassedEvent(payload: { user: User }) {
    try {
      await this.checkAndIssueCertificate(payload.user);
    } catch (error) {
      this.logger.error(
        `Falha ao verificar/emitir certificado após aprovação em quiz (user ${payload.user.id})`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  /**
   * Fonte única da regra de elegibilidade.
   *
   * Antes, o frontend recalculava isto por conta própria contando apenas as
   * aulas — e liberava o botão de download enquanto a API exigia também todos
   * os quizzes aprovados, respondendo 403. Agora quem decide é só o backend,
   * e o frontend apenas exibe o que falta.
   *
   * Não gera PDF: é consulta barata, pensada para a tela de certificados.
   */
  async getEligibility(user: User) {
        const [totalLessons, completedLessons, totalQuizzes, passingAttempts] =
            await Promise.all([
                this.lessonRepository.count(),
                this.progressRepository.count({
                    where: { userId: user.id, completed: true },
                }),
                this.quizRepository.count(),
                this.attemptRepository.find({
                    where: { userId: user.id, passed: true },
                    select: ['quizId'],
                }),
            ]);

        // Um mesmo quiz pode ter várias tentativas aprovadas; contamos quizzes
        // distintos, não tentativas.
        const quizzesPassed = new Set(passingAttempts.map((a) => a.quizId)).size;

        const lessonsComplete = totalLessons > 0 && completedLessons >= totalLessons;
        const quizzesComplete = quizzesPassed >= totalQuizzes;

        return {
            eligible: lessonsComplete && quizzesComplete,
            lessonsDone: completedLessons,
            lessonsTotal: totalLessons,
            quizzesPassed,
            quizzesTotal: totalQuizzes,
        };
    }

  async checkAndIssueCertificate(user: User) {
        const eligibility = await this.getEligibility(user);

        if (!eligibility.eligible) {
            const faltamAulas = eligibility.lessonsTotal - eligibility.lessonsDone;
            const faltamQuizzes = eligibility.quizzesTotal - eligibility.quizzesPassed;
            const pendencias = [
                faltamAulas > 0 ? `${faltamAulas} aula(s)` : null,
                faltamQuizzes > 0 ? `${faltamQuizzes} quiz(zes)` : null,
            ].filter(Boolean);

            return {
                eligible: false as const,
                message: pendencias.length
                    ? `Ainda faltam: ${pendencias.join(' e ')}.`
                    : 'Curso ainda não disponível para certificação.',
            };
        }

        // 3. Check if certificate record exists in DB
        let certificate = await this.certificationRepository.findOne({
            where: { userId: user.id },
        });

        if (!certificate) {
            // 4. Issue new certificate
            certificate = this.certificationRepository.create({
                userId: user.id,
                certificateUrl: `https://coleta-cacau.dev/certs/${user.id}`,
            });
            await this.certificationRepository.save(certificate);
        }

        // 5. Generate the PDF
        const completionDate = new Date().toLocaleDateString('pt-BR');
        const pdfBuffer = await this.generateCertificatePdf(user.name, completionDate);

        return {
            eligible: true as const,
            certificate: {
                id: certificate.id,
                issuedAt: certificate.issuedAt,
                certificateUrl: certificate.certificateUrl,
            },
            pdfBuffer
        };
    }

    private assetPath(assetName: string): string | null {
        const pathString = path.join(__dirname, '../../assets', assetName);
        return fs.existsSync(pathString) ? pathString : null;
    }

    private generateCertificatePdf(studentName: string, completionDate: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: 'A4',
                    layout: 'landscape',
                    margin: 0,
                });

                const buffers: Buffer[] = [];
                doc.on('data', (chunk: Buffer) => buffers.push(chunk));
                doc.on('end', () => {
                    const pdfData = Buffer.concat(buffers);
                    resolve(pdfData);
                });
                // O pdfkit é um stream: além do throw síncrono, ele pode
                // emitir 'error' de forma assíncrona. Sem este listener, a
                // promise ficaria pendente para sempre.
                doc.on('error', (err: Error) => reject(err));

                const pageWidth = doc.page.width;
                const pageHeight = doc.page.height;

                const templatePath = this.assetPath('certificate-template.jpg');
                const robotoRegularPath = this.assetPath('Roboto-Regular.ttf');
                const robotoBoldPath = this.assetPath('Roboto-Bold.ttf');

                if (templatePath) {
                    doc.image(templatePath, 0, 0, {width: pageWidth, height: pageHeight})
                } else {
                    this.logger.warn(
                        `Template não encontrado em ${path.join(__dirname, '../../assets')} — gerando certificado com fundo liso`,
                    );
                    doc.rect(0,0, pageWidth, pageHeight).fill('#2F9B78');
                }

                doc.font(robotoBoldPath ?? 'Helvetica-Bold')
                    .fontSize(30)
                    .fillColor('#000000')
                    .text(studentName.toUpperCase(), 0, 275, { 
                        align: 'center', width: pageWidth 
                    });

                doc.font(robotoRegularPath ?? 'Helvetica')
                    .fontSize(15)
                    .fillColor('#000000')
                    .text(completionDate, 0, 495, { 
                        align: 'center', width: pageWidth 
                    });

                doc.end();
            } catch (error) {
                // `throw` em JavaScript aceita qualquer valor, não só Error.
                // Normalizamos para que quem trata a rejeição sempre receba
                // um Error com stack utilizável.
                reject(error instanceof Error ? error : new Error(String(error)));
            }
        });
    }
}

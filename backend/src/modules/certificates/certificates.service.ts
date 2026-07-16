import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { Lesson } from '../../database/entities/lesson.entity';
import { UserProgress } from '../../database/entities/user-progress.entity';
import { Quiz } from '../../database/entities/quiz.entity';
import { QuizAttempt } from '../../database/entities/quiz-attempt.entity';
import { Certification } from '../../database/entities/certification.entity';
import { User } from '../../database/entities/user.entity';
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

  // Listeners
  @OnEvent('lesson.completed')
  async handleLessonCompletedEvent(payload: { user: User }) {
    await this.checkAndIssueCertificate(payload.user);
  }

  @OnEvent('quiz.passed')
  async handleQuizPassedEvent(payload: { user: User }) {
    await this.checkAndIssueCertificate(payload.user);
  }

  async checkAndIssueCertificate(user: User) {
        // 1. Check if all lessons are completed
        const totalLessons = await this.lessonRepository.count();
        const completedLessons = await this.progressRepository.count({
            where: { userId: user.id, completed: true },
        });

        if (totalLessons === 0 || completedLessons < totalLessons) {
            return { eligible: false, message: 'You have not completed all lessons yet.' };
        }

        // 2. Check if all quizzes are passed
        const totalQuizzes = await this.quizRepository.count();
        const passingAttempts = await this.attemptRepository.find({
            where: { userId: user.id, passed: true },
            select: ['quizId'],
        });
        
        const uniquePassedQuizzes = new Set(passingAttempts.map((a) => a.quizId));

        if (uniquePassedQuizzes.size < totalQuizzes) {
            return { eligible: false, message: 'You have not passed all quizzes yet.' };
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
            eligible: true,
            certificate: {
                id: certificate.id,
                issuedAt: certificate.issuedAt,
                certificateUrl: certificate.certificateUrl,
            },
            pdfBuffer
        };
    }

    private generateCertificatePdf(studentName: string, completionDate: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    size: 'A4',
                    layout: 'landscape',
                    margin: 50,
                });

                const buffers: Buffer[] = [];
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    const pdfData = Buffer.concat(buffers);
                    resolve(pdfData);
                });

                const pageWidth = doc.page.width;
                const pageHeight = doc.page.height;
                const primaryColor = '#2F9B78'; // Coleta-Cacau Green

                // 1. Professional Double Border
                doc.rect(20, 20, pageWidth - 40, pageHeight - 40).lineWidth(3).strokeColor(primaryColor).stroke();
                doc.rect(30, 30, pageWidth - 60, pageHeight - 60).lineWidth(1).strokeColor(primaryColor).stroke();

                // 2. Title
                doc.font('Helvetica-Bold').fontSize(28).fillColor('#333333').text('CERTIFICADO DE CONCLUSÃO', 0, 100, { align: 'center' });

                // 3. Subtitle
                doc.font('Helvetica').fontSize(14).fillColor('#666666').text('A UESC confere o presente certificado a', 0, 160, { align: 'center' });

                // 4. Student Name (Large & Bold)
                doc.font('Helvetica-Bold').fontSize(36).fillColor(primaryColor).text(studentName, 0, 200, { align: 'center' });

                // 5. Description Text
                doc.font('Helvetica').fontSize(14).fillColor('#444444').text(
                    'Por ter concluído com sucesso a trilha completa de Desenvolvimento Mobile com React Native, englobando módulos teóricos e práticos, com carga horária total de 40 horas.',
                    100,
                    270,
                    { align: 'center', width: pageWidth - 200 }
                );

                // 6. Completion Date
                doc.font('Helvetica').fontSize(12).fillColor('#666666').text(`Concluído em: ${completionDate}`, 0, 340, { align: 'center' });

                // 7. Signature Blocks
                const sigY = pageHeight - 120;
                
                // Left Signature
                doc.moveTo(120, sigY).lineTo(320, sigY).lineWidth(1).strokeColor('#333333').stroke();
                doc.font('Helvetica-Bold').fontSize(12).fillColor('#333333').text('Coordenadora Docente do Projeto', 140, sigY + 10, { width: 160, align: 'center' });

                // Right Signature
                doc.moveTo(pageWidth - 320, sigY).lineTo(pageWidth - 120, sigY).lineWidth(1).strokeColor('#333333').stroke();
                doc.font('Helvetica-Bold').fontSize(12).fillColor('#333333').text('Discente Responsável', pageWidth - 310, sigY + 10, { width: 160, align: 'center' });

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }
}

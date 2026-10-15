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
                    margin: 0,
                });

                const buffers: Buffer[] = [];
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    const pdfData = Buffer.concat(buffers);
                    resolve(pdfData);
                });

                const pageWidth = doc.page.width;
                const pageHeight = doc.page.height;

                const templatePath = path.join(process.cwd(), 'assets', 'certificate-template.jpg');
                const robotoPath = path.join(process.cwd(), 'assets', 'Roboto-Regular.ttf');

                if (fs.existsSync(templatePath)){
                    doc.image(templatePath, 0, 0, {width: pageWidth, height: pageHeight});
                } else {
                    console.warn('Template de certificado não encontrado em: ', templatePath);
                    doc.rect(0, 0, pageWidth, pageHeight).fill('#2F9B78');
                }

                doc.font(robotoPath)
                    .fontSize(30)
                    .fillColor('#000000')
                    .text(studentName.toUpperCase(), 0, 275, { 
                        align: 'center', width: pageWidth 
                    });

                doc.font(robotoPath)
                    .fontSize(15)
                    .fillColor('#000000')
                    .text(completionDate, 0, 495, { 
                        align: 'center', width: pageWidth 
                    });

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }
}

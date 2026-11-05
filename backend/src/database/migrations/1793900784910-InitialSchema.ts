import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1793900784910 implements MigrationInterface {
    name = 'InitialSchema1793900784910'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "options" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "questionId" uuid NOT NULL, "text" character varying NOT NULL, "isCorrect" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_d232045bdb5c14d932fba18d957" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_46b668c49a6c4154d4643d875a" ON "options" ("questionId") `);
        await queryRunner.query(`CREATE TABLE "questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quizId" uuid NOT NULL, "text" character varying NOT NULL, CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_35d54f06d12ea78d4842aed6b6" ON "questions" ("quizId") `);
        await queryRunner.query(`CREATE TABLE "quizzes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "moduleId" uuid NOT NULL, "title" character varying NOT NULL, "description" character varying, "passingScore" integer NOT NULL DEFAULT '70', CONSTRAINT "UQ_c504bb35e922b60d38aee5ef53b" UNIQUE ("moduleId"), CONSTRAINT "REL_c504bb35e922b60d38aee5ef53" UNIQUE ("moduleId"), CONSTRAINT "PK_b24f0f7662cf6b3a0e7dba0a1b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."course_modules_type_enum" AS ENUM('THEORY', 'PRACTICAL')`);
        await queryRunner.query(`CREATE TABLE "course_modules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying NOT NULL, "order" integer NOT NULL, "duration" integer NOT NULL, "type" "public"."course_modules_type_enum" NOT NULL, CONSTRAINT "PK_4c195db0718e8845a6e09075ebc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comment_likes" ("userId" uuid NOT NULL, "commentId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ec6698ead14ad945033ebb2f1b9" PRIMARY KEY ("userId", "commentId"))`);
        await queryRunner.query(`CREATE TABLE "lesson_comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "lessonId" uuid NOT NULL, "text" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a1c4f2a0bc6e05767dd98f60e2a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dbfa59e2ca669e9254953ab5da" ON "lesson_comments" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_374731df081b07659a98c59079" ON "lesson_comments" ("lessonId") `);
        await queryRunner.query(`CREATE TYPE "public"."lessons_type_enum" AS ENUM('READ', 'VIDEO')`);
        await queryRunner.query(`CREATE TABLE "lessons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "moduleId" uuid NOT NULL, "title" character varying NOT NULL, "subtitle" character varying, "description" text, "slug" character varying NOT NULL, "content" text, "videoUrl" character varying, "duration" character varying NOT NULL, "type" "public"."lessons_type_enum" NOT NULL, "order" integer NOT NULL, CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_16e7969589c0b789d986878225" ON "lessons" ("moduleId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ca2edfa23c965f9c435572a7de" ON "lessons" ("slug") `);
        await queryRunner.query(`CREATE TABLE "user_progress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "lessonId" uuid NOT NULL, "completed" boolean NOT NULL DEFAULT false, "completedAt" TIMESTAMP WITH TIME ZONE, "rating" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_30e04e705c2aae1fa3856f9028e" UNIQUE ("userId", "lessonId"), CONSTRAINT "PK_7b5eb2436efb0051fdf05cbe839" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b5d0e1b57bc6c761fb49e79bf8" ON "user_progress" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b68ae6c7bbd71b00257277c42f" ON "user_progress" ("lessonId") `);
        await queryRunner.query(`CREATE TABLE "quiz_attempts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "quizId" uuid NOT NULL, "score" integer NOT NULL, "passed" boolean NOT NULL, "attemptedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a84a93fb092359516dc5b325b90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ff7b1d71fabdc7e1f4aff55285" ON "quiz_attempts" ("userId") `);
        await queryRunner.query(`CREATE TABLE "certifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "issuedAt" TIMESTAMP NOT NULL DEFAULT now(), "certificateUrl" character varying, CONSTRAINT "PK_fd763d412e4a1fb1b6dadd6e72b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c5d9770c24adc7be0680f9bd96" ON "certifications" ("userId") `);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('STUDENT', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "googleId" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "avatarUrl" character varying, "streakCount" integer NOT NULL DEFAULT '0', "lastLoginDate" date, "role" "public"."users_role_enum" NOT NULL DEFAULT 'STUDENT', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f382af58ab36057334fb262efd" ON "users" ("googleId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`ALTER TABLE "options" ADD CONSTRAINT "FK_46b668c49a6c4154d4643d875a5" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_35d54f06d12ea78d4842aed6b6d" FOREIGN KEY ("quizId") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quizzes" ADD CONSTRAINT "FK_c504bb35e922b60d38aee5ef53b" FOREIGN KEY ("moduleId") REFERENCES "course_modules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_likes" ADD CONSTRAINT "FK_34d1f902a8a527dbc2502f87c88" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_likes" ADD CONSTRAINT "FK_abbd506a94a424dd6a3a68d26f4" FOREIGN KEY ("commentId") REFERENCES "lesson_comments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson_comments" ADD CONSTRAINT "FK_dbfa59e2ca669e9254953ab5dae" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lesson_comments" ADD CONSTRAINT "FK_374731df081b07659a98c590793" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lessons" ADD CONSTRAINT "FK_16e7969589c0b789d9868782259" FOREIGN KEY ("moduleId") REFERENCES "course_modules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_progress" ADD CONSTRAINT "FK_b5d0e1b57bc6c761fb49e79bf89" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_progress" ADD CONSTRAINT "FK_b68ae6c7bbd71b00257277c42f8" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_attempts" ADD CONSTRAINT "FK_ff7b1d71fabdc7e1f4aff552859" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "certifications" ADD CONSTRAINT "FK_c5d9770c24adc7be0680f9bd963" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certifications" DROP CONSTRAINT "FK_c5d9770c24adc7be0680f9bd963"`);
        await queryRunner.query(`ALTER TABLE "quiz_attempts" DROP CONSTRAINT "FK_ff7b1d71fabdc7e1f4aff552859"`);
        await queryRunner.query(`ALTER TABLE "user_progress" DROP CONSTRAINT "FK_b68ae6c7bbd71b00257277c42f8"`);
        await queryRunner.query(`ALTER TABLE "user_progress" DROP CONSTRAINT "FK_b5d0e1b57bc6c761fb49e79bf89"`);
        await queryRunner.query(`ALTER TABLE "lessons" DROP CONSTRAINT "FK_16e7969589c0b789d9868782259"`);
        await queryRunner.query(`ALTER TABLE "lesson_comments" DROP CONSTRAINT "FK_374731df081b07659a98c590793"`);
        await queryRunner.query(`ALTER TABLE "lesson_comments" DROP CONSTRAINT "FK_dbfa59e2ca669e9254953ab5dae"`);
        await queryRunner.query(`ALTER TABLE "comment_likes" DROP CONSTRAINT "FK_abbd506a94a424dd6a3a68d26f4"`);
        await queryRunner.query(`ALTER TABLE "comment_likes" DROP CONSTRAINT "FK_34d1f902a8a527dbc2502f87c88"`);
        await queryRunner.query(`ALTER TABLE "quizzes" DROP CONSTRAINT "FK_c504bb35e922b60d38aee5ef53b"`);
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_35d54f06d12ea78d4842aed6b6d"`);
        await queryRunner.query(`ALTER TABLE "options" DROP CONSTRAINT "FK_46b668c49a6c4154d4643d875a5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f382af58ab36057334fb262efd"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c5d9770c24adc7be0680f9bd96"`);
        await queryRunner.query(`DROP TABLE "certifications"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ff7b1d71fabdc7e1f4aff55285"`);
        await queryRunner.query(`DROP TABLE "quiz_attempts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b68ae6c7bbd71b00257277c42f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b5d0e1b57bc6c761fb49e79bf8"`);
        await queryRunner.query(`DROP TABLE "user_progress"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ca2edfa23c965f9c435572a7de"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_16e7969589c0b789d986878225"`);
        await queryRunner.query(`DROP TABLE "lessons"`);
        await queryRunner.query(`DROP TYPE "public"."lessons_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_374731df081b07659a98c59079"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dbfa59e2ca669e9254953ab5da"`);
        await queryRunner.query(`DROP TABLE "lesson_comments"`);
        await queryRunner.query(`DROP TABLE "comment_likes"`);
        await queryRunner.query(`DROP TABLE "course_modules"`);
        await queryRunner.query(`DROP TYPE "public"."course_modules_type_enum"`);
        await queryRunner.query(`DROP TABLE "quizzes"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_35d54f06d12ea78d4842aed6b6"`);
        await queryRunner.query(`DROP TABLE "questions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_46b668c49a6c4154d4643d875a"`);
        await queryRunner.query(`DROP TABLE "options"`);
    }

}

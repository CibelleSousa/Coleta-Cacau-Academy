import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCertificateVerificationCode1793921992014 implements MigrationInterface {
    name = 'AddCertificateVerificationCode1793921992014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "certifications" ADD "verificationCode" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_37dff003d198b304ea43d450e9" ON "certifications" ("verificationCode") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_37dff003d198b304ea43d450e9"`);
        await queryRunner.query(`ALTER TABLE "certifications" DROP COLUMN "verificationCode"`);
    }

}

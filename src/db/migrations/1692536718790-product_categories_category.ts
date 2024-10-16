import { MigrationInterface, QueryRunner } from 'typeorm';

export class product_categories_category1692536718790 implements MigrationInterface {
  name = 'product_categories_category1692536718790';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "product_categories_category" (
        "product_id" integer NOT NULL,
        "category_id" integer NOT NULL,
        PRIMARY KEY ("product_id", "category_id"),
        FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE,
        FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE
      )
    `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "product_categories_category"`);
  }
}

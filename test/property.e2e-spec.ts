// test/property.e2e-spec.ts
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('PropertyController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let producerId: string;
  let propertyId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    await dataSource.query('DELETE FROM property');
    await dataSource.query('DELETE FROM producer');

    const res = await request(app.getHttpServer())
      .post('/producers')
      .send({
        document: '12345678901',
        name: 'Produtor Teste',
        properties: [
          {
            name: 'Fazenda Teste',
            city: 'Araraquara',
            state: 'SP',
            totalArea: 100,
            agriculturalArea: 60,
            vegetationArea: 40,
          },
        ],
      });

    producerId = res.body.id;
    propertyId = res.body.properties[0].id;
  });

  it('/properties (GET) deve retornar todas as propriedades', async () => {
    const res = await request(app.getHttpServer())
      .get('/properties')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0].producer.id).toBe(producerId);
  });

  it('/properties/:id (GET) deve retornar uma propriedade específica', async () => {
    const res = await request(app.getHttpServer())
      .get(`/properties/${propertyId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', propertyId);
    expect(res.body).toHaveProperty('name', 'Fazenda Teste');
  });

  it('/properties/:id (PATCH) deve atualizar os dados da propriedade', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/properties/${propertyId}`)
      .send({
        name: 'Fazenda Atualizada',
        city: 'São Carlos',
        state: 'SP',
        totalArea: 150,
        agriculturalArea: 90,
        vegetationArea: 60,
      })
      .expect(200);

    expect(res.body.name).toBe('Fazenda Atualizada');
    expect(res.body.city).toBe('São Carlos');
    expect(res.body.totalArea).toBe(150);
  });

  it('/properties/:id (DELETE) deve deletar a propriedade', async () => {
    await request(app.getHttpServer())
      .delete(`/properties/${propertyId}`)
      .expect(200);

    const res = await request(app.getHttpServer())
      .get('/properties')
      .expect(200);

    expect(res.body.length).toBe(0);
  });
});

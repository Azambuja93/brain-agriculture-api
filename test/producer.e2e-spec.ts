// test/producer.e2e-spec.ts
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('ProducerController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let createdProducerId: string;

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

    // Criação padrão de produtor com propriedade
    const response = await request(app.getHttpServer())
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

    createdProducerId = response.body.id;
  });

  it('/producers (POST) deve criar um produtor e retornar 201', async () => {
    const response = await request(app.getHttpServer())
      .post('/producers')
      .send({
        document: '12345678909',
        name: 'Outro Produtor',
        properties: [
          {
            name: 'Fazenda Nova',
            city: 'Leme',
            state: 'SP',
            totalArea: 200,
            agriculturalArea: 100,
            vegetationArea: 100,
          },
        ],
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Outro Produtor');
    expect(response.body.properties).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Fazenda Nova',
        }),
      ]),
    );
  });

  it('/producers (GET) deve retornar produtores com propriedades', async () => {
    const response = await request(app.getHttpServer())
      .get('/producers')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('properties');
  });

  it('/producers/:id (GET) deve retornar um produtor específico', async () => {
    const response = await request(app.getHttpServer())
      .get(`/producers/${createdProducerId}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', createdProducerId);
    expect(response.body).toHaveProperty('name', 'Produtor Teste');
    expect(response.body.properties.length).toBeGreaterThan(0);
  });

  it('/producers/:id (PATCH) deve atualizar o nome do produtor', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/producers/${createdProducerId}`)
      .send({ name: 'Produtor Atualizado' })
      .expect(200);

    expect(response.body.name).toBe('Produtor Atualizado');
  });

  it('/producers/:id (DELETE) deve remover o produtor', async () => {
    await request(app.getHttpServer())
      .delete(`/producers/${createdProducerId}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/producers/${createdProducerId}`)
      .expect(404);
  });

  it('/producers/:id (GET) deve retornar 404 para ID inexistente', async () => {
    await request(app.getHttpServer())
      .get('/producers/00000000-0000-0000-0000-000000000000')
      .expect(404);
  });
});

import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('CropController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let dataSource: DataSource;
  let cropId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer();
    dataSource = moduleFixture.get(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    await dataSource.query('DELETE FROM crop');
    await dataSource.query('DELETE FROM harvest');
    await dataSource.query('DELETE FROM property');
    await dataSource.query('DELETE FROM producer');

    const producerRes = await request(server).post('/producers').send({
      document: '32145678900',
      name: 'Produtor Teste',
      properties: [{
        name: 'Fazenda Teste',
        city: 'Cidade',
        state: 'SP',
        totalArea: 100,
        agriculturalArea: 60,
        vegetationArea: 40,
      }],
    });

    const propertyId = producerRes.body.properties[0].id;

    const harvestRes = await request(server).post('/harvests').send({
      season: 'Safra 2025',
      propertyId,
      crops: [],
    });

    const harvestId = harvestRes.body.id;

    const cropRes = await request(server).post('/crops').send({
      name: 'Feijão',
      harvestId,
    });

    cropId = cropRes.body.id;
  });

  it('/crops/:id (GET) deve retornar uma cultura específica', async () => {
    const res = await request(server).get(`/crops/${cropId}`).expect(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Feijão');
  });

  it('/crops/:id (PATCH) deve atualizar o nome da cultura', async () => {
    const res = await request(server).patch(`/crops/${cropId}`).send({
      name: 'Café',
    }).expect(200);

    expect(res.body.name).toBe('Café');
  });

  it('/crops/:id (DELETE) deve excluir a cultura', async () => {
    await request(server).delete(`/crops/${cropId}`).expect(200);

    const res = await request(server).get(`/crops/${cropId}`).expect(404);
    expect(res.body.message).toMatch(/não encontrada/i);
  });
});

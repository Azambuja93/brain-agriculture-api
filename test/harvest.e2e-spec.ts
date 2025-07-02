// test/harvest.e2e-spec.ts
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

describe('HarvestController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let dataSource: DataSource;
  let createdHarvestId: string;

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

    const producerRes = await request(server)
      .post('/producers')
      .send({
        document: '12345678900',
        name: 'Produtor Exemplo',
        properties: [
          {
            name: 'Fazenda Exemplo',
            city: 'Cidade',
            state: 'ST',
            totalArea: 100,
            agriculturalArea: 60,
            vegetationArea: 40,
          },
        ],
      });

    const propertyId = producerRes.body.properties[0].id;

    const harvestRes = await request(server)
      .post('/harvests')
      .send({
        season: 'Safra 2025',
        propertyId,
        crops: [
          { name: 'Milho' },
          { name: 'Soja' },
        ],
      });

    createdHarvestId = harvestRes.body.id;
  });

  it('/harvests/:id (GET) deve retornar uma safra específica', async () => {
    const res = await request(server)
      .get(`/harvests/${createdHarvestId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id');
    expect(res.body.season).toBe('Safra 2025');
    expect(res.body.crops).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Milho' }),
      ]),
    );
  });

  it('/harvests/:id (PATCH) deve atualizar a safra', async () => {
    const res = await request(server)
      .patch(`/harvests/${createdHarvestId}`)
      .send({ season: 'Safra 2024/2025' })
      .expect(200);

    expect(res.body.season).toBe('Safra 2024/2025');
  });

  it('/harvests/:id (DELETE) deve excluir a safra', async () => {
    await request(server)
      .delete(`/harvests/${createdHarvestId}`)
      .expect(200);

    const check = await request(server)
      .get(`/harvests/${createdHarvestId}`)
      .expect(404);

    expect(check.body.message).toMatch(/não encontrada/i);
  });
});

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // setupApp(app); // without Nest guide for envs
    await app.init();
  });

  it('handles a singup request', () => {
    const email = 'test@test.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'pswd' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });
  it('signup as a new user then get the current logged in user', async () => {
    const email = 'test2@test.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'pswd' })
      .expect(201);

    const cookie = res.get('Set-Cookie') as string[];

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});

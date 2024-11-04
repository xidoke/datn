// test/user.e2e-spec.ts

import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("UserController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/users/signup (POST)", () => {
    return request(app.getHttpServer())
      .post("/users/signup")
      .send({
        email: "test@example.com",
        password: "Password123!",
        firstName: "Test",
        lastName: "User",
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty("id");
        expect(res.body.email).toBe("test@example.com");
      });
  });

  it("/users/me (GET)", () => {
    // Note: This requires a valid Cognito token
    const validToken = "your-valid-token";

    return request(app.getHttpServer())
      .get("/users/me")
      .set("Authorization", `Bearer ${validToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty("id");
        expect(res.body).toHaveProperty("email");
      });
  });
});

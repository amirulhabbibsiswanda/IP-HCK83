const request = require("supertest");
const { describe, it, expect, beforeAll, afterAll } = require("@jest/globals");
const app = require("../app");
const { hashPassword } = require("../helpers/hashPassword");
const { sequelize, User } = require("../models");
const { generateToken } = require("../helpers/jwt");
const queryInterface = sequelize.queryInterface;

let access_token;

beforeAll(async () => {
  console.log("SEEDING DATA INI HANYA UNTUK TESTING");
  const user = [
    {
      username: "IlhamSanin",
      email: "IlhamSanin@gmail.com",
      password: await hashPassword("IlhamSanin123"),
      userStatus: "admin",
      mobileLegendsRank: "Mythic",
      favouriteRole: "Tank",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await queryInterface.bulkInsert("Users", user);

  const admin = await User.findOne({ where: { userStatus: "admin" } });
  access_token = generateToken({
    id: admin.id,
    email: admin.email,
    userStatus: admin.userStatus,
  });
  console.log(access_token, "TOKEN DI BEFORE ALL");
});

afterAll(async () => {
  console.log("SETELAH TESTING SELESAI DATA SEEDING DIHAPUS LAGI");

  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

describe("POST /users/login", function () {
  console.log("MASUK KE TOTAL SUITES");
  it("Berhasil login dan mengirimkan access_token", async function () {
    console.log(access_token, "TOKEN DI TESTING");

    const user = {
      email: "IlhamSanin@gmail.com",
      password: "IlhamSanin123",
    };
    const response = await request(app).post("/users/login").send(user);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
  });

  it("Email tidak diberikan / tidak diinput", async function () {
    const user = {
      email: "",
      password: "IlhamSanin123",
    };

    const response = await request(app).post("/users/login").send(user);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "email and password is required");
  });

  it("Password tidak diberikan / tidak diinput", async function () {
    const user = {
      email: "IlhamSanin@gmail.com",
      password: "",
    };

    const response = await request(app).post("/users/login").send(user);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "email and password is required");
  });

  it("Email diberikan invalid / tidak terdaftar", async function () {
    const user = {
      email: "amir@gmail.com",
      password: "IlhamSanin123",
    };
    const response = await request(app).post("/users/login").send(user);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "email not found");
  });

  it("Password diberikan salah / tidak match", async function () {
    const user = {
      email: "IlhamSanin@gmail.com",
      password: "asdasdasd",
    };
    const response = await request(app).post("/users/login").send(user);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "incorrect password");
  });
});
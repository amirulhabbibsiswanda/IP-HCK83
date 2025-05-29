const request = require("supertest");
const { describe, it, expect, beforeAll, afterAll } = require("@jest/globals");
const app = require("../app");
const { sequelize } = require("../models");
const queryInterface = sequelize.queryInterface;

beforeAll(async () => {
  console.log("SETUP UNTUK TESTING REGISTER");
  // Hapus semua data user untuk memastikan test register berjalan dengan baik
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

afterAll(async () => {
  console.log("CLEANUP SETELAH TESTING REGISTER");
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

describe("POST /users/register", function () {
  it("Berhasil register user baru", async function () {
    const userData = {
      username: "testuser",
      email: "testuser@gmail.com",
      password: "password123",
      mobileLegendsRank: "Mythic",
      favouriteRole: "Tank"
    };

    const response = await request(app)
      .post("/users/register")
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("username", userData.username);
    expect(response.body).toHaveProperty("email", userData.email);
    expect(response.body).toHaveProperty("mobileLegendsRank", userData.mobileLegendsRank);
    expect(response.body).toHaveProperty("favouriteRole", userData.favouriteRole);
  });

  it("Gagal register karena email sudah terdaftar", async function () {
    const userData = {
      username: "testuser2",
      email: "testuser@gmail.com", // Email yang sama dengan test sebelumnya
      password: "password123",
      mobileLegendsRank: "Legend",
      favouriteRole: "Marksman"
    };

    const response = await request(app)
      .post("/users/register")
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("Gagal register karena data tidak lengkap", async function () {
    const userData = {
      username: "testuser3",
      // Email tidak disertakan
      password: "password123"
    };

    const response = await request(app)
      .post("/users/register")
      .send(userData);

    expect(response.status).toBe(500); // Biasanya 400, tapi tergantung implementasi error handling
  });
});
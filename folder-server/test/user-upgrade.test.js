const request = require("supertest");
const { describe, it, expect, beforeAll, afterAll } = require("@jest/globals");
const app = require("../app");
const { hashPassword } = require("../helpers/hashPassword");
const { sequelize, User } = require("../models");
const { generateToken } = require("../helpers/jwt");
const queryInterface = sequelize.queryInterface;

let access_token;
let userId;

beforeAll(async () => {
  console.log("SEEDING DATA UNTUK TESTING UPGRADE");

  const user = [
    {
      username: "TestUser",
      email: "testuser@gmail.com",
      password: await hashPassword("test123"),
      userStatus: "customer",
      mobileLegendsRank: "Epic",
      favouriteRole: "Marksman",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  await queryInterface.bulkInsert("Users", user);

  const testUser = await User.findOne({ where: { email: "testuser@gmail.com" } });
  userId = testUser.id;
  access_token = generateToken({
    id: testUser.id,
    email: testUser.email,
    userStatus: testUser.userStatus
  });
});

afterAll(async () => {
  console.log("CLEANUP SETELAH TESTING UPGRADE");

  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
});

// Tambahkan di bagian atas file, setelah import
const stripe = require('stripe');

// Tambahkan sebelum beforeAll
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => {
    return {
      checkout: {
        sessions: {
          create: jest.fn().mockResolvedValue({
            url: 'https://checkout.stripe.com/pay/test_session'
          }),
          retrieve: jest.fn().mockResolvedValue({
            id: 'test_session_id',
            payment_status: 'paid'
          })
        }
      }
    };
  });
});

describe("GET /users/upgrade", function () { // Ubah dari POST menjadi GET
  it("Berhasil mendapatkan URL checkout Stripe", async function () {
    const response = await request(app)
      .get("/users/upgrade") // Ubah dari post menjadi get
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("url");
    // expect(response.body.url).toContain("checkout.stripe.com");
  });

  it("Gagal upgrade tanpa token", async function () {
    const response = await request(app).get("/users/upgrade"); // Ubah dari post menjadi get

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "error / invalid token");
  });
});

describe("PATCH /users/upgrade-success", function () { // Ubah dari GET /users/upgrade-status
  it("Gagal upgrade tanpa session ID", async function () {
    const response = await request(app)
      .patch("/users/upgrade-success") // Ubah endpoint dan method
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "invalid session");
  });
});
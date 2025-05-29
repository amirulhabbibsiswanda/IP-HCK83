const request = require("supertest");
const { describe, it, expect, beforeAll, afterAll, jest } = require("@jest/globals");
const app = require("../app");
const { hashPassword } = require("../helpers/hashPassword");
const { sequelize, User, Hero } = require("../models");
const { generateToken } = require("../helpers/jwt");
const queryInterface = sequelize.queryInterface;

let access_token;

beforeAll(async () => {
  console.log("SEEDING DATA UNTUK TESTING GENERATE");
  
  // Seed users
  const users = [
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
  
  await queryInterface.bulkInsert("Users", users);
  
  // Seed heroes
  const heroes = [
    {
      name: "Miya",
      imageUrl: "https://example.com/miya.jpg",
      role: "Marksman",
      specially: "Reap",
      durability: 20,
      offence: 80,
      ability: 40,
      difficulty: 30,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: "Layla",
      imageUrl: "https://example.com/layla.jpg",
      role: "Marksman",
      specially: "Reap",
      durability: 20,
      offence: 85,
      ability: 35,
      difficulty: 25,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  await queryInterface.bulkInsert("Heroes", heroes);
  
  // Generate token
  const user = await User.findOne({ where: { email: "testuser@gmail.com" } });
  access_token = generateToken({
    id: user.id,
    email: user.email,
    userStatus: user.userStatus
  });
});

afterAll(async () => {
  console.log("CLEANUP SETELAH TESTING GENERATE");
  
  await queryInterface.bulkDelete("Heroes", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
  
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
});

describe("GET /generate-ai", function () { // Ubah dari /generate menjadi /generate-ai
  it("Berhasil mendapatkan rekomendasi hero", async function () {
    // Aktifkan mock untuk generateContent
    jest.spyOn(require("../helpers/generateAI"), "generateContent").mockResolvedValue(JSON.stringify(["Miya", "Layla"]));
    
    const response = await request(app)
      .get("/generate-ai") // Ubah endpoint
      .set("Authorization", `Bearer ${access_token}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("recommendations");
    expect(response.body).toHaveProperty("heroes");
    expect(response.body).toHaveProperty("user");
  });
  
  it("Gagal mendapatkan rekomendasi tanpa token", async function () {
    const response = await request(app).get("/generate-ai"); // Ubah endpoint
    
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "error / invalid token");
  });
});
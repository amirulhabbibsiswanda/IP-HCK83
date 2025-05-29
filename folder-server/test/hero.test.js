const request = require("supertest");
const { describe, it, expect, beforeAll, afterAll } = require("@jest/globals");
const app = require("../app");
const { hashPassword } = require("../helpers/hashPassword");
const { sequelize, User, Hero } = require("../models");
const { generateToken } = require("../helpers/jwt");
const queryInterface = sequelize.queryInterface;

let access_token;
let admin_token;
let heroId;

beforeAll(async () => {
  console.log("SEEDING DATA UNTUK TESTING HERO");
  
  // Seed users
  const users = [
    {
      username: "AdminUser",
      email: "admin@gmail.com",
      password: await hashPassword("admin123"),
      userStatus: "admin",
      mobileLegendsRank: "Mythic",
      favouriteRole: "Tank",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: "RegularUser",
      email: "user@gmail.com",
      password: await hashPassword("user123"),
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
      name: "Layla",
      imageUrl: "https://example.com/layla.jpg",
      role: "Marksman",
      specially: "Reap",
      durability: 20,
      offence: 80,
      ability: 40,
      difficulty: 30,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  await queryInterface.bulkInsert("Heroes", heroes);
  
  // Get hero ID
  const hero = await Hero.findOne({ where: { name: "Layla" } });
  heroId = hero.id;
  
  // Generate tokens
  const admin = await User.findOne({ where: { userStatus: "admin" } });
  admin_token = generateToken({
    id: admin.id,
    email: admin.email,
    userStatus: admin.userStatus
  });
  
  const user = await User.findOne({ where: { userStatus: "customer" } });
  access_token = generateToken({
    id: user.id,
    email: user.email,
    userStatus: user.userStatus
  });
});

afterAll(async () => {
  console.log("CLEANUP SETELAH TESTING HERO");
  
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

describe("GET / (Heroes List)", function () {
  it("Berhasil mendapatkan daftar hero dengan token valid", async function () {
    const response = await request(app)
      .get("/")
      .set("Authorization", `Bearer ${access_token}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("imageUrl");
    expect(response.body[0]).toHaveProperty("role");
  });
  
  it("Gagal mendapatkan daftar hero tanpa token", async function () {
    const response = await request(app).get("/");
    
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "error / invalid token");
  });
});

describe("GET /heroes/:id (Hero Detail)", function () {
  it("Berhasil mendapatkan detail hero dengan ID valid", async function () {
    const response = await request(app)
      .get(`/heroes/${heroId}`)
      .set("Authorization", `Bearer ${access_token}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", heroId);
    expect(response.body).toHaveProperty("name", "Layla");
    expect(response.body).toHaveProperty("role", "Marksman");
  });
  
  it("Gagal mendapatkan detail hero dengan ID tidak valid", async function () {
    const response = await request(app)
      .get("/heroes/999999")
      .set("Authorization", `Bearer ${access_token}`);
    
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "hero data/id not found");
  });
});

describe("PUT /heroes/:id (Update Hero)", function () {
  it("Berhasil update hero sebagai admin", async function () {
    const heroData = {
      name: "Layla", // Nama tidak boleh diubah
      imageUrl: "https://example.com/layla-updated.jpg",
      role: "Marksman",
      specially: "Reap",
      durability: 25,
      offence: 85,
      ability: 45,
      difficulty: 35
    };
    
    const response = await request(app)
      .put(`/heroes/${heroId}`)
      .set("Authorization", `Bearer ${admin_token}`)
      .send(heroData);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("information", "success update hero detail");
    expect(response.body.hero).toHaveProperty("durability", 25);
    expect(response.body.hero).toHaveProperty("offence", 85);
  });
  
  it("Gagal update hero sebagai user biasa", async function () {
    const heroData = {
      name: "Layla",
      imageUrl: "https://example.com/layla-updated.jpg",
      role: "Marksman",
      specially: "Reap",
      durability: 30,
      offence: 90,
      ability: 50,
      difficulty: 40
    };
    
    const response = await request(app)
      .put(`/heroes/${heroId}`)
      .set("Authorization", `Bearer ${access_token}`)
      .send(heroData);
    
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "forbidden access, only admin can change hero data");
  });
  
  it("Gagal update hero dengan mengubah nama", async function () {
    const heroData = {
      name: "Layla Changed", // Mencoba mengubah nama
      imageUrl: "https://example.com/layla-updated.jpg",
      role: "Marksman",
      specially: "Reap",
      durability: 25,
      offence: 85,
      ability: 45,
      difficulty: 35
    };
    
    const response = await request(app)
      .put(`/heroes/${heroId}`)
      .set("Authorization", `Bearer ${admin_token}`)
      .send(heroData);
    
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "cannot change hero name");
  });
});
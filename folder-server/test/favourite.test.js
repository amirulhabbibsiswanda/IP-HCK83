const request = require("supertest");
const { describe, it, expect, beforeAll, afterAll } = require("@jest/globals");
const app = require("../app");
const { hashPassword } = require("../helpers/hashPassword");
const { sequelize, User, Hero, UserFavouriteHero } = require("../models");
const { generateToken } = require("../helpers/jwt");
const queryInterface = sequelize.queryInterface;

let access_token;
let heroId;

beforeAll(async () => {
  console.log("SEEDING DATA UNTUK TESTING FAVOURITE");
  
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
    }
  ];
  
  await queryInterface.bulkInsert("Heroes", heroes);
  
  // Get hero ID
  const hero = await Hero.findOne({ where: { name: "Miya" } });
  heroId = hero.id;
  
  // Generate token
  const user = await User.findOne({ where: { email: "testuser@gmail.com" } });
  access_token = generateToken({
    id: user.id,
    email: user.email,
    userStatus: user.userStatus
  });
});

afterAll(async () => {
  console.log("CLEANUP SETELAH TESTING FAVOURITE");
  
  await queryInterface.bulkDelete("UserFavouriteHeroes", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
  
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

describe("POST /heroes/:heroId (Add to Favourite)", function () {
  it("Berhasil menambahkan hero ke favorit", async function () {
    const response = await request(app)
      .post(`/heroes/${heroId}`)
      .set("Authorization", `Bearer ${access_token}`);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Miya added to your favourite");
  });
  
  it("Gagal menambahkan hero yang tidak ada ke favorit", async function () {
    const response = await request(app)
      .post("/heroes/999999")
      .set("Authorization", `Bearer ${access_token}`);
    
    expect(response.status).toBe(500); // Tergantung implementasi error handling
  });
});

describe("GET /users/favourites (Get User Favourites)", function () {
  it("Berhasil mendapatkan daftar hero favorit user", async function () {
    const response = await request(app)
      .get("/users/favourites")
      .set("Authorization", `Bearer ${access_token}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("name", "Miya");
  });
});

describe("DELETE /heroes/:heroId (Remove from Favourite)", function () {
  it("Berhasil menghapus hero dari favorit", async function () {
    const response = await request(app)
      .delete(`/heroes/${heroId}`)
      .set("Authorization", `Bearer ${access_token}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Miya has been removed from your favourite");
    
    // Verifikasi hero sudah tidak ada di favorit
    const favResponse = await request(app)
      .get("/users/favourites")
      .set("Authorization", `Bearer ${access_token}`);
    
    expect(favResponse.body.length).toBe(0);
  });
});
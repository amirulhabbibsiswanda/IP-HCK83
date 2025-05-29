# API Documentation

Dokumentasi ini berisi informasi tentang endpoint API yang tersedia di aplikasi Mobile Legends Hero Recommendation.

## Daftar Isi
1. [Autentikasi](#autentikasi)
2. [User Management](#user-management)
   - [Register](#register)
   - [Login](#login)
   - [Login dengan Google](#login-dengan-google)
   - [Get User Favourite Heroes](#get-user-favourite-heroes)
   - [Upgrade Status](#upgrade-status)
   - [Change Status from Stripe Session](#change-status-from-stripe-session)
3. [Hero Management](#hero-management)
   - [Get All Heroes](#get-all-heroes)
   - [Get Hero Detail](#get-hero-detail)
   - [Update Hero](#update-hero)
   - [Update Hero Image](#update-hero-image)
4. [User Favourite Hero Management](#user-favourite-hero-management)
   - [Add Hero to Favourite](#add-hero-to-favourite)
   - [Remove Hero from Favourite](#remove-hero-from-favourite)
5. [AI Generation](#ai-generation)
   - [Get Top Hero Recommendations](#get-top-hero-recommendations)
6. [Error Handling](#error-handling)

## Autentikasi

Sebagian besar endpoint memerlukan autentikasi. Untuk mengakses endpoint yang memerlukan autentikasi, sertakan token JWT di header Authorization.
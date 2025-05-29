require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const { comparePassword } = require("../helpers/hashPassword")
const { generateToken, verifyToken } = require("../helpers/jwt")
const { User, Hero } = require("../models/index")
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

class UserController {
    static async register(req, res, next) {
        try {

            let { username, email, password, mobileLegendsRank, favouriteRole } = req.body
            let user = await User.create({
                username,
                email,
                password,
                mobileLegendsRank,
                favouriteRole
            })

            res.status(201).json({
                username: user.username,
                email: user.email,
                mobileLegendsRank: user.mobileLegendsRank,
                favouriteRole: user.favouriteRole
            })
        } catch (error) {
            // console.log(error, error.message, "ini error dan message");
            next(error)
        }
    }

    static async login(req, res, next) {
        try {
            // console.log(req.headers, "ini headers");

            let { email, password } = req.body
            if (!email) {
                throw { name: "emptyInputLogin" }
            }
            if (!password) {
                throw { name: "emptyInputLogin" }
            }

            let user = await User.findOne(
                {
                    where: {
                        email: email
                    }
                }
            )
            if (!user) {
                throw { name: "emailNotFound" }
            }

            let isMatchPassword = await comparePassword(password, user.password)
            if (isMatchPassword === false) {
                throw { name: "incorrectPassword" }
            }

            let payload = {
                id: user.id,
                email: user.email,
                userStatus: user.userStatus
            }
            let jwtToken = generateToken(payload)

            res.status(200).json({ access_token: jwtToken })

        } catch (error) {
            next(error)
        }
    }

    static async googleLogin(req, res, next) {
        try {
            const { id_token, mobileLegendsRank, favouriteRole } = req.body;
            const ticket = await client.verifyIdToken({
                idToken: id_token,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            // console.log(payload, "ini payload di google login");

            let user = await User.findOne({ where: { email: payload.email } });

            // Jika user belum ada, buat user baru
            if (!user) {
                user = await User.create({
                    username: payload.name || "Google User",
                    email: payload.email,
                    password: Math.random().toString(36).slice(-8), // Password random
                    mobileLegendsRank: mobileLegendsRank || "epic",
                    favouriteRole: favouriteRole || "Tank",
                    userStatus: "customer"
                });
                console.log("New user created:", user.email);
            }

            const access_token = generateToken({
                id: user.id,
                email: user.email,
                userStatus: user.userStatus
            });

            // Kirim response
            res.status(200).json({ access_token });
        } catch (error) {
            console.log("Google login error:", error);
            next(error);
        }
    }

    static async getUserFavouriteHero(req, res, next) {
        try {
            const userId = req.user.id; // Diambil dari JWT via authentication middleware

            const user = await User.findByPk(userId, {
                include: {
                    model: Hero,
                    through: { attributes: [] } // opsional: tidak menampilkan kolom dari tabel junction
                }
            });

            // console.log(user.Heros, 'ini usernya');
            res.status(200).json(user.Heros); // karena relasi many-to-many
        } catch (error) {
            next(error);
        }
    }

    static async upgradeStatus(req, res, next) {
        try {
            const user = await User.findByPk(req.user.id);

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [
                    {
                        price_data: {
                            currency: 'idr',
                            product_data: {
                                name: 'Upgrade to Admin',
                                description: `User: ${user.email}`,
                            },
                            unit_amount: 100_000 * 100, // 100.000 IDR
                        },
                        quantity: 1,
                    },
                ],
                mode: 'payment',
                success_url: `http://localhost:5173/upgrade-success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `http://localhost:5173/`,
            });

            res.status(200).json({ url: session.url });
        } catch (error) {
            next(error);
        }
    }

    // Controller
    static async changeStatusFromStripeSession(req, res, next) {
        try {
            const { session_id } = req.query;
            if (!session_id) {
                throw { name: "InvalidSession" };
            }

            const session = await stripe.checkout.sessions.retrieve(session_id);
            
            // Gunakan ID user dari token autentikasi
            const userId = req.user.id;
            
            const [updated] = await User.update(
                { userStatus: "admin" },
                { where: { id: userId } }
            );

            if (updated === 0) {
                throw { name: "UserNotFound" };
            }

            res.status(200).json({ message: "User upgraded to admin via Stripe session" });
        } catch (err) {
            next(err);
        }
    }


}

module.exports = UserController
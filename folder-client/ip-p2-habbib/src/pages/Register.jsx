import { useState } from "react"
import axiosInstance from "../lib/http"
import { NavLink, useNavigate } from "react-router";
import SubmitButton from "../components/SubmitButton";

export default function Register() {
    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [mobileLegendsRank, setMobileLegendsRank] = useState("")
    const [favouriteRole, setFavouriteRole] = useState("")

    async function postRegister(e) {
        e.preventDefault()
        try {
            await axiosInstance.post("/users/register",
                {
                    username, email, password, mobileLegendsRank, favouriteRole
                }
            )

            navigate("/login")
        } catch (error) {
            console.log(error);
            console.log(error.message);

        }
    }

    return (
        <div className="container mt-5 p-4 rounded bg-dark shadow-lg" style={{ maxWidth: '500px' }}>

            <form onSubmit={postRegister}>
                <div className="form-group">
                    <label htmlFor="">Username</label>
                    <input
                        value={username}
                        onChange={(e) => { setUsername(e.target.value) }}
                        type="text"
                        className="form-control"
                        id=""
                        placeholder=""
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="">Email address</label>
                    <input
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        type="email"
                        className="form-control"
                        id=""
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                    />
                    <small id="emailHelp" className="form-text text-muted">
                        We'll never share your email with anyone else.
                    </small>
                </div>
                <div className="form-group">
                    <label htmlFor="">Password</label>
                    <input
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        type="password"
                        className="form-control"
                        id=""
                        placeholder=""
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="">Mobile Legends Rank</label>
                    <input
                        value={mobileLegendsRank}
                        onChange={(e) => { setMobileLegendsRank(e.target.value) }}
                        type="text"
                        className="form-control"
                        id=""
                        placeholder=""
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="">Favourite Role</label>
                    <input
                        value={favouriteRole}
                        onChange={(e) => { setFavouriteRole(e.target.value) }}
                        type="text"
                        className="form-control"
                        id=""
                        placeholder="ex: Tank, Marksman, Assassin, Fighter, Mage, Support"
                    />
                </div>

                <SubmitButton />
                <p>Already have account? <NavLink to={"/login"}>login</NavLink></p>

            </form>
        </div>

    )
}
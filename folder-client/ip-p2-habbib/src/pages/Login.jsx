import { useState } from "react"
import axiosInstance from "../lib/http"
import { NavLink, useNavigate } from "react-router";
import SubmitButton from "../components/SubmitButton";

export default function Login() {
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")


    async function postLogin(e) {
        e.preventDefault()
        try {
            const { data } = await axiosInstance.post("/users/login",
                {
                    email, password
                }
            )
            // console.log(data);
            localStorage.setItem("access_token", data.access_token)

            navigate("/")
        } catch (error) {
            console.log(error);
            console.log(error.message);

        }
    }

    return (
        <form onSubmit={postLogin}>

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


            <SubmitButton />
            <p>Don't have any account? <NavLink to={"/register"}>register</NavLink></p>

        </form>

    )
}
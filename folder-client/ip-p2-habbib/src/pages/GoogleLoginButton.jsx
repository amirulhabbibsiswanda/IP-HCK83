import { useEffect } from "react"
import axiosInstance from "../lib/http"
import { useNavigate } from "react-router"


export default function GoogleLoginButton() {
    const navigate = useNavigate()

    useEffect(() => {
        /* global google */
        if (window.google) {
            google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID, // <-- Ganti dengan yang dari Google Console
                callback: handleCredentialResponse,
            });

            google.accounts.id.renderButton(
                document.getElementById("google-login-button"),
                { theme: "outline", size: "large" }
            );
        }
    }, []);

    async function handleCredentialResponse(response) {
        try {
            const { data } = await axiosInstance.post("/users/login-google", {
                id_token: response.credential,
                mobileLegendsRank: "epic",          // Atau minta user input dulu
                favouriteRole: "Tank"               // Atau minta user input dulu
            });

            localStorage.setItem("access_token", data.access_token);
            navigate("/");
        } catch (err) {
            console.error("Login failed", err);
            alert("Google login failed.");
        }
    }

    return <div id="google-login-button"></div>
}

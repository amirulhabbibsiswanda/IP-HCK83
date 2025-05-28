import { useEffect } from "react";
import axios from "axios";

function App() {
  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const id_token = response.credential;
          console.log("Encoded JWT ID token: ", id_token);

          const { data } = await axios.post("http://localhost:3000/users/login-google", {
            id_token,
          });

          console.log(data, "Access token dari backend");
          localStorage.setItem("access_token", data.access_token);
        } catch (error) {
          console.error("Google login error:", error.response?.data || error.message);
        }
      },
    });

    window.google.accounts.id.renderButton(document.getElementById("buttonDiv"), {
      theme: "outline",
      size: "large",
    });

    window.google.accounts.id.prompt();
  }, []);

  return (
    <div id="buttonDiv"></div>
  )
}

export default App;

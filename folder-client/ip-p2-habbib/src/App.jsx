import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [loginStatus, setLoginStatus] = useState("");

  const handleGoogleResponse = async (response) => {
    try {
      const id_token = response.credential;
      console.log("Encoded JWT ID token: ", id_token);
      setLoginStatus("Authenticating...");

      // Create user data with all required fields
      const { data } = await axios.post("http://localhost:3000/users/login-google", {
        id_token,
        mobileLegendsRank: "epic", // Using default value
        favouriteRole: "Tank", // Using default value
      });

      console.log("Login response:", data);
      localStorage.setItem("access_token", data.access_token);
      setLoginStatus("Login successful!");
    } catch (error) {
      console.error("Google login error:", error);
      console.error("Error details:", error.response?.data || error.message);
      setLoginStatus(`Login failed: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(document.getElementById("buttonDiv"), {
      theme: "outline",
      size: "large",
    });

    window.google.accounts.id.prompt();
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Google Login</h1>
      <div id="buttonDiv" style={{ display: 'inline-block', marginBottom: '20px' }}></div>
      {loginStatus && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: loginStatus.includes('failed') ? '#ffdddd' : '#ddffdd' }}>
          {loginStatus}
        </div>
      )}
    </div>
  );
}

export default App;

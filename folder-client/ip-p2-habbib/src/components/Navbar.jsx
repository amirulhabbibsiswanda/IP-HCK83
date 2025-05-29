import { useNavigate } from "react-router"

export default function Navbar() {

    const navigate = useNavigate()

    const logout = () => {
        localStorage.clear()
        navigate("/login")
    }

    const handleUpgrade = async () => {
        const token = localStorage.getItem('access_token'); // sesuaikan penyimpanan token kamu
        const res = await fetch('http://localhost:3000/users/upgrade', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        window.location.href = data.url; // redirect ke Stripe
    };


    return (
        <div className="bg-dark py-2 px-3 d-flex gap-2">
            <a onClick={() => { navigate("/") }} className="btn btn-outline-light" >Heroes</a>
            <a onClick={() => { navigate("/users/favourites") }} className="btn btn-outline-light">My Favourite Heroes</a>
            <a onClick={() => { navigate("/recommendations") }} className="btn btn-outline-light">Hero Recommendations</a>
            <a onClick={handleUpgrade} className="btn btn-outline-light">Upgrade Status</a>
            <a onClick={() => { navigate(-1) }} className="btn btn-outline-light">Back</a>
            {/* <a onClick={() => { navigate("/") }} className="btn btn-outline-light">Upgrade</a> */}
            <a onClick={logout} className="btn btn-outline-light">Logout</a>

        </div>

    )
}

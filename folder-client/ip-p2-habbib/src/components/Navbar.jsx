import { useNavigate } from "react-router"

export default function Navbar() {

    const navigate = useNavigate()

    const logout = () => {
        localStorage.clear()
        navigate("/login")
    }

    return (
        <div className="bg-dark py-2 px-3 d-flex gap-2">
            <a onClick={() => { navigate("/") }} className="btn btn-outline-light" >Heroes</a>
            <a onClick={() => { navigate("/users/favourites") }} className="btn btn-outline-light">My Favourite Heroes</a>
            <a onClick={() => { navigate("/recommendations") }} className="btn btn-outline-light">Hero Recommendations</a>
            <a onClick={() => { navigate(-1) }} className="btn btn-outline-light">Back</a>
            <a onClick={logout} className="btn btn-outline-light">Logout</a>

        </div>

    )
}

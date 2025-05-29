import { useNavigate } from "react-router"

export default function Navbar() {

    const navigate = useNavigate()

    const logout = () => {
        localStorage.clear()
        navigate("/login")
    }

    return (
        <div>
            <a onClick={() => { navigate("/") }} className="btn btn-primary" >Heroes</a>
            <a onClick={() => { navigate("/users/favourites") }} className="btn btn-primary">My Favourite Heroes</a>
            <a onClick={() => { navigate(-1) }} className="btn btn-primary">Back</a>
            <a onClick={logout} className="btn btn-primary">Logout</a>

        </div>

    )
}

import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout, upgradeStatus } from "../redux/features/authSlice";

export default function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { upgradeUrl } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    const handleUpgrade = async () => {
        const result = await dispatch(upgradeStatus());
        if (upgradeStatus.fulfilled.match(result)) {
            window.location.href = result.payload.url; // redirect ke Stripe
        }
    };

    return (
        <div className="bg-dark py-2 px-3 d-flex gap-2">
            <a onClick={() => { navigate("/") }} className="btn btn-outline-light" >Heroes</a>
            <a onClick={() => { navigate("/users/favourites") }} className="btn btn-outline-light">My Favourite Heroes</a>
            <a onClick={() => { navigate("/recommendations") }} className="btn btn-outline-light">Hero Recommendations</a>
            <a onClick={handleUpgrade} className="btn btn-outline-light">Upgrade Status</a>
            <a onClick={() => { navigate(-1) }} className="btn btn-outline-light">Back</a>
            <a onClick={handleLogout} className="btn btn-outline-light">Logout</a>
        </div>
    )
}

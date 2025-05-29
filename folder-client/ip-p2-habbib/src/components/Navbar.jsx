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
        <nav className="navbar navbar-expand-lg navbar-dark bg-gradient" style={{ background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)' }}>
            <div className="container-fluid">
                <span className="navbar-brand fw-bold">Hero Collection</span>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a onClick={() => { navigate("/") }} className="nav-link active">Heroes</a>
                        </li>
                        <li className="nav-item">
                            <a onClick={() => { navigate("/users/favourites") }} className="nav-link">My Favourites</a>
                        </li>
                        <li className="nav-item">
                            <a onClick={() => { navigate("/recommendations") }} className="nav-link">Hero Recommendations</a>
                        </li>
                        <li className="nav-item">
                            <a onClick={() => { navigate(-1) }} className="nav-link">Back</a>
                        </li>
                    </ul>
                    <div className="d-flex">
                        <button onClick={handleUpgrade} className="btn btn-outline-info me-2">Upgrade Status</button>
                        <button onClick={handleLogout} className="btn btn-outline-danger">Logout</button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

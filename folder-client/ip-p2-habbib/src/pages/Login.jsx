import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/features/authSlice";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(login({ email, password }));
        if (login.fulfilled.match(result)) {
            navigate("/");
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundImage: 'url(https://wallpapercave.com/wp/wp9311879.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card shadow-lg border-0" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)' }}>
                            <div className="card-body p-4 p-md-5">
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold text-info mb-2">Welcome Back</h2>
                                    <p className="text-light-emphasis">Sign in to continue to Hero Collection</p>
                                </div>
                                
                                {error && <div className="alert alert-danger">{error}</div>}
                                
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="email" className="form-label text-light">Email Address</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-transparent text-light border-end-0">
                                                <i className="bi bi-envelope"></i>
                                            </span>
                                            <input
                                                type="email"
                                                className="form-control bg-transparent text-light border-start-0"
                                                id="email"
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label text-light">Password</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-transparent text-light border-end-0">
                                                <i className="bi bi-lock"></i>
                                            </span>
                                            <input
                                                type="password"
                                                className="form-control bg-transparent text-light border-start-0"
                                                id="password"
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="d-grid mb-4">
                                        <button type="submit" className="btn btn-primary py-2 fw-bold" disabled={loading}>
                                            {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Loading...</> : "Sign In"}
                                        </button>
                                    </div>
                                </form>
                                <div className="text-center">
                                    <p className="text-light-emphasis">Don't have an account? <a onClick={() => navigate("/register")} className="text-info fw-bold">Register</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
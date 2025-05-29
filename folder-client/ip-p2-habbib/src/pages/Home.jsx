import { useState } from "react"
import axiosInstance from "../lib/http";
import { useEffect } from "react";
import Card from "../components/Card";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchHeroes, addToFavourite } from "../redux/features/heroesSlice";

export default function Home() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { heroes, loading, error } = useSelector((state) => state.heroes);

    useEffect(() => {
        dispatch(fetchHeroes());
    }, [dispatch]);

    const handleAddToFavourite = (heroId) => {
        dispatch(addToFavourite(heroId));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container py-5">
            <div className="row mb-4">
                <div className="col-12">
                    <h1 className="display-5 fw-bold text-center text-light mb-4">TROOPERS</h1>
                    <p className="lead text-center text-light-emphasis mb-5">Explore and collect your favorite Mobile Legends heroes</p>
                </div>
            </div>

            {loading && (
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
                {heroes.map((hero) => (
                    <div className="col" key={hero.id}>
                        <div className="card h-100 bg-transparent border-0">
                            <Card hero={hero} />
                            <div className="card-footer bg-transparent border-0 d-flex justify-content-between pt-3">
                                <button onClick={() => { navigate(`/heroes/${hero.id}`) }} className="btn btn-sm btn-primary flex-grow-1 me-2">
                                    <i className="bi bi-info-circle me-1"></i> Details
                                </button>
                                <button onClick={(e) => { e.preventDefault(); handleAddToFavourite(hero.id) }} className="btn btn-sm btn-outline-warning flex-grow-1">
                                    <i className="bi bi-star me-1"></i> Favorite
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

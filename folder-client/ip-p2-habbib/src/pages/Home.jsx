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
        <div>
            <div className="d-flex flex-wrap gap-3">
                {
                    heroes.map((hero) => {
                        return (
                            <div key={hero.id}>
                                <Card hero={hero} />
                                <a onClick={() => { navigate(`/heroes/${hero.id}`) }} className="btn btn-primary">
                                    detail
                                </a>
                                <a onClick={(e) => { e.preventDefault(); handleAddToFavourite(hero.id) }} className="btn btn-primary">
                                    add to favourite
                                </a>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

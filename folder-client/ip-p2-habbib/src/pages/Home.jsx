import { useState } from "react"
import axiosInstance from "../lib/http";
import { useEffect } from "react";
import Card from "../components/Card";
import { useNavigate } from "react-router";

export default function Home() {
    const [heroes, setHeroes] = useState([])
    const navigate = useNavigate()

    async function fetchHeroes() {
        try {
            const { data } = await axiosInstance.get("/",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`
                    }
                }
            )
            // console.log(data);
            setHeroes(data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchHeroes()
    }, [])

    async function addToFavourite(heroId) {
        try {
            await axiosInstance.post(`/heroes/${heroId}`, {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`
                    }
                }
            )
            fetchHeroes()
        } catch (error) {
            console.log(error);

        }
    }


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
                                <a onClick={(e) => { e.preventDefault(); addToFavourite(hero.id) }} className="btn btn-primary">
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

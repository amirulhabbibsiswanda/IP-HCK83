import { useState, useEffect } from "react"
import axiosInstance from "../lib/http";
import Card from "../components/Card";

export default function FavouriteHero() {
    const [heroes, setHeroes] = useState([])

    async function getUserFavouriteHero() {
        try {
            const { data } = await axiosInstance.get("/users/favourites",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`
                    }
                }
            )
            // console.log(data, "ini di favorti");
            setHeroes(data)
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        getUserFavouriteHero()
    }, [])

    const deleteFavourite = async (heroId) => {
        try {
            await axiosInstance.delete(`/heroes/${heroId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`
                    }
                }
            )
            getUserFavouriteHero()
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="container d-flex gap-3">
            {
                heroes.map((hero) => {
                    return (
                        <div key={hero.id}>
                            <Card hero={hero} />
                            <a onClick={() => { deleteFavourite(hero.id) }} className="btn btn-primary">remove from favourite</a>
                        </div>
                    )
                })
            }
        </div>
    )
}
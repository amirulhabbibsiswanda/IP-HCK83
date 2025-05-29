import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import axiosInstance from "../lib/http"
import { useEffect } from "react"
import Card from "../components/Card"

export default function HeroDetail() {
    const navigate = useNavigate()
    const heroId = useParams().id
    const [hero, setHero] = useState({})

    async function getHeroById(heroId) {
        try {
            const { data } = await axiosInstance.get(`/heroes/${heroId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`
                    }
                }
            )
            // console.log(data, "ini data");
            setHero(data)
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        getHeroById(heroId)
    }, [heroId])

    return (
        <div>
            <Card hero={hero} />
            <p>{hero.specially}</p>
            <button onClick={() => { navigate(`/heroes/edit/${hero.id}`) }}>edit detail hero </button>
            <button onClick={() => { navigate(`/image/upload/${hero.id}`) }}>change image </button>
        </div>
    )
}
import { useEffect, useState } from "react"
import axiosInstance from "../lib/http"
import Card from "../components/Card"

export default function Recommendations() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [recommendations, setRecommendations] = useState([])
    const [user, setUser] = useState({})
    const [heroes, setHeroes] = useState([])

    useEffect(() => {
        async function fetchRecommendations() {
            try {
                const { data } = await axiosInstance.get("/generate-ai", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                })

                setUser(data.user)
                setRecommendations(data.recommendations)
                setHeroes(data.heroes)
            } catch (err) {
                console.error(err)
                setError("Failed to fetch hero recommendations.")
            } finally {
                setLoading(false)
            }
        }

        fetchRecommendations()
    }, [])

    if (loading) return <p className="text-center mt-5">Loading recommendations...</p>
    if (error) return <p className="text-center text-danger mt-5">{error}</p>

    return (
        <div className="container mt-4">
            <h1 className="mb-2">Hi, <strong>{user.username}</strong></h1>
            <p>Your favorite role: <span className="fw-bold">{user.fovouriteRole}</span></p>

            <h3 className="mt-4">Top 5 Recommended Heroes (Names)</h3>
            <ul className="list-group mb-4">
                {recommendations.map((name, idx) => (
                    <li key={idx} className="list-group-item bg-dark text-light">
                        <span className="badge bg-primary me-2">{idx + 1}</span>{name}
                    </li>
                ))}
            </ul>

            <h4>Top 5 Hero Details</h4>
            <div className="row">
                {heroes.map(hero => (
                    <div key={hero.id} className="col-md-4 mb-3">
                        <Card hero={hero} />
                    </div>
                ))}
            </div>
        </div>
    )
}

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
        <div className="container py-5">
            <div className="row">
                <div className="col-md-4 mb-4 mb-md-0">
                    <div className="sticky-md-top pt-md-5">
                        <Card hero={hero} />
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card bg-gradient shadow-lg border-0 mb-4" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                        <div className="card-body p-4">
                            <h1 className="display-5 fw-bold text-info mb-3">{hero.name}</h1>
                            <div className="d-flex align-items-center mb-3">
                                <span className="badge bg-primary me-2 px-3 py-2">{hero.role}</span>
                                {hero.mobileLegendsRank && <span className="badge bg-secondary px-3 py-2">{hero.mobileLegendsRank}</span>}
                            </div>
                            
                            <div className="card bg-dark bg-opacity-50 border-0 mb-4">
                                <div className="card-body">
                                    <h5 className="text-light mb-3">Special Ability</h5>
                                    <p className="lead text-light-emphasis">{hero.specially || "No special ability information available."}</p>
                                </div>
                            </div>
                            
                            <div className="d-flex gap-2 mt-4">
                                <button onClick={() => { navigate(`/heroes/edit/${hero.id}`) }} className="btn btn-warning">
                                    <i className="bi bi-pencil me-2"></i>Edit Hero
                                </button>
                                <button onClick={() => { navigate(`/image/upload/${hero.id}`) }} className="btn btn-info">
                                    <i className="bi bi-image me-2"></i>Change Image
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
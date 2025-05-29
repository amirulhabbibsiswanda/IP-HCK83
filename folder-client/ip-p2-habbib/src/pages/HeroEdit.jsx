import { useState } from "react"
import axiosInstance from "../lib/http"
import { useNavigate, useParams } from "react-router"
import SubmitButton from "../components/SubmitButton"

export default function HeroEdit() {
    const heroId = useParams().id
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [role, setRole] = useState("")
    const [specially, setSpecially] = useState("")
    const [durability, setDurability] = useState(0)
    const [offence, setOffence] = useState(0)
    const [ability, setAbility] = useState(0)
    const [difficulty, setDifficulty] = useState(0)

    async function submitEdit(e) {
        e.preventDefault()
        try {
            await axiosInstance.put(`/heroes/${heroId}`,
                {
                    name, imageUrl, role, specially, durability, offence, ability, difficulty
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`
                    }
                }
            )
            navigate("/")
        } catch (error) {
            console.log(error);

        }
    }

    return (
        <div>
            <form onSubmit={submitEdit}>
                <div className="form-group">
                    <label htmlFor="">Hero Name</label>
                    <input
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                        type="text"
                        className="form-control"
                        id=""
                        placeholder=""
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="">Image URL</label>
                    <input
                        value={imageUrl}
                        onChange={(e) => { setImageUrl(e.target.value) }}
                        type="email"
                        className="form-control"
                        id=""
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="">Hero Role</label>
                    <input
                        value={role}
                        onChange={(e) => { setRole(e.target.value) }}
                        type="password"
                        className="form-control"
                        id=""
                        placeholder=""
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="">Hero Specially</label>
                    <input
                        value={specially}
                        onChange={(e) => { setSpecially(e.target.value) }}
                        type="text"
                        className="form-control"
                        id=""
                        placeholder=""
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="">Hero Durability</label>
                    <input
                        value={durability}
                        onChange={(e) => { setDurability(e.target.value) }}
                        type="number"
                        className="form-control"
                        id=""
                        placeholder=""
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="">Hero Offence</label>
                    <input
                        value={offence}
                        onChange={(e) => { setOffence(e.target.value) }}
                        type="number"
                        className="form-control"
                        id=""
                        placeholder=""
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="">Hero Ability</label>
                    <input
                        value={ability}
                        onChange={(e) => { setAbility(e.target.value) }}
                        type="number"
                        className="form-control"
                        id=""
                        placeholder=""
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="">Hero Difficulty</label>
                    <input
                        value={difficulty}
                        onChange={(e) => { setDifficulty(e.target.value) }}
                        type="number"
                        className="form-control"
                        id=""
                        placeholder=""
                    />
                </div>
                <SubmitButton />

            </form>
        </div>
    )
}
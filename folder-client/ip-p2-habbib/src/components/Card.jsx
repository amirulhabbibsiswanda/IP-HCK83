
export default function Card({ hero }) {

    return (
        <div className="card shadow-lg border-0" style={{ backgroundColor: '#1e293b', color: '#fff' }}>

            <div className="card" style={{ width: "18rem" }}>
                <img className="card-img-top" src={hero.imageUrl} alt="Card image cap" />
                <div className="card-body">
                    <h5 className="card-title">{hero.name}</h5>
                    <p className="card-text">
                        {hero.role}
                    </p>

                </div>
            </div>
        </div>
    )
}
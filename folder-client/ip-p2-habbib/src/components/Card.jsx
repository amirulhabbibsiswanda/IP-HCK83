
export default function Card({ hero }) {
    return (
        <div className="card shadow-lg border-0 h-100 transition-all hover-scale" style={{ backgroundColor: '#1e293b', color: '#fff', transform: 'scale(1)', transition: 'transform 0.3s ease' }}>
            <img className="card-img-top object-fit-cover" style={{ height: "200px" }} src={hero.imageUrl} alt={hero.name} />
            <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold text-info">{hero.name}</h5>
                <div className="badge bg-primary mb-2">{hero.role}</div>
                {hero.specially && <p className="card-text small text-light-emphasis">{hero.specially}</p>}
            </div>
        </div>
    )
}
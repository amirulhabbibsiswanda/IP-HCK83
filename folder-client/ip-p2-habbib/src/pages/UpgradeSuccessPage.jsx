import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

export default function UpgradeSuccessPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get('session_id');

    useEffect(() => {
        if (!sessionId) {
            console.error('Session ID tidak ditemukan');
            navigate('/');
            return;
        }

        // Simpan token ke variabel untuk digunakan jika terjadi error
        const token = localStorage.getItem("access_token");

        fetch(`https://hck.duniahabbib.site/users/upgrade-success?session_id=${sessionId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })
            .then(res => res.json())
            .then(data => {
                // alert(`Status berhasil di-upgrade menjadi admin`);
                navigate('/', { replace: true }); // Gunakan navigate dengan replace
            })
            .catch(err => {
                console.error('Gagal upgrade status:', err);
                navigate('/');
            });
    }, [sessionId, navigate]);

    return <p>Mengubah status jadi admin, mohon tunggu...</p>;
}

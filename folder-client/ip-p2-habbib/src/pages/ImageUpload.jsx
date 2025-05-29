

import { useParams, useNavigate } from 'react-router'
import { useState } from 'react'

import axiosInstance from '../lib/http'

export default function ImageUpload() {
    const heroId = useParams().id
    const navigate = useNavigate()
    const [file, setFile] = useState(null)
    const [hero, setHero] = useState(false)

    async function handleUpload() {

        setHero(true)
        try {
            const formData = new FormData()
            formData.append('image', file)

            await axiosInstance.patch(`/heroes/image-url/` + heroId, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            })

            setFile(null)
            navigate('/')
        } catch (error) {
            console.log(error);


        } finally {
            setHero(false)
        }
    }


    return (

        <div className='bg-yellow-50'>

            <div className="flex flex-col items-center justify-center min-h-[40vh]  px-4 mt-6">
                <h2 className="text-lg font-semibold text-yellow-700 mb-4">
                    Change hero image with ID: {heroId}
                </h2>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    disabled={hero}
                    className="mb-4 block w-full max-w-xs text-sm text-gray-700 bg-white border border-yellow-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:opacity-50"
                />

                <div className="flex gap-4">
                    <button
                        onClick={handleUpload}
                        disabled={hero || !file}
                        className={`px-4 py-2 rounded-lg text-white font-semibold transition ${hero || !file
                            ? 'bg-yellow-300 cursor-not-allowed'
                            : 'bg-yellow-500 hover:bg-yellow-600'
                            }`}
                    >
                        {hero ? 'Uploading Image' : 'Upload Image'}
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        disabled={hero}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${hero
                            ? 'bg-gray-300 text-white cursor-not-allowed'
                            : 'bg-white text-yellow-700 border border-yellow-500 hover:bg-yellow-100'
                            }`}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>


    )
}

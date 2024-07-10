import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function ErrorPage() {
    const navigate = useNavigate()
    useEffect(() => {
        navigate("/")
    }, [navigate])
    return (
        <div>ErrorPage</div>
    )
}

export default ErrorPage
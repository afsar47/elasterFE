import { Navigate, Outlet } from 'react-router-dom'
import appConfig from '@/configs/app.config'
import useAuth from '@/utils/hooks/useAuth'
import {jwtDecode} from 'jwt-decode'

const { superAdminEntryPath, dealerEntryPath } = appConfig

interface TokenPayload {
    role: string
}

const PublicRoute = () => {
    const { token, authenticated } = useAuth()

    if (token) {
        // Decode token to get user role
        let userRole: string | null = null
        try {
            const decodedToken = jwtDecode<TokenPayload>(token)
            userRole = decodedToken.role
        } catch (error) {
            console.error('Error decoding token:', error)
        }
        // Redirect to respective home paths
        if (userRole === 'superAdmin') {
            return <Navigate to={superAdminEntryPath} />
        } else if (userRole === 'dealer') {
            return <Navigate to={dealerEntryPath} />
        }
    }

    return <Outlet />
}

export default PublicRoute

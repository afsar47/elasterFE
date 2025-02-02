import { Navigate, Outlet, useLocation } from 'react-router-dom'
import appConfig from '@/configs/app.config'
import useAuth from '@/utils/hooks/useAuth'
import { jwtDecode } from 'jwt-decode'
import { ReactNode } from 'react'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'

const { unAuthenticatedEntryPath } = appConfig

interface TokenPayload {
    role: string
}

interface ProtectedRouteProps {
    allowedRoles: string[]
    children?: ReactNode
}

const ProtectedRoute = () => {
    const { authenticated } = useAuth()

    const location = useLocation()

    if (!authenticated) {
        return (
            <Navigate
                replace
                to={`${unAuthenticatedEntryPath}?${REDIRECT_URL_KEY}=${location.pathname}`}
            />
        )
    }   

    return <Outlet />
}

export default ProtectedRoute


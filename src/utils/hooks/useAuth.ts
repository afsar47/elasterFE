import {jwtDecode} from 'jwt-decode'
import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService'
import {
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppSelector,
    useAppDispatch,
} from '@/store'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'
import type { SignInCredential, SignUpCredential } from '@/@types/auth'

type Status = 'success' | 'failed'

type SignInResponse = {
    status: 'success';
    message: string;
    token?: string; // Include token here
}

function useAuth() {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const query = useQuery()

    const { token, signedIn } = useAppSelector((state) => state.auth.session)

    // Decode the JWT token to extract the role
    const decodeToken = (token: string) => {
        try {
            const decoded: any = jwtDecode(token)
            return decoded
        } catch (error) {
            console.error('Invalid token', error)
            return null
        }
    }

    // Sign-In Function
    const signIn = async (
        values: SignInCredential
    ): Promise<SignInResponse | { status: 'failed'; message: string } | undefined> => {
        try {
            const resp = await apiSignIn(values)
            // Assuming resp contains the relevant fields
            if (resp.status === 200 && resp) {
                const { token, role, user } = resp // Adjust this based on the actual response structure
    
                dispatch(signInSuccess(token))
    
                const decodedToken = decodeToken(token)
                if (decodedToken) {
                    dispatch(
                        setUser({
                            avatar: '', // Assuming no avatar field in your response
                            username: user.username || 'Anonymous',
                            email: user.email || '',
                            authority: [role], // Set user role from response (superAdmin or dealer)
                        })
                    )
                }
    
                const redirectUrl = query.get(REDIRECT_URL_KEY)
                navigate(
                    redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                )
    
                return {
                    status: 'success',
                    message: '',
                    token, // Return the token here
                }
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }
    

    // Sign-Out Function
    const signOut = async () => {
        await apiSignOut()
        dispatch(signOutSuccess())
        dispatch(
            setUser({
                avatar: '',
                username: '',
                email: '',
                authority: [],
            })
        )
        navigate(appConfig.unAuthenticatedEntryPath)
    }

    return {
        authenticated: token && signedIn,
        token,
        signIn,
        signUp: async (values: SignUpCredential) => {
            try {
                const resp = await apiSignIn(values)
                if (resp.status === 200) {
                    const { token, role, user } = resp // Adjusted for the new structure
                    dispatch(signInSuccess(token))
    
                    const decodedToken = decodeToken(token)
                    if (decodedToken) {
                        dispatch(
                            setUser({
                                avatar: '', // Assuming no avatar field in your response
                                username: user.username || 'Anonymous',
                                email: user.email || '',
                                authority: [role], // Set user role from response (superAdmin)
                            })
                        )
                    }
    
                    const redirectUrl = query.get(REDIRECT_URL_KEY)
                    navigate(
                        redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath
                    )
    
                    return {
                        status: 'success',
                        message: '',
                    }
                }
            } catch (errors: any) {
                return {
                    status: 'failed',
                    message: errors?.response?.data?.message || errors.toString(),
                }
            }
        },
        signOut,
    }
}

export default useAuth

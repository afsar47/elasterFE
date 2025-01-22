import axios from 'axios';
import appConfig from '@/configs/app.config'; // Your app config

const { apiPrefix } = appConfig; // Use this to prefix your API calls (optional)

// Set the base URL to point to your backend API

const API_BASE_URL = 'http://localhost:1024'; // Assuming backend is running on localhost:1024
// const API_BASE_URL = 'https://api.247automotive.services'; // Assuming backend is running on localhost:1024

// Sign-In API Call
export async function apiSignIn(username: string, password: string) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/user/sign-in`, {
            username,
            password,
        });
        return response.data; // Handle response data (e.g., user info, token)
    } catch (error: any) {
        console.error('Sign-in error', error);
        throw error.response?.data || 'Error signing in';
    }
}

// // Sign-Up API Call
// export async function apiSignUp(username, email, password) {
//     try {
//         const response = await axios.post(`${API_BASE_URL}${apiPrefix}/sign-up`, {
//             username,
//             email,
//             password,
//         });
//         return response.data; // Handle response data (e.g., user info, token)
//     } catch (error) {
//         console.error('Sign-up error', error);
//         throw error.response?.data || 'Error signing up';
//     }
// }

// Sign-Out API Call
export async function apiSignOut() {
    try {
        const response = await axios.get(`${API_BASE_URL}${apiPrefix}/sign-out`);
        return response.data; // Handle response
    } catch (error: any) {
        console.error('Sign-out error', error);
        throw error.response?.data || 'Error signing out';
    }
}

// // Forgot Password API Call
// export async function apiForgotPassword(email) {
//     try {
//         const response = await axios.post(`${API_BASE_URL}${apiPrefix}/forgot-password`, {
//             email,
//         });
//         return response.data; // Handle response
//     } catch (error) {
//         console.error('Forgot password error', error);
//         throw error.response?.data || 'Error sending forgot password email';
//     }
// }

// Reset Password API Call
export async function apiResetPassword(token: any, newPassword: any) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/reset-password`, {
            token,
            newPassword,
        });
        return response.data; // Handle response
    } catch (error: any) {
        console.error('Reset password error', error);
        throw error.response?.data || 'Error resetting password';
    }
}

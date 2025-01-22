import axios from 'axios';
import appConfig from '@/configs/app.config'; // Ensure this is properly set up in your project

// Set the base URL to point to your backend API
const API_BASE_URL = 'http://localhost:1024';
// const API_BASE_URL = 'https://api.247automotive.services'; // Replace with your actual backend API URL

// Extract the API prefix from the app configuration
const { apiPrefix } = appConfig || { apiPrefix: '/api' }; // Default to '/api' if not defined

// Helper function to log and handle errors
function handleApiError(error: any) {
    if (axios.isAxiosError(error)) {
        console.error(`API Error: ${error.response?.status} - ${error.response?.statusText}`, error.response?.data);
        throw error.response?.data || 'An error occurred while processing the request';
    } else {
        console.error('Unexpected Error', error);
        throw 'Unexpected error occurred';
    }
}

// Sign-In API Call
export async function apiSignIn(data: any) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/user/sign-in`, data, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

// Sign-Up API Call
export async function apiSignUp(data: any) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/sign-up`, data, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

// Sign-Out API Call
export async function apiSignOut() {
    try {
        const response = await axios.get(`${API_BASE_URL}${apiPrefix}/sign-out`);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

// Forgot Password API Call
export async function apiForgotPassword(data: any) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/forgot-password`, data, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

// Reset Password API Call
export async function apiResetPassword(data: any) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/reset-password`, data, {
            headers: { 'Content-Type': 'application/json' },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
}

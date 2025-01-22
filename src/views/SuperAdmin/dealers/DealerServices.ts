import axios from 'axios';
import appConfig from '@/configs/app.config'; // Assuming you have this config for API prefix

// Set the base URL to point to your backend API
const API_BASE_URL = 'http://localhost:1024'; // Replace with your backend URL
// const API_BASE_URL = 'https://api.247automotive.services'; // Assuming backend is running on localhost:1024
const { apiPrefix } = appConfig; // If you have an API prefix like '/api'

//Create Dealer API Call
export async function apiCreateDealer(data: any) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/super-admin/create-dealer`, data);
        return response.data; // Handle response (e.g., token, user data)
    } catch (error: any) {
        console.error('Sign-in error', error);
        throw error.response?.data || 'Error signing in';
    }
}


// Get All Dealers API Call
export async function getAllDealers() {
    try {
        const response = await axios.get(`${API_BASE_URL}${apiPrefix}/super-admin/get-all-dealers`);
        return response.data; // Handle response (e.g., token, user data)
    } catch (error: any) {
        console.error('Get-All-Dealers error', error);
        throw error.response?.data || 'Error in getting all dealers';
    }
}

// Update Dealer API Call

export async function updateDealer(dealerId: number, dealer: any){
        try{
        
        const response = await axios.put(`${API_BASE_URL}${apiPrefix}/super-admin/update-dealer/${dealerId}`,dealer);
            return response.data;
        }
        catch(error:any){
            throw error.response?.data || 'Error updating dealer';
        }
}



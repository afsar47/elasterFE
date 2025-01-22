import axios from "axios";
import appConfig from "@/configs/app.config";
// Set the base URL to point to your backend API
const API_BASE_URL = 'http://localhost:1024'; 
// const API_BASE_URL = 'https://api.247automotive.services'; 
const { apiPrefix } = appConfig; // If you have an API prefix like '/api'


export async function getAllCustomersByPage(filters: any) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/get-all-customers-pagination`, filters);
        return response.data; // Handle response (e.g., token, user data)
    } catch (error: any) {
        console.error('Get-All-Customers error', error);
        throw error.response?.data || 'Error in getting all customers';
    }
}

export async function getAllCustomers() {
    try {
        const response = await axios.get(`${API_BASE_URL}${apiPrefix}/dealer/get-all-customers`);
        return response.data; // Handle response (e.g., token, user data)
    } catch (error: any) {
        console.error('Get-All-Customers error', error);
        throw error.response?.data || 'Error in getting all customers';
    }
}

export async function apiNewCustomer (data:any){
    try{
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/add-new-customer`,data);
        return response.data;
    }
    catch(error:any){
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in saving Customer'}`);

        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}

export async function getAllVehicles() {
    try {
        const response = await axios.get(`${API_BASE_URL}${apiPrefix}/dealer/get-all-vehicles`);
        return response.data; 
    } catch (error: any) {
        console.error('Get-All-Vehicles error', error);
        throw error.response?.data || 'Error in getting all vehicles';
    }
}

export async function getAllVehiclesByPage(filters: any) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/get-all-vehicles-pagination`, {
            params: filters,
        });
        return response.data; 
    } catch (error: any) {
        console.error('Get-All-Vehicles error', error);
        throw error.response?.data || 'Error in getting all vehicles';
    }
}


export async function apiNewVehicle (data:any){
    try{
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/add-new-vehicle`,data);
        return response.data;
    }
    catch(error:any){
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in saving Vehicle'}`);

        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }
    }
}


export async function getAllVendors() {
    try {
        const response = await axios.get(`${API_BASE_URL}${apiPrefix}/dealer/get-all-vendors`);
        return response.data; // Handle response (e.g., token, user data)
    } catch (error: any) {
        console.error('Get-All-Vendors error', error);
        throw error.response?.data || 'Error in getting all vendors';
    }
}

export async function apiNewVendor (data:any){
    try{
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/add-new-vendor`,data);
        return response.data;
    }
    catch(error:any){
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in saving Vendor'}`);

        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}


export async function apiAddNewVehicle (data:any){
    try{
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/add-new-vehicle`,data);
        return response.data;
    }
    catch(error:any){
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in saving Vehicle'}`);

        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}

export async function apiGetVehicleByVin(query: string) {
    try {
        const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${query}?format=json`);
        return response.data; // Handle response (e.g., token, user data)
    } catch (error: any) {
        console.error('Get-Vehicle-By-VIN error', error);
        throw error.response?.data || 'Error in getting vehicle by VIN';
    }
}
// export const apiSaveCustomer = async (data:any) => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve({ message: 'Customer saved successfully' });
//         }, 1000); // Simulate a network delay
//     });
// };

export async function apiAddNewAppointment (data:any){
    try{
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/add-new-appointment`,data);
        console.log("Response for appointment in api ; ", response)
        return response.data;
    }
    catch(error:any){
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in saving Vehicle'}`);

        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}

export async function apiGetAllAppointment() {
    try {
        const response = await axios.get(`${API_BASE_URL}${apiPrefix}/dealer/get-all-appointment`);
        return response.data; 
    } catch (error: any) {
        console.error('Get-All-Vehicles error', error);
        throw error.response?.data || 'Error in getting all vehicles';
    }
}

export async function apiUpdateAppointment(id: string, data: any) {
    try {
      const response = await axios.put(`${API_BASE_URL}${apiPrefix}/dealer/update-appointment/${id}`, data);
      console.log("Response for updated appointment in API: ", response);
      return response.data;
    } catch (error: any) {
      console.log(error);
      
    }
  }
  
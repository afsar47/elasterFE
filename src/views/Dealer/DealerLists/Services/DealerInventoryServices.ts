import axios from "axios";
import appConfig from "@/configs/app.config";
import { error } from "console";
// Set the base URL to point to your backend API
const API_BASE_URL = 'http://localhost:1024'; 
// const API_BASE_URL = 'https://api.247automotive.services'; // Assuming backend is running on localhost:1024
const { apiPrefix } = appConfig; // If you have an API prefix like '/api'


export async function getAllPartsByPage(filterData: any) {
    try {
        const response: any = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/get-all-parts-pagination`, filterData);
        return response; // Handle response (e.g., token, user data)
    } catch (error: any) {
        console.error('Get-All-Parts error', error);
        throw error.response?.data || 'Error in getting all parts';
    }
}
export async function getAllTiresByPage(filters: any) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/get-all-tires-pagination`, {
            params: filters,
        });
        return response.data; 
    } catch (error: any) {
        console.error('Get-All-tires error', error);
        throw error.response?.data || 'Error in getting all tires';
    }
}

export async function getAllTires(){
    try{
        const response = await axios.get(`${API_BASE_URL}${apiPrefix}/dealer/get-all-tires`);
        return response;
    } catch(error:any){
        console.error('Get-All-Tires error', error);
        throw error.response?.data || "Error in getting all Tires"
    }
}

export async function getAllParts(){
    try{
        const response = await axios.get(`${API_BASE_URL}${apiPrefix}/dealer/get-all-parts`);
        return response;
    } catch(error:any){
        console.error('Get-All-Parts error', error);
        throw error.response?.data || "Error in getting all Parts"
    }
}

export async function getAllFees(filterData: any) {
    try {
        const response: any = await axios.get(`${API_BASE_URL}${apiPrefix}/dealer/get-all-fees`, filterData);
        return response; // Handle response (e.g., token, user data)
    } catch (error: any) {
        console.error('Get-All-Dealers error', error);
        throw error.response?.data || 'Error in getting all dealers';
    }
}

export async function apiNewPart(data: any) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/add-new-part`, data);
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in saving Part'}`);

        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}
export async function apiNewTire(data: any) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/add-new-tire`, data);
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in saving Tire'}`);

        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}

export async function apiGetAllBrand() {
    try {
        const response = await axios.get(`${API_BASE_URL}${apiPrefix}/dealer/get-all-brands`);
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in saving Brand'}`);

        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}

export async function apiGetAllVendor() {
    try {
        const response = await axios.get(`${API_BASE_URL}${apiPrefix}/dealer/get-all-vendors`);
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in getting Vendors'}`);

        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}

export async function apiAddNewBrand(data: any) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/add-new-brand`, data);
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in saving Brand'}`);

        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}

export async function apiAddNewCategory(data: any) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/add-new-category`, data);
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in saving Category'}`);

        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}


export async function apiGetAllCategtories() {
    try {
        const response = await axios.get(`${API_BASE_URL}${apiPrefix}/dealer/get-all-categories`);
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in getting Categories'}`);

        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}

export async function apiAddNewFee(data: any) {
    try {
        console.log('Request Payload:', data);
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/add-new-fee`, data);
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in saving Fee'}`);

        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}

export async function apiUpdateFee(data: any, id: string) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/update-fee/${id}`, data);
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in saving Fee'}`);

        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}


export async function apiUpdatePart(data: any, id: string) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/update-part/${id}`, data);
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in saving part'}`);

        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}

export async function apiDeleteFee(id: string) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/delete-fee/${id}`);
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in deleting Fee'}`);

        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}

export async function apiDeletePart(id: string) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/delete-part/${id}`);
        console.log("Response for delete part : ", response)
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in deleting part'}`);
        } else if (error.request) {
            
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}

export async function apiDeleteTire(id: string) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/delete-tire/${id}`);
        console.log("Response for delete Tire : ", response)
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in deleting tire'}`);
        } else if (error.request) {
            
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}

export async function apiDeleteVendor(id: string) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/delete-vendor/${id}`);
        console.log("Response for delete Vendor : ", response)
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in deleting part'}`);
        } else if (error.request) {
            
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}


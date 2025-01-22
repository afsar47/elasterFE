import axios from 'axios';
import appConfig from '@/configs/app.config'; // Assuming you have this config for API prefix

// Set the base URL to point to your backend API
const API_BASE_URL = 'http://localhost:1024'; // Replace with your backend URL
// const API_BASE_URL = 'https://api.247automotive.services'; // Assuming backend is running on localhost:8080
const { apiPrefix } = appConfig; // If you have an API prefix like '/api'

// Get All Estimates API Call
export async function getAllEstimatesByPage(params: any) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/workflow/all-estimates-by-page`, params);
        return response.data; // Handle response (e.g., token, user data)
    } catch (error: any) {
        console.error('Get-All-Estimates error', error);
        throw error.response?.data || 'Error in getting all dealers';
    }
}


export async function getAllEstimates() {
    try {
        const response = await axios.get(`${API_BASE_URL}${apiPrefix}/dealer/workflow/all-estimates`);
        return response.data; // Handle response (e.g., token, user data)
    } catch (error: any) {
        console.error('Get-All-Estimates error', error);
        throw error.response?.data || 'Error in getting all dealers';
    }
}


// Get All Estimates API Call
export async function getAllCountAccToStatus() {
    try {
        const response = await axios.get(`${API_BASE_URL}${apiPrefix}/dealer/workflow/get-all-counts`);
        return response.data; // Handle response (e.g., token, user data)
    } catch (error: any) {
        console.error('Get-All-Estimates error', error);
        throw error.response?.data || 'Error in getting all dealers';
    }
}


export async function apiAddNewEstimate(data: any) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/workflow/add-new-estimate`, data);
        //  
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in creating new Estimate'}`);

        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}

export async function apiUpdateEstimate(data: any, estimateId: any) {
    try {
        const response = await axios.put(`${API_BASE_URL}${apiPrefix}/dealer/workflow/update-estimate/${estimateId}`, data);
        //  
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in creating new Estimate'}`);

        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}

export async function getEstimateById(id: string) {
    try {
        const response = await axios.get(`${API_BASE_URL}${apiPrefix}/dealer/workflow/get-estimate/${id}`);
        return response.data; // Handle response (e.g., token, user data)
    } catch (error: any) {
        console.error('Get-All-Estimates error', error);
        throw error.response?.data || 'Error in getting all dealers';
    }
}



export async function apiSendEstimateEmail(data: any) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/workflow/send-estimate-mail`, data);
        //  
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in sending estimate email.'}`);

        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}


export async function apiUpdateEstimateStatus(estimateId: string, status: string,) {
    try {
        const response = await axios.put(`${API_BASE_URL}${apiPrefix}/dealer/workflow/update-order-status/${estimateId}`, { status: status });
        //  
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in creating new Estimate'}`);

        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}


export async function apiUpdateCompleteEstimateDate(estimateId: string, payload: any) {
    try {
        const response = await axios.put(`${API_BASE_URL}${apiPrefix}/dealer/workflow/update-estimate-dates/${estimateId}`, payload);
        //  
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            throw new Error(`Server Error: ${error.response.data.message || 'Error in updating estimate complete date'}`);
        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {

            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}

export async function apiSaveSignatureImage(data: any) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/workflow/service-authorization`, data);
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            // Server responded with an error status
            throw new Error(
                `Server Error: ${error.response.data.message || 'Failed to save signature image'}`
            );
        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}





export async function apiRecordPayment(data: any) {
    try {
        const response = await axios.post(`${API_BASE_URL}${apiPrefix}/dealer/workflow/record-payment`, data);
        return response.data;
    }
    catch (error: any) {
        if (error.response) {
            // Server responded with an error status
            throw new Error(
                `Server Error: ${error.response.data.message || 'Failed to record payment'}`
            );
        } else if (error.request) {
            // No response was received from the server
            throw new Error('Network Error: Unable to reach the server');
        } else {
            // Some other error
            throw new Error('Unexpected Error: ' + error.message);
        }

    }
}

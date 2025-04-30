import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const planTrip = async (tripData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/plan-trip/`, tripData);
    return response.data;
  } catch (error) {
    console.error('Error planning trip:', error);
    throw error;
  }
};

export const downloadLog = async (logId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/download-log/${logId}/`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error('Error downloading log:', error);
    throw error;
  }
};
import api from './api';

// Get all photos — uses our authenticated Axios instance
export const getPhotos = async () => {
  const response = await api.get('/photos');
  return response.data.data;
};
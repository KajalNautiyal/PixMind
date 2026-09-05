import axios from "axios";

const API = "http://localhost:5000/api/v1/photos";

// Get all photos
export const getPhotos = async () => {
  const response = await axios.get(API);
  return response.data.data;
};
import axios from "axios";

export default async function fetchMeldingen() {
  try {
    const response = await axios.get(process.env.EXPO_PUBLIC_API_URL, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Connection' : 'keep-alive'
      }
    });
    console.log("Data fetched successfully:", response.data);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Rethrow the error to handle it in the caller
  }
}



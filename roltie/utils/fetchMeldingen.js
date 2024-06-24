import { API_PROTOCOL, API_HOST, API_PORT } from "@env";

export default async function fetchMeldingen() {
  try {
    const apiUrl = `${API_PROTOCOL}://${API_HOST}:${API_PORT}/roltie/station`;

    console.log("API URL:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });
    console.log("Data fetched successfully:", response);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
}

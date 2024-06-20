export default async function fetchMeldingen() {
  try {
    const apiUrl = "http://145.137.110.59:8085/roltie/meldingen";
    console.log("API URL:", apiUrl);

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 10000
    });
    console.log("Data fetched successfully:", response);
    return response.data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
}


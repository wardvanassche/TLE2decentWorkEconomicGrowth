import axios from "axios";

export default async function fetchMeldingen() {
  try {
    // Gebruik het IP-adres van je computer als je een mobiele emulator gebruikt
    // const apiUrl = "http://145.137.109.147:8085/roltie/meldingen"; // Vervang 192.168.1.100 met het IP-adres van je computer
    const apiUrl = "http://145.137.109.147:8085/roltie/meldingen"; // Vervang 192.168.1.100 met het IP-adres van je computer
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


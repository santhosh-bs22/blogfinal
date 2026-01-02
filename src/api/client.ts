// Get the base URL from Vite environment, ensuring we don't double-slash
const BASE_URL = import.meta.env.BASE_URL.endsWith('/') 
  ? import.meta.env.BASE_URL.slice(0, -1) 
  : import.meta.env.BASE_URL

const API_BASE_URL = `${BASE_URL}/mock-api`

export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}/${endpoint}`
    console.log(`Fetching: ${url}`) // Debugging: Check console to see the actual URL being fetched
    
    const response = await fetch(url)
    
    // Check if the response is actually JSON before parsing
    const contentType = response.headers.get("content-type");
    if (contentType && !contentType.includes("application/json")) {
      console.error("Received non-JSON response from:", url);
      throw new Error("API returned HTML instead of JSON. Check your base path configuration.");
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  }
}
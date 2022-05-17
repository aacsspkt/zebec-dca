import axios from "axios";

export async function fetchTokenLists() {
    const response = await axios.get("https://api.raydium.io/v2/sdk/token/raydium.mainnet.json");
    if (response.data.official) {
        return response.data.official;
    }
    return [];
}

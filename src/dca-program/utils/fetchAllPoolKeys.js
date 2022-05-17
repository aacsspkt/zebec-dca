import axios from "axios";


export async function fetchAllPoolKeys() {
    const response = await axios.get("https://api.raydium.io/v2/sdk/liquidity/mainnet.json");
    if (response.data.official) {
        return response.data.official;
    }
    return [];
}
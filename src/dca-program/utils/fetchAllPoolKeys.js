import axios from "axios";

export const fetchAllPoolKeys = async () => {
    try {
        const response = await axios.get("https://api.raydium.io/v2/sdk/liquidity/mainnet.json");
        let poolKeysList = [...(response.data.official ?? []), ...(response.data.unOfficial ?? [])];
        return poolKeysList;
    } catch (err) {
        return [];
    }
}   
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js"
import { getMintInfo } from "../../utils";

describe("Testing Mint Info", () => {
    test("should match", async () => {
        const expectedMintAuthority = new PublicKey("Fx1bCAyYpLMPVAjfq1pxbqKKkvDR3iYEpam1KbThRDYQ");
        const expectedDecimal = 6;

        const reality = await getMintInfo(new Connection(clusterApiUrl("devnet")), new PublicKey("8FRFC6MoGGkMFQwngccyu69VnYbzykGeez7ignHVAFSN"));
        expect(reality.mintAuthority).toEqual(expectedMintAuthority);
        expect(reality.decimals).toEqual(expectedDecimal);
    });

});
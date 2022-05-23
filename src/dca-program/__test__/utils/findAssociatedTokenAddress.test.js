import { PublicKey } from "@solana/web3.js";
import { findAssociatedTokenAddress } from "../../utils";

test("find associated token address test", async () => {
    const pubkey1 = new PublicKey("B4mrP9hMMLBWKrB467wWUmHNYStZkuDXxiXYPn5emsuM");
    const pubkey2 = new PublicKey("GCMt7FsZq5EkkdiCmVk97ZHSTgbrvZNnZSjzarpV5faH");
    const expected = new PublicKey("C51gTJU2fNz8VzAw9Xpv5ZtFoCSPuiExhWgwn5vEpNkm");
    const [actual] = await findAssociatedTokenAddress(pubkey1, pubkey2);
    expect(actual).toEqual(expected);
});
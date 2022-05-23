const { PublicKey } = require("@solana/web3.js");
const { findDcaDerivedAddress } = require("../../utils");

test("find dca derived address test", async () => {
    const pubkey1 = new PublicKey("8wFNccoRA12vLJ2JcRSc4PXFnYjUCGsVRkUGFUYBDk3P");
    const pubkey2 = new PublicKey("AqP5WP8QzYy1YV6gEwACevuBNZJv7SbaW3vsb3mupH6a");
    const expected = new PublicKey("31kuJfEmfkEgPWxhQACUnfj2MYvg3GGcLwVD5vnmP5nU");
    const [actual] = await findDcaDerivedAddress([pubkey1.toBuffer(), pubkey2.toBuffer()]);
    expect(actual).toEqual(expected);
});
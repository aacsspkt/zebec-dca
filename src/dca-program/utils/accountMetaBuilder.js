import { PublicKey } from "@solana/web3.js";

/**
 * The class for creating account metas
 */
export class AccountMetaBuilder {
    /**
     * Create an writable account meta.
     * 
     * @param {PublicKey} address The public key address of the account
     * @param {boolean} isSigner The boolean for specifying whether the account is signer or not 
     * @return Account Meta
     */
    static writable(address, isSigner) {
        if (!(address instanceof PublicKey) && typeof isSigner != "boolean") {
            throw new TypeError("Invalid argument type.");
        }
        return {
            pubkey: address,
            isSigner: isSigner,
            isWritable: true
        };
    }

    /**
     * Create an readonly account meta.
     * 
     * @param {PublicKey} address The public key address of the account
     * @param {boolean} isSigner The boolean for specifying whether the account is signer or not 
     * @return {AccountMeta} Account Meta
     */
    static readonly(address, isSigner) {
        if (!(address instanceof PublicKey) && typeof isSigner != "boolean") {
            throw new TypeError("Invalid argument type.");
        }
        return {
            pubkey: address,
            isSigner: isSigner,
            isWritable: false
        }
    }
}
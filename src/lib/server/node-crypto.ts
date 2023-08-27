import {
    randomBytes,
    createCipheriv,
    createDecipheriv,
} from 'crypto';


export const AES = {
    cipherType: 'aes-256-gcm',
    ivSize: 12,
    authTagSize: 16,
} as const;

/**
 * Performs AES-GCM decryption on the cryptogram 
 *
 * @param symmetricKey AES key
 * @param cryptogram Data to decrypt
 */
export async function aesGcmDecrypt(symmetricKey: Uint8Array, cryptogram: Uint8Array): Promise<Uint8Array> {
    const nonce = cryptogram.subarray(0, AES.ivSize);
    const tag = cryptogram.subarray(cryptogram.length - AES.authTagSize);
    const ciphered = cryptogram.subarray(AES.ivSize, cryptogram.length - AES.authTagSize);
    const decipher = createDecipheriv(AES.cipherType, symmetricKey, nonce);
    decipher.setAuthTag(tag);

    return uint8ArrayConcat(decipher.update(ciphered), decipher.final());
}

/**
 * Performs AES-GCM encryption and returns a cryptogram
 *
 * @param symmetricKey AES key
 * @param plainText Data to encrypt
 */
export async function aesGcmEncrypt(symmetricKey: Uint8Array, plainText: Uint8Array): Promise<Uint8Array> {
    const nonce = await generateRandomBytes(AES.ivSize);
    const cipher = createCipheriv(AES.cipherType, symmetricKey, nonce);
    const encrypted = uint8ArrayConcat(cipher.update(plainText), cipher.final());
    const tag = cipher.getAuthTag();

    return uint8ArrayConcat(nonce, encrypted, tag);
}


/**
 * Generates cryptographically secure random bytes
 *
 * @param byteCount number of bytes to generate
 * @returns random bytes
 */
export async function generateRandomBytes(byteCount: number): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
        randomBytes(byteCount, (err, buf) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(buf);
            }
        });
    });
}


/**
* Concatenates multiple Uint8Arrays into one
*
* @param arrays Uint8Arrays to concatenate
* @returns A new Uint8Array with the concatenated data
*/
export function uint8ArrayConcat(...arrays: Uint8Array[]): Uint8Array {
    const size = arrays.reduce((pv, cv) => pv += cv.length, 0);
    const newArray = new Uint8Array(size);
    let offset = 0;

    for (const array of arrays) {
        newArray.set(array, offset);
        offset += array.length;
    }

    return newArray;
}
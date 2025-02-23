import {type KeyPair, PrivateKey, PublicKey} from "paillier-bigint";

export class UserPaillierSecret {
    Id: number;
    UserId: number;
    PublicKeyN: bigint;
    PublicKeyG: bigint;
    PrivateKeyLambda: bigint;
    PrivateKeyMu: bigint;

    constructor(keyPair?: KeyPair) {
        if (keyPair !== undefined) {
            this.Id = 0;
            this.UserId = 0;
            this.PublicKeyN = keyPair.publicKey.n;
            this.PublicKeyG = keyPair.publicKey.g;
            this.PrivateKeyLambda = keyPair.privateKey.lambda;
            this.PrivateKeyMu = keyPair.privateKey.mu;
        } else {
            this.Id = 0;
            this.UserId = 0;
            this.PublicKeyN = 0n;
            this.PublicKeyG = 0n;
            this.PrivateKeyLambda = 0n;
            this.PrivateKeyMu = 0n;
        }
    }

    KeyPair(): KeyPair {
        let publicKey = new PublicKey(BigInt(this.PublicKeyN), BigInt(this.PublicKeyG));
        return {
            publicKey: publicKey,
            privateKey: new PrivateKey(BigInt(this.PrivateKeyLambda), BigInt(this.PrivateKeyMu), publicKey)
        };
    }
}
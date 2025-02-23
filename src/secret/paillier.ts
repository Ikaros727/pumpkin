import * as paillier from "paillier-bigint"

const GeneratePaillierKeys = async (bitLength = 3072): Promise<paillier.KeyPair> => {
    return await paillier.generateRandomKeys(bitLength)
}
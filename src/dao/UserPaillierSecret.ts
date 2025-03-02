import {Database} from "sql.js";
import {
    SQLCreateDatabaseUserPaillierSecret,
    SQLInsertUserPaillierSecret
} from "./sql.ts";
import {UserPaillierSecret} from "./model/UserPaillierSecret.ts";
import {Store} from "./db.ts";

export class UserPaillierSecretModel {
    private readonly db: typeof Database;

    constructor(db: typeof Database) {
        this.db = db;
        console.log("Initializing database...", SQLCreateDatabaseUserPaillierSecret);
        this.db.run(SQLCreateDatabaseUserPaillierSecret);
    }

    Get(userId: number): Promise<UserPaillierSecret | null> {
        return new Promise((resolve, reject) => {
            try {
                const sql = "SELECT * FROM UserPaillierSecret WHERE UserId = ?";
                let secret = new UserPaillierSecret();

                let res = this.db.exec(sql, [userId]);
                if (res.length === 0 || res[0].values === 0) {
                    resolve(null);
                    return;
                }

                let cols = res[0].columns;
                let values = res[0].values;
                for (let i = 0; i < values[0].length; i++) {
                    secret[cols[i]] = values[0][i];
                }

                resolve(secret);
            } catch (e) {
                reject(e);
            }
        });
    }

    Create(secret: UserPaillierSecret): Promise<UserPaillierSecret> {
        return new Promise(async (resolve, reject) => {
            try {
                this.db.exec(SQLInsertUserPaillierSecret, [
                    secret.UserId,
                    secret.PublicKeyN,
                    secret.PublicKeyG,
                    secret.PrivateKeyLambda,
                    secret.PrivateKeyMu
                ]);

                const res = this.db.run("SELECT last_insert_rowid()");
                secret.Id = res[0]?.values[0][0];
                await Store(this.db)
                resolve(secret);
            } catch (e) {
                reject(e);
            }
        });
    }
}
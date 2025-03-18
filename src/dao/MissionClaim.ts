import {Database} from "sql.js";
import {MissionClaimCreateDatabaseSQL, MissionClaimInsertSQL} from "./sql.ts";
import {Store} from "./db.ts";
import {MissionClaim} from "./model/MissionClaim.ts";

export class MissionClaimModel {
    private readonly db: typeof Database;

    constructor(db: typeof Database) {
        this.db = db;
        console.log("Initializing database...", MissionClaimCreateDatabaseSQL);
        this.db.run(MissionClaimCreateDatabaseSQL);
    }

    Create(mc: MissionClaim): Promise<MissionClaim> {
        return new Promise(async (resolve, reject) => {
            try {
                mc.CreateTime = Date.now();
                this.db.run(MissionClaimInsertSQL, [
                    mc.UserId,
                    mc.MissionId,
                    mc.CreateTime,
                ]);

                const res = this.db.run("SELECT last_insert_rowid()");
                mc.Id = res[0]?.values[0][0];
                await Store(this.db);
                resolve(mc);
            } catch (e) {
                reject(e);
            }
        });
    }
}
import {Database} from "sql.js";
import {MissionCarData} from "./model/MissionCarData.ts";
import {SQLCreateDatabaseMissionCarData, SQLInsertDatabaseMissionCarData} from "./sql.ts";
import {Store} from "./db.ts";

export class MissionCarDataModel {
    private readonly db: typeof Database

    constructor(db: typeof Database) {
        this.db = db;
        console.log("Initializing database...", SQLCreateDatabaseMissionCarData);
        this.db.run(SQLCreateDatabaseMissionCarData);
    }

    Query(): Promise<MissionCarData[]> {
        return new Promise((resolve, reject) => {
            try {

            } catch (e) {
                reject(e);
            }
        })
    }

    Create(data: MissionCarData): Promise<MissionCarData> {
        return new Promise(async (resolve, reject) => {
            try {
                this.db.run(SQLInsertDatabaseMissionCarData, [
                    data.MissionId,
                    data.CarId,
                    data.CarName,
                    data.Area,
                    JSON.stringify(data.DataItemList),
                ]);

                const res = this.db.run("SELECT last_insert_rowid()");
                data.Id = res[0]?.values[0][0];
                await Store(this.db)
                resolve(data);
            } catch (e) {
                reject(e);
            }
        });
    }
}
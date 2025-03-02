import {Database} from "sql.js";
import {
    SQLCreateDatabaseMission, SQLDeleteMission,
    SQLInsertMission
} from "./sql.ts";
import {Mission} from "./model/Mission.ts";
import {Store} from "./db.ts";

export type MissionFilter = {
    UserId: number;
}

export class MissionModel {
    private readonly db: typeof Database;

    constructor(db: typeof Database) {
        this.db = db;
        console.log("Initializing database...", SQLCreateDatabaseMission);
        this.db.run(SQLCreateDatabaseMission);
    }

    Query(filter: MissionFilter): Promise<Mission[]> {
        return new Promise((resolve, reject) => {
            try {
                let sql = "SELECT * FROM mission";
                let missions: Mission[] = [];
                let whereConditions: string[] = [];
                let args = [];

                if (filter.UserId > 0) {
                    whereConditions.push("UserId = ?");
                    args.push(filter.UserId);
                }

                if (whereConditions.length > 0) {
                    sql += " WHERE " + whereConditions.join(" AND ");
                }

                let res = this.db.exec(sql, args);
                if (res.length > 0) {
                    let cols = res[0].columns;
                    let values = res[0].values;
                    for (let i = 0; i < values.length; i++) {
                        let mission = new Mission();
                        for (let j = 0; j < values[i].length; j++) {
                            parseMission(mission, cols[j], values[i][j]);
                        }
                        missions.push(mission);
                    }
                }

                resolve(missions);
            } catch (e) {
                reject(e);
            }
        });
    }

    Create(mission: Mission): Promise<Mission> {
        return new Promise(async (resolve, reject) => {
            try {
                this.db.run(SQLInsertMission, [
                    mission.UserId,
                    mission.Name,
                    JSON.stringify(mission.AreaList),
                    JSON.stringify(mission.DataTypeList),
                    mission.StartTime,
                    mission.EndTime,
                    mission.IsEncrypted,
                    mission.Reward
                ]);

                const res = this.db.run("SELECT last_insert_rowid()");
                mission.Id = res[0]?.values[0][0];
                await Store(this.db);
                resolve(mission);
            } catch (e) {
                reject(e);
            }
        });
    }

    Delete(id: number): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                this.db.run(SQLDeleteMission, [id]);
                await Store(this.db)
                resolve()
            } catch (e) {
                reject(e);
            }
        });
    }
}

function parseMission(mission: Mission, col: string, raw: any) {
    switch (col) {
        case "AreaList":
        case "DataTypeList":
            mission[col] = JSON.parse(raw);
            return;
        default:
            mission[col] = raw;
    }
}
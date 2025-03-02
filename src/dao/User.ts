import {Database} from "sql.js";
import {
    SQLCreateDatabaseUser, SQLInsertUser,
} from "./sql.ts";
import {User} from "./model/User.ts";
import {Store} from "./db.ts";

export type UserFilter = {
    Username: string; // 用户名 - 登陆用
    Password: string; // 密码(md5)
}

export class UserModel {
    private readonly db: typeof Database;

    constructor(db: typeof Database) {
        this.db = db;
        console.log("Initializing database...", SQLCreateDatabaseUser);
        this.db.run(SQLCreateDatabaseUser);
    }

    Get(filter: UserFilter): Promise<User | null> {
        return new Promise((resolve, reject) => {
            try {
                let sql = "SELECT * FROM User";
                let user = new User();


                let wheres = []
                let args = []
                if (filter.Username !== "") {
                    wheres.push("Username = ?");
                    args.push(filter.Username);
                }
                if (filter.Password !== "") {
                    wheres.push("Password = ?");
                    args.push(filter.Password);
                }
                if (wheres.length > 0) {
                    sql += " WHERE " + wheres.join(" AND ");
                }

                let res = this.db.exec(sql, args);
                if (res.length === 0 || res[0].values === 0) {
                    resolve(null);
                    return;
                }

                let cols = res[0].columns;
                let values = res[0].values;
                for (let i = 0; i < values[0].length; i++) {
                    user[cols[i]] = values[0][i];
                }

                resolve(user);
            } catch (e) {
                reject(e);
            }
        });
    }

    Create(u: User): Promise<User> {
        return new Promise(async (resolve, reject) => {
            try {
                this.db.exec(SQLInsertUser, [
                    u.Username,
                    u.Nickname,
                    u.Email,
                    u.Mobile,
                    u.Password,
                    u.Avatar,
                ]);

                const res = this.db.run("SELECT last_insert_rowid()");
                u.Id = res[0]?.values[0][0];
                await Store(this.db)
                resolve(u);
            } catch (e) {
                reject(e);
            }
        });
    }
}
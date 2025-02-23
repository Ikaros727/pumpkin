import initSqlJs, {Database} from "sql.js"
import {openDB} from "idb";

const DB_NAME = "SQLite";
const STORE_NAME = "database";
const QUERY = "sqljs_db"
const store = await openDB(DB_NAME, 1, {
    upgrade(db) {
        db.createObjectStore(STORE_NAME)
    },
})

export async function Open(): Promise<typeof Database> {
    const idbData = await store.get(STORE_NAME, QUERY)
    return new Promise((resolve, reject) => {
        initSqlJs().then(SQL => {
            let db = new SQL.Database(idbData || undefined)
            resolve(db)
        }).catch(e => {
            reject(e)
        })
    })
}

export async function Store(db: typeof Database) {
    const data = db.export();
    await store.put(STORE_NAME, data, QUERY);
}
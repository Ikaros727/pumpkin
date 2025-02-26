export const SQLCreateDatabaseUser =
    `CREATE TABLE IF NOT EXISTS User (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        Username TEXT NOT NULL UNIQUE,
        Nickname TEXT NOT NULL,
        Password TEXT NOT NULL,
        Avatar TEXT NOT NULL,
     );`

export const SQLInsertUser =
    `INSERT INTO User (Username, Nickname, Password, Avatar) VALUES (?, ?, ?, ?);`

export const SQLCreateDatabaseMission =
    `CREATE TABLE IF NOT EXISTS Mission (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        UserId INTEGER NOT NULL DEFAULT '0',
        Name TEXT NOT NULL UNIQUE,
        AreaList TEXT NOT NULL,
        DataTypeList TEXT NOT NULL,
        StartTime INTEGER NOT NULL,
        EndTime INTEGER NOT NULL,
        IsEncrypted NUMERIC NOT NULL DEFAULT '1',
        Reward INTERGER NOT NULL DEFAULT '0'
    );`

export const SQLInsertMission =
    `INSERT INTO Mission (UserId, Name, AreaList, DataTypeList, StartTime, EndTime, IsEncrypted, Reward)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);`

export const SQLCreateDatabaseUserPaillierSecret =
    `CREATE TABLE IF NOT EXISTS UserPaillierSecret (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        UserId INTEGER NOT NULL DEFAULT '0',
        PublicKeyN TEXT NOT NULL,
        PublicKeyG TEXT NOT NULL,
        PrivateKeyLambda TEXT NOT NULL,
        PrivateKeyMu TEXT NOT NULL
    );`

export const SQLInsertUserPaillierSecret =
    `INSERT INTO UserPaillierSecret (UserId, PublicKeyN, PublicKeyG, PrivateKeyLambda, PrivateKeyMu)
        VALUES (?, ?, ?, ?, ?);`

export const SQLCreateDatabaseMissionCarData =
    `CREATE TABLE IF NOT EXISTS MissionCarData (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        MissionId INTEGER NOT NULL DEFAULT '0',
        CarId INTEGER NOT NULL DEFAULT '0',
        CarName TEXT NOT NULL DEFAULT '',
        Area TEXT NOT NULL,
        DataItemList INTEGER NOT NULL DEFAULT '0'
     );`

export const SQLInsertDatabaseMissionCarData =
    `INSERT INTO MissionCarData (MissionId, CarId, CarName, Area, DataItemList)
        VALUES (?, ?, ?, ?, ?);`
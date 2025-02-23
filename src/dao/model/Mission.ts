export const MissionStatusPending = "Pending";
export const MissionStatusInProgress = "InProgress";
export const MissionStatusCompleted = "Completed";

export class Mission {
    Id: number;
    UserId: number;
    Name: string;
    AreaList: string[];
    DataTypeList: string[];
    StartTime: number;
    EndTime: number;
    IsEncrypted: boolean;
    Reward: number;

    constructor(m?: Mission) {
        if (m === undefined) {
            this.Id = 0;
            this.UserId = 0;
            this.Name = "";
            this.AreaList = [];
            this.DataTypeList = [];
            this.StartTime = Date.now();
            this.EndTime = Date.now();
            this.IsEncrypted = false;
            this.Reward = 0;
        } else {
            this.Id = m.Id;
            this.UserId = m.UserId;
            this.Name = m.Name;
            this.AreaList = m.AreaList;
            this.DataTypeList = m.DataTypeList;
            this.StartTime = m.StartTime;
            this.EndTime = m.EndTime;
            this.IsEncrypted = m.IsEncrypted;
            this.Reward = m.Reward;
        }
    }

    AreaListString(): string {
        return this.AreaList.join("\n");
    }

    DataTypeListString(): string {
        return this.DataTypeList.join(" | ");
    }

    Status(): string {
        let now = Date.now();
        if (now < this.StartTime) {
            return MissionStatusPending;
        } else if (now <= this.EndTime) {
            return MissionStatusInProgress;
        } else {
            return MissionStatusInProgress;
        }
    }

    StatusCN(): string {
        switch (this.Status()) {
            case MissionStatusPending:
                return "待开始";
            case MissionStatusInProgress:
                return "进行中";
            case MissionStatusCompleted:
                return "已结束";
            default:
                return "未知";
        }
    }

    TimeRangeString(): string {
        let start = new Date(this.StartTime);
        let end = new Date(this.EndTime);
        let startStr = `${start.getFullYear()}/${start.getMonth() + 1}/${start.getDate()}`;
        let endStr = `${end.getFullYear()}/${end.getMonth() + 1}/${end.getDate()}`;
        return `${startStr} - ${endStr}`;
    }
}

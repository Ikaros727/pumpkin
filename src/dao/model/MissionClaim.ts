export class MissionClaim {
    Id: number;
    UserId: number;     // 用户ID
    MissionId: number;  // 任务ID
    CreateTime: number  // 接取时间

    constructor(mc?: MissionClaim) {
        this.Id = mc?.Id ?? 0;
        this.UserId = mc?.UserId ?? 0;
        this.MissionId = mc?.MissionId ?? 0;
        this.CreateTime = mc?.CreateTime ?? 0;
    }
}
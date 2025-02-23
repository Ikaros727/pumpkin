export type DataItem = {
    Type: string,
    Value: BigInt,
}

export class MissionCarData {
    Id: number;
    MissionId: number; // 任务ID
    CarId: number; // 提交数据车辆ID
    CarName: string; // 提交数据车辆名称
    Area: string; // 区域
    DataItemList: DataItem[]; // 数据值

    constructor(data?: MissionCarData) {
        this.Id = data?.Id ?? 0;
        this.MissionId = data?.MissionId ?? 0;
        this.CarId = data?.CarId ?? 0;
        this.CarName = data?.CarName ?? "";
        this.Area = data?.Area ?? "";
        this.DataItemList = data?.DataItemList ?? [];
    }
}
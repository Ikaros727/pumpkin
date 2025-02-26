export class User {
    Id: number;
    Username: string; // 用户名 - 登陆用
    Nickname: string; // 昵称 - 展示用
    Password: string; // 密码(md5)
    Avatar: string; // 头像

    constructor(u?:User) {
        this.Id = u?.Id ?? 0
        this.Username = u?.Username ?? ""
        this.Nickname = u?.Nickname ?? ""
        this.Password = u?.Password ?? ""
        this.Avatar = u?.Avatar ?? ""
    }
}
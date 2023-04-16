export interface IUser{
    username: string,
    roleName: Roles
}

export enum Roles {
    Admin = "admin",
    User = "user"
}
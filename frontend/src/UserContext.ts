import React from "react";
import { IUser } from "./interfaces/IUser";

interface IUserContext{
    user: IUser | undefined,
    handleSetUser: (user: IUser| null) => void
}

export const UserContext = React.createContext<IUserContext>({} as IUserContext);
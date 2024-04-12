import { createContext, useState } from "react"
import React from "react"
import { User } from "../types/server/class"

interface UserContextValue {
    user: User | null
    setUser: React.Dispatch<React.SetStateAction<User | null>>
}

interface UserProviderProps {
    children: React.ReactNode
}

const UserContext = createContext<UserContextValue>({} as UserContextValue)

export default UserContext

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

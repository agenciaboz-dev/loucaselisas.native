import { useContext } from "react"
import UserContext from "../contexts/userContext"
import { User } from "../types/server/class"

export const useUser = () => {
    const context = useContext(UserContext)

    const onLogin = (user: User) => {
        context.setUser(user)
    }

    return { ...context }
}

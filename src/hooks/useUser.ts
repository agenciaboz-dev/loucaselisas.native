import { useContext } from "react"
import UserContext from "../contexts/userContext"
import { User } from "../types/server/class"
import { useNavigation } from "@react-navigation/native"

export const useUser = () => {
    const context = useContext(UserContext)
    const navigation = useNavigation<any>()

    const onLogin = (user: User) => {
        context.setUser(user)
        navigation.navigate("mainscreen")

        console.log(JSON.stringify(user, null, 4))
    }

    const logout = () => {
        navigation.navigate("home")
        context.setUser(null)
    }

    return { ...context, onLogin, logout }
}

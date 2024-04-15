import { useContext } from "react"
import UserContext from "../contexts/userContext"
import { User } from "../types/server/class"
import { useNavigation } from "@react-navigation/native"
import { api } from "../backend/api"

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

    const refresh = async () => {
        try {
            const response = await api.get("/user", { params: { id: context.user?.id } })
            context.setUser(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    return { ...context, onLogin, logout, refresh }
}

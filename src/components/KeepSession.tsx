import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useEffect } from "react"
import { User } from "../types/server/class"
import { api } from "../backend/api"
import { useSnackbar } from "../hooks/useSnackbar"

interface keepSessionProps {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const KeepSession: React.FC<keepSessionProps> = ({ setLoading }) => {
    const { snackbar } = useSnackbar()

    const handleSession = async () => {
        const keepSession = JSON.parse((await AsyncStorage.getItem("stay_connected")) || "false")
        if (keepSession) {
            const stored_session = await AsyncStorage.getItem("session")
            if (stored_session) {
                setLoading(true)
                const session = JSON.parse(stored_session) as User

                try {
                    const response = await api.post("/login/keep_session", session)
                    const user = response.data
                    if (user) {
                        snackbar("logado")
                    } else {
                        snackbar("Não foi possível recuperar a sessão. Faça o login novamente")
                    }
                } catch (error) {
                    console.log(error)
                    snackbar("Não foi possível recuperar a sessão. Faça o login novamente")
                } finally {
                    setLoading(false)
                }
            }
        }
    }
    useEffect(() => {
        handleSession()
    }, [])

    return null
}

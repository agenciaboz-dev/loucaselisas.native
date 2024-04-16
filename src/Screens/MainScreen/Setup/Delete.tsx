import React, { useState } from "react"
import { Surface, Text, useTheme } from "react-native-paper"
import { View } from "react-native"
import { Button } from "../../../components/Button"
import { NavigationProp } from "@react-navigation/native"
import { api } from "../../../backend/api"
import { useUser } from "../../../hooks/useUser"
import { useSnackbar } from "../../../hooks/useSnackbar"

interface DeleteProps {
    navigation: NavigationProp<any, any>
}

export const Delete: React.FC<DeleteProps> = ({ navigation }) => {
    const { user, logout } = useUser()
    const { snackbar } = useSnackbar()
    const [loading, setLoading] = useState(false)

    const theme = useTheme()

    const onConfirm = async () => {
        try {
            setLoading(true)
            await api.delete("/user", { data: { id: user?.id } })
            snackbar("Usuário deletado")
            logout()
        } catch (error) {
            console.log(error)
            snackbar(JSON.stringify(error))
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={{ flex: 1, padding: 20, gap: 10, justifyContent: "center", alignItems: "center" }}>
            <Text>Tem certeza que deseja deletar sua conta? </Text>
            <Text>Essa ação é irreversível</Text>

            <View style={{ flexDirection: "row", paddingTop: 20, justifyContent: "space-around", width: "100%" }}>
                <Button onPress={() => navigation.goBack()} mode="outlined">
                    Voltar
                </Button>
                <Button onPress={onConfirm} loading={loading} mode="contained" buttonColor={theme.colors.error}>
                    Sim
                </Button>
            </View>
        </View>
    )
}

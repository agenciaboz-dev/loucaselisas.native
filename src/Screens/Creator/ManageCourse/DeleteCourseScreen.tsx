import { NavigationProp, RouteProp } from "@react-navigation/native"
import React, { useState } from "react"
import { View } from "react-native"
import { Text, useTheme } from "react-native-paper"
import { Button } from "../../../components/Button"
import { api } from "../../../backend/api"
import { useSnackbar } from "../../../hooks/useSnackbar"

interface DeleteCourseScreenProps {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>
}

export const DeleteCourseScreen: React.FC<DeleteCourseScreenProps> = ({ navigation, route }) => {
    const theme = useTheme()
    const { snackbar } = useSnackbar()
    const course = route.params?.course
    const [loading, setLoading] = useState(false)

    const onConfirm = async () => {
        setLoading(true)
        try {
            const respponse = await api.delete("/course", { data: { course_id: course.id } })
            snackbar("curso deletado")
            navigation.navigate("creator:home")
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={{ flex: 1, padding: 20, gap: 10, justifyContent: "center", alignItems: "center" }}>
            <Text>Tem certeza que deseja deletar esse curso? </Text>
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

import { NavigationProp, RouteProp } from "@react-navigation/native"
import React, { useState } from "react"
import { View } from "react-native"
import { useSnackbar } from "../../hooks/useSnackbar"
import { api } from "../../backend/api"
import { Text, useTheme } from "react-native-paper"
import { Button } from "../../components/Button"

interface DeleteLessonProps {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>
}

export const DeleteLesson: React.FC<DeleteLessonProps> = ({ navigation, route }) => {
    const theme = useTheme()
    const { snackbar } = useSnackbar()
    const lesson = route.params?.lesson
    const [loading, setLoading] = useState(false)

    const onConfirm = async () => {
        setLoading(true)
        try {
            const respponse = await api.delete("/lesson", { data: { lesson_id: lesson.id } })
            snackbar("lição deletada")
            navigation.goBack()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={{ flex: 1, padding: 20, gap: 10, justifyContent: "center", alignItems: "center" }}>
            <Text>Tem certeza que deseja deletar essa lição? </Text>
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

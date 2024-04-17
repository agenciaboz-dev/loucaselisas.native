import { NavigationProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useState } from "react"
import { Surface } from "react-native-paper"
import { ScreenTitle } from "../../../../components/ScreenTItle"
import { FlatList, LayoutAnimation, View } from "react-native"
import { useUser } from "../../../../hooks/useUser"
import { CardContainer } from "./CardContainer"
import { Button } from "../../../../components/Button"
import { api } from "../../../../backend/api"
import { PaymentCard } from "../../../../types/server/class/PaymentCard"
import { useSnackbar } from "../../../../hooks/useSnackbar"

interface SavedCardsProps {
    navigation: NavigationProp<any, any>
}

export const SavedCards: React.FC<SavedCardsProps> = ({ navigation }) => {
    const { user, refresh } = useUser()
    const { snackbar } = useSnackbar()

    const [loading, setLoading] = useState(false)
    const [cards, setCards] = useState<PaymentCard[]>([])

    const refreshData = async () => {
        setLoading(true)
        try {
            const response = await api.get("/card", { params: { user_id: user?.id } })
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
            setCards(response.data)
        } catch (error) {
            console.log(error)
            snackbar("erro ao recuperar cartões salvos")
        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            refreshData()
        }, [])
    )

    return user ? (
        <View style={{ flex: 1, padding: 20, gap: 10, paddingBottom: 0 }}>
            <ScreenTitle title="Cartões de pagamento salvos" />

            <FlatList
                data={cards.sort((a, b) => b.id - a.id)}
                renderItem={({ item }) => <CardContainer card={item} />}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                style={{ width: "100%" }}
                contentContainerStyle={{ gap: 20, paddingVertical: 20, paddingHorizontal: 5 }}
                refreshing={loading}
                onRefresh={refreshData}
                ListHeaderComponent={
                    <Button
                        icon={"plus-circle"}
                        mode="outlined"
                        onPress={() => navigation.navigate("setup:cards:form")}
                        style={{ borderStyle: "dashed" }}
                    >
                        Adicionar cartão
                    </Button>
                }
            />
        </View>
    ) : null
}

import { NavigationProp } from "@react-navigation/native"
import React, { useState } from "react"
import { Surface } from "react-native-paper"
import { ScreenTitle } from "../../../../components/ScreenTItle"
import { FlatList } from "react-native"
import { useUser } from "../../../../hooks/useUser"
import { CardContainer } from "./CardContainer"
import { Button } from "../../../../components/Button"
import { api } from "../../../../backend/api"

interface SavedCardsProps {
    navigation: NavigationProp<any, any>
}

export const SavedCards: React.FC<SavedCardsProps> = ({ navigation }) => {
    const { user, refresh } = useUser()

    const [loading, setLoading] = useState(false)

    const refreshData = async () => {
        setLoading(true)
        await refresh()
        setLoading(false)
    }

    return user ? (
        <Surface style={{ flex: 1, padding: 20, gap: 10, paddingBottom: 0 }}>
            <ScreenTitle title="Cartões de pagamento salvos" />
            <Button mode="contained" onPress={() => navigation.navigate("setup:cards:form")} style={{ alignSelf: "center" }}>
                Adicionar cartão
            </Button>
            <FlatList
                data={user.payment_cards.sort((a, b) => b.id - a.id)}
                renderItem={({ item }) => <CardContainer card={item} />}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                style={{ width: "100%" }}
                contentContainerStyle={{ gap: 20, paddingVertical: 20, paddingHorizontal: 5 }}
                refreshing={loading}
                onRefresh={refreshData}
            />
        </Surface>
    ) : null
}

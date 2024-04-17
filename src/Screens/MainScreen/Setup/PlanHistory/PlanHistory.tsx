import { NavigationProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useEffect, useState } from "react"
import { Surface } from "react-native-paper"
import { ScreenTitle } from "../../../../components/ScreenTItle"
import { ContractLog } from "../../../../types/server/class/Plan"
import { FlatList, LayoutAnimation, View } from "react-native"
import { HistoryContainer } from "./HistoryContainer"
import { api } from "../../../../backend/api"
import { useUser } from "../../../../hooks/useUser"

interface PlanHistoryProps {
    navigation: NavigationProp<any, any>
}

export const PlanHistory: React.FC<PlanHistoryProps> = ({ navigation }) => {
    const { user } = useUser()

    const [logs, setLogs] = useState<ContractLog[]>([])
    const [loading, setLoading] = useState(true)

    const refreshLogs = async () => {
        if (!user) return
        setLoading(true)
        try {
            const response = await api.get("/user/plan_logs", { params: { user_id: user.id } })
            const logs = response.data
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            setLogs(logs)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            refreshLogs()
        }, [])
    )

    useEffect(() => {
        console.log({ logs })
    }, [logs])

    return (
        <View style={{ flex: 1, padding: 20, paddingBottom: 0 }}>
            <ScreenTitle title="Histórico de pedidos" />
            <FlatList
                data={logs.reverse()}
                renderItem={({ item }) => <HistoryContainer log={item} />}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                style={{ width: "100%" }}
                contentContainerStyle={{ gap: 20, paddingVertical: 20, paddingHorizontal: 5 }}
                onRefresh={refreshLogs}
                refreshing={loading}
            />
        </View>
    )
}

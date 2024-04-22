import React, { useCallback, useState } from "react"
import { View } from "react-native"
import { StatContainer } from "./StatContainer"
import { useUser } from "../../../../hooks/useUser"
import { api } from "../../../../backend/api"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"
import { useTheme } from "react-native-paper"
import { StatisticsSkeletons } from "./StatisticSkeletons"
import { useFocusEffect } from "@react-navigation/native"

interface StatisticsProps {}

export const Statistics: React.FC<StatisticsProps> = ({}) => {
    const theme = useTheme()
    const { user } = useUser()
    const creator = user?.creator

    const [statistics, setStatistics] = useState<{ views: number; downloads: number; likes: number; messages: number }>()

    const refresh = async () => {
        try {
            const response = await api.get("/creator/statistics", { params: { creator_id: creator?.id } })
            setStatistics(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useFocusEffect(
        useCallback(() => {
            refresh()
        }, [])
    )

    return (
        <View style={{ flex: 1, padding: 20, gap: 10 }}>
            <View style={{ flexDirection: "row", gap: 10 }}>
                <StatContainer value={statistics?.views} title="Visualizações" skeleton={!statistics} />
                <StatContainer value={statistics?.downloads} title="Downloads" skeleton={!statistics} />
            </View>
            <View style={{ flexDirection: "row", gap: 10 }}>
                <StatContainer value={statistics?.likes} title="Favoritados" skeleton={!statistics} />
                <StatContainer value={statistics?.messages} title="Comentários" skeleton={!statistics} />
            </View>
        </View>
    )
}

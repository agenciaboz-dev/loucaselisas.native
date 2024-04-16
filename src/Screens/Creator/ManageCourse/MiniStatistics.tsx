import React from "react"
import { Icon, Surface, Text } from "react-native-paper"
import { Course } from "../../../types/server/class/Course"
import { View } from "react-native"

interface MiniStatisticsProps {
    course: Course
}

interface DataProps {
    value: number
    icon: string
    title: string
}

const Data: React.FC<DataProps> = ({ value, icon, title }) => {
    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Text>{value}</Text>
            <Icon size={20} source={icon} />
            <Text variant="labelSmall">{title}</Text>
        </View>
    )
}

export const MiniStatistics: React.FC<MiniStatisticsProps> = ({ course }) => {
    return (
        <Surface style={{ padding: 5, borderRadius: 15, gap: 5 }} elevation={1}>
            <Text variant="bodyLarge" style={{ alignSelf: "center" }}>
                Estatísticas
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10 }}>
                <Data icon="heart-outline" title="Favoritados" value={course.favorited_by} />
                <Data icon="account-outline" title="Inscritos" value={0} />
                <Data icon="comment-text-outline" title="Inscritos" value={0} />
            </View>
        </Surface>
    )
}

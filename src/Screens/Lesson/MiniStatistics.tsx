import React from "react"
import { Icon, Surface, Text } from "react-native-paper"
import { View } from "react-native"
import { Lesson } from "../../types/server/class/Course/Lesson"

interface MiniStatisticsProps {
    lesson: Lesson
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

export const MiniStatistics: React.FC<MiniStatisticsProps> = ({ lesson }) => {
    return (
        <Surface style={{ padding: 5, borderRadius: 15, gap: 5 }} elevation={1}>
            <Text variant="bodyLarge" style={{ alignSelf: "center" }}>
                Estatísticas
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10 }}>
                <Data icon="eye-outline" title="Visualizações" value={lesson.views} />
                <Data icon="download-outline" title="Baixados" value={lesson.downloads} />
                <Data icon="heart-outline" title="Favoritados" value={lesson.likes} />
            </View>
        </Surface>
    )
}

import numeral from "numeral"
import React from "react"
import { View } from "react-native"
import { Icon, Text } from "react-native-paper"

interface StatDataProps {
    icon: string
    value: number
}

export const StatData: React.FC<StatDataProps> = ({ icon, value }) => {
    return (
        <View style={{ alignItems: "center", gap: -5 }}>
            <Text variant="titleLarge">{numeral(value).format("0.[00]a").toUpperCase()}</Text>
            <Icon size={20} source={icon} />
        </View>
    )
}

import React from "react"
import { Text, TouchableRipple } from "react-native-paper"

export interface OptionItemProps {
    label: string
    onPress: () => void
}

export const OptionItem: React.FC<OptionItemProps> = ({ label, onPress }) => {
    return (
        <TouchableRipple style={{ paddingHorizontal: 20, paddingVertical: 10 }} onPress={onPress}>
            <Text>{label}</Text>
        </TouchableRipple>
    )
}

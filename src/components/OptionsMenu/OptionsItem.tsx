import React from "react"
import { Text, TouchableRipple } from "react-native-paper"

export interface OptionItemProps {
    label: string
    onPress: () => void
    disabled?: boolean
}

export const OptionItem: React.FC<OptionItemProps> = ({ label, onPress, disabled }) => {
    return (
        <TouchableRipple style={{ paddingHorizontal: 20, paddingVertical: 10 }} onPress={onPress} disabled={disabled}>
            <Text>{label}</Text>
        </TouchableRipple>
    )
}

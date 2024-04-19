import React from "react"
import { View, ViewStyle } from "react-native"
import { IconButtonProps, IconButton as PaperIconButton, Surface } from "react-native-paper"

interface CustomIconButtonProps extends IconButtonProps {
    wrapperStyle?: ViewStyle
}

export const IconButton: React.FC<CustomIconButtonProps> = (props) => {
    return (
        <Surface style={[{ borderRadius: 100 }, props.wrapperStyle]}>
            <PaperIconButton {...props} style={[{ margin: 0 }, props.style]} />
        </Surface>
    )
}

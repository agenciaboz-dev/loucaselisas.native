import React from "react"
import { View, ViewStyle } from "react-native"
import { Menu, TouchableRipple, useTheme } from "react-native-paper"
import { TrianguloMiseravel, TrianguloMiseravelProps } from "../TrianguloMiseravel"
import { OptionItem, OptionItemProps } from "./OptionsItem"

interface OptionsMenuProps {
    visible: boolean
    onDismiss: () => void
    anchorPosition?: "bottom" | "top"
    Anchor: React.ReactNode
    style?: ViewStyle
    triangleProps?: TrianguloMiseravelProps
    options: OptionItemProps[]
}

export const OptionsMenu: React.FC<OptionsMenuProps> = ({ visible, onDismiss, anchorPosition = "bottom", Anchor, style, triangleProps, options }) => {
    const theme = useTheme()

    return (
        <Menu
            visible={visible}
            onDismiss={onDismiss}
            anchorPosition={anchorPosition}
            anchor={Anchor}
            contentStyle={[{ borderRadius: 15 }, style]}
            style={{ marginTop: 45 }}
        >
            <TrianguloMiseravel color={theme.colors.elevation.level3} right={10} {...triangleProps} />
            <View style={{ paddingVertical: 0 }}>
                {options.map((item) => (
                    <OptionItem key={item.label} label={item.label} onPress={item.onPress} disabled={item.disabled} />
                ))}
            </View>
        </Menu>
    )
}

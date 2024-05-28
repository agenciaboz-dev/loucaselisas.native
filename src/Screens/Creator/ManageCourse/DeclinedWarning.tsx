import React from "react"
import { View } from "react-native"
import { Icon, Surface, Text, TouchableRipple, useTheme } from "react-native-paper"

interface ReprovedWarningProps {
    onEditPress?: () => void
    lesson?: boolean
}

export const DeclinedWarning: React.FC<ReprovedWarningProps> = ({ onEditPress, lesson }) => {
    const theme = useTheme()
    return (
        <Surface
            style={{
                flex: 1,
                flexDirection: "row",
                padding: 15,
                borderRadius: 15,
                backgroundColor: theme.colors.errorContainer,
                alignItems: "center",
                marginBottom: 5,
            }}
        >
            <Icon size={35} source={"alert-outline"} color={theme.colors.tertiary} />
            <Text style={{ color: theme.colors.tertiary, flex: 1, marginLeft: 15 }}>
                {lesson ? "Essa lição" : `Esse curso`} foi reprovad{lesson ? "a" : "o"} pelo administrador. Para enviar para análise novamente, por
                favor, revise as informações.
            </Text>
            {onEditPress && (
                <TouchableRipple
                    onPress={onEditPress}
                    borderless
                    style={{ padding: 10, justifyContent: "center", alignItems: "center", borderRadius: 15 }}
                >
                    <Text variant="bodyLarge" style={{ color: theme.colors.tertiary }}>
                        Editar
                    </Text>
                </TouchableRipple>
            )}
        </Surface>
    )
}

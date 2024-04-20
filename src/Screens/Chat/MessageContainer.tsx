import React from "react"
import { View } from "react-native"
import { Message } from "../../types/server/class/Chat/Message"
import { Surface, Text, useTheme } from "react-native-paper"
import { useUser } from "../../hooks/useUser"

interface MessageContainerProps {
    message: Message
    list: Message[]
}

export const MessageContainer: React.FC<MessageContainerProps> = ({ message, list }) => {
    const { user } = useUser()
    const you = message.user_id == user?.id
    const theme = useTheme()

    const index = list.findIndex((item) => item.id == message.id)
    const previous_message = index > 0 ? list[index - 1] : null

    const same_message_above = !(!previous_message || previous_message.user_id != message.user_id)

    return user ? (
        <View
            style={[{ alignItems: "flex-end", alignSelf: "flex-start" }, you && { alignSelf: "flex-end" }, same_message_above && { marginTop: -10 }]}
        >
            {!same_message_above && (
                <Text variant="bodySmall" style={{ paddingHorizontal: 5 }}>
                    {you ? "Você" : "a outra"}
                </Text>
            )}
            <Surface
                style={[
                    { padding: 10, borderRadius: 15, maxWidth: 300 },
                    you && { backgroundColor: theme.colors.surfaceVariant, borderBottomRightRadius: 0 },
                    !you && { borderBottomLeftRadius: 0 },
                ]}
            >
                <Text>{message.text}</Text>
            </Surface>
        </View>
    ) : null
}

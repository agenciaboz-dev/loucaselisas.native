import React from "react"
import { View } from "react-native"
import { Message } from "../../types/server/class/Chat/Message"
import { Icon, Surface, Text, useTheme } from "react-native-paper"
import { useUser } from "../../hooks/useUser"
import { Logo } from "../../components/Logo"
import { Creator } from "../../types/server/class"

interface MessageContainerProps {
    message: Message
    list: Message[]
    creators: Partial<Creator>[]
}

export const MessageContainer: React.FC<MessageContainerProps> = ({ message, list, creators }) => {
    const { user } = useUser()
    const you = message.user_id == user?.id
    const theme = useTheme()

    const index = list.findIndex((item) => item.id == message.id)
    const previous_message = index > 0 ? list[index - 1] : null
    const next_message = index + 1 <= list.length ? list[index + 1] : null

    const same_message_above = !(!previous_message || previous_message.user_id != message.user_id)
    const same_message_bellow = !(!next_message || next_message.user_id != message.user_id)

    console.log(creators)

    return user ? (
        <View
            style={[{ alignSelf: "flex-start" }, you && { alignSelf: "flex-end", alignItems: "flex-end" }, same_message_above && { marginTop: -12 }]}
        >
            {!same_message_above && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 0 }}>
                    {!!creators.find((item) => item.user_id == message.user_id) && <Logo size={20} tintColor={"black"} />}
                    <Text variant="bodySmall" style={{ paddingHorizontal: 5 }}>
                        {you ? "Você" : message.user?.name}
                    </Text>
                </View>
            )}
            <Surface
                style={[
                    { padding: 10, borderRadius: 15, maxWidth: 300 },
                    you && { backgroundColor: theme.colors.surfaceVariant },
                    you && !same_message_bellow && { borderBottomRightRadius: 0 },

                    !you && !same_message_bellow && { borderBottomLeftRadius: 0, alignSelf: "flex-start" },
                ]}
            >
                <Text>{message.text}</Text>
            </Surface>
        </View>
    ) : null
}

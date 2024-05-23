import React from "react"
import { View } from "react-native"
import { Message } from "../../types/server/class/Chat/Message"
import { Surface, Text, TouchableRipple, useTheme } from "react-native-paper"
import { useUser } from "../../hooks/useUser"
import { Creator } from "../../types/server/class"
import SkeletonPlaceholder from "react-native-skeleton-placeholder"
import { Image } from "expo-image"

interface MessageContainerProps {
    message: Message
    list: Message[]
    creators: Partial<Creator>[]
    refreshing?: boolean
    showImage: (position: number) => void
}

export const MessageContainer: React.FC<MessageContainerProps> = ({ message, list, creators, refreshing, showImage }) => {
    const { user } = useUser()
    const you = message.user_id == user?.id
    const theme = useTheme()
    const skeletonWidth = message.text.length * 14 * 0.55 + 20

    const index = list.findIndex((item) => item.id == message.id)
    const previous_message = index > 0 ? list[index - 1] : null
    const next_message = index + 1 <= list.length ? list[index + 1] : null

    const same_message_above = !(!previous_message || previous_message.user_id != message.user_id)
    const same_message_bellow = !(!next_message || next_message.user_id != message.user_id)

    return user ? (
        !refreshing ? (
            <View
                style={[
                    { alignSelf: "flex-start" },
                    you && { alignSelf: "flex-end", alignItems: "flex-end" },
                    same_message_above && { marginTop: -12 },
                ]}
            >
                {!same_message_above && (
                    <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 0, marginBottom: 5 }}>
                        {!!creators.find((item) => item.user_id == message.user_id) && (
                            <Image source={require("../../../assets/logo_without_text.svg")} style={{ width: 20, height: 20 }} tintColor={"black"} />
                        )}
                        <Text variant="bodySmall" style={{ paddingHorizontal: 5 }}>
                            {you ? "Você" : message.user?.name || "Usuário indisponível"}
                        </Text>
                    </View>
                )}
                <Surface
                    style={[
                        { padding: 10, borderRadius: 15, maxWidth: 300, gap: 10 },
                        you && { backgroundColor: theme.colors.surfaceVariant },
                        you && !same_message_bellow && { borderBottomRightRadius: 0 },

                        !you && !same_message_bellow && { borderBottomLeftRadius: 0, alignSelf: "flex-start" },
                    ]}
                >
                    {message.media && (
                        <TouchableRipple borderless style={{ borderRadius: 15 }} onPress={() => showImage(message.media!.position)}>
                            <Image
                                source={{ uri: message.media.url }}
                                style={{ width: 270, aspectRatio: message.media.width / message.media.height, maxHeight: 500, borderRadius: 15 }}
                            />
                        </TouchableRipple>
                    )}
                    {message.text && <Text>{message.text}</Text>}
                </Surface>
            </View>
        ) : (
            <SkeletonPlaceholder backgroundColor={theme.colors.backdrop}>
                <SkeletonPlaceholder.Item
                    width={skeletonWidth}
                    maxWidth={300}
                    height={(Math.floor(skeletonWidth / 300) + 1) * 30}
                    borderRadius={15}
                    alignSelf={you ? "flex-end" : "flex-start"}
                />
            </SkeletonPlaceholder>
        )
    ) : null
}

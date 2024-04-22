import { RouteProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { FlatList, LayoutAnimation, NativeSyntheticEvent, TextInputSubmitEditingEventData, View } from "react-native"
import { ScreenTitle } from "../../components/ScreenTItle"
import { Chat } from "../../types/server/class/Chat/Chat"
import { Course } from "../../types/server/class/Course"
import { Message, MessageForm } from "../../types/server/class/Chat/Message"
import { useUser } from "../../hooks/useUser"
import { MessageContainer } from "./MessageContainer"
import { TextInput, useTheme } from "react-native-paper"
import { Socket, io } from "socket.io-client"
import { url } from "../../backend/backend"

interface ChatProps {
    route: RouteProp<any, any>
}

export const ChatScreen: React.FC<ChatProps> = ({ route }) => {
    const theme = useTheme()
    const { user } = useUser()
    const course = route.params?.course as Course | undefined
    const [chat, setChat] = useState(course?.chat as Chat | undefined)
    const [messages, setMessages] = useState<Message[]>([])
    const [refreshing, setRefreshing] = useState(true)
    const socket = useRef<Socket | null>(null)
    const scrollRef = useRef<FlatList>(null)

    const [text, setText] = useState("")

    const onSubmitText = () => {
        if (!chat || !socket.current || !user || !text) return
        console.log(text)

        const data: MessageForm = {
            chat_id: chat.id,
            user_id: user.id,
            text,
            video_id: null,
            video_timestamp: null,
        }
        socket.current?.emit("chat:message", data)
        setText("")
    }

    const addMessage = (message: Message) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setMessages((messages) => [...messages, message])
    }

    const listenToEvents = () => {
        if (!socket.current) return

        socket.current.on("connect", () => {
            console.log("socketio conected")
        })
        socket.current.on("disconnect", () => {
            console.log("socketio disconnected")
        })

        socket.current.on("chat:join", (data: Message[]) => {
            console.log("joined chat!")
            setMessages(data)
            setTimeout(() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                setRefreshing(false)
            }, 2000)
        })

        socket.current.on("chat:message", (message: Message) => {
            addMessage(message)
        })

        socket.current.on("chat:message:success", (message: Message) => {
            addMessage(message)
        })
    }

    const unListenEvents = () => {
        if (!socket.current) return

        socket.current.off("chat:join")
        socket.current.off("chat:message")
        socket.current.off("chat:message:success")
    }

    const socketConnect = () => {
        socket.current = io(`ws${url}`)
        listenToEvents()

        socket.current.emit("chat:join", chat?.id)
    }

    useFocusEffect(
        useCallback(() => {
            socketConnect()

            return () => {
                unListenEvents()
                socket.current?.disconnect()
            }
        }, [])
    )

    useEffect(() => {
        if (!!messages.length && !refreshing) {
            console.log("should scroll")
            setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 2000)
        }
    }, [messages])

    return chat && course ? (
        <View style={{ flex: 1, padding: 20, paddingBottom: 0, paddingTop: 10, position: "relative" }}>
            <ScreenTitle title={`Grupo - ${course.name}`} />

            <FlatList
                ref={scrollRef}
                data={messages.sort((a, b) => Number(a.datetime) - Number(b.datetime))}
                renderItem={({ item }) => (
                    <MessageContainer message={item} list={messages} creators={[course.owner, ...course.creators]} refreshing={refreshing} />
                )}
                style={{ marginHorizontal: -20 }}
                contentContainerStyle={{
                    // flex: 1,
                    gap: 20,
                    paddingHorizontal: 20,
                    paddingTop: 80,
                    flexDirection: "column-reverse",
                }}
                inverted
                refreshing={refreshing}
                initialScrollIndex={0}
            />

            <TextInput
                placeholder="Envie uma mensagem"
                value={text}
                onChangeText={setText}
                mode="outlined"
                style={{
                    backgroundColor: theme.colors.elevation.level2,
                    position: "absolute",
                    bottom: 10,
                    width: "100%",
                    alignSelf: "center",
                }}
                outlineStyle={{ borderRadius: 10, borderWidth: 0 }}
                left={<TextInput.Icon icon={"image-plus"} />}
                right={<TextInput.Icon icon="chevron-right" onPress={onSubmitText} />}
                onSubmitEditing={onSubmitText}
                blurOnSubmit={false}
                returnKeyType="send"
                keyboardType="twitter"
            />
        </View>
    ) : null
}

import ImageView from "react-native-image-viewing"
import { RouteProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useEffect, useRef, useState } from "react"
import {
    FlatList,
    GestureResponderEvent,
    Keyboard,
    LayoutAnimation,
    NativeSyntheticEvent,
    Platform,
    TextInputSubmitEditingEventData,
    View,
} from "react-native"
import { ScreenTitle } from "../../components/ScreenTItle"
import { Chat } from "../../types/server/class/Chat/Chat"
import { Course } from "../../types/server/class/Course"
import { Message, MessageForm } from "../../types/server/class/Chat/Message"
import { useUser } from "../../hooks/useUser"
import { MessageContainer } from "./MessageContainer"
import { IconButton, Modal, Text, TextInput, useTheme } from "react-native-paper"
import { Socket, io } from "socket.io-client"
import { url } from "../../backend/backend"
import { getFilename, pickMedia } from "../../tools/pickMedia"
import { ImagePickerAsset, MediaTypeOptions } from "expo-image-picker"
import { Image } from "expo-image"
import { Lesson } from "../../types/server/class/Course/Lesson"
import moment from "moment"
import "moment-duration-format"

interface ChatProps {
    route: RouteProp<any, any>
}

export const ChatScreen: React.FC<ChatProps> = ({ route }) => {
    const theme = useTheme()
    const { user } = useUser()
    const course = route.params?.course as Course | undefined
    const socket = useRef<Socket | null>(null)
    const scrollRef = useRef<FlatList>(null)

    const [sharingLesson, setSharingLesson] = useState(
        route.params?.sharingLesson as { lesson: Lesson; timestamp: number; thumb: string } | undefined
    )
    const [chat, setChat] = useState(course?.chat as Chat | undefined)
    const [messages, setMessages] = useState<Message[]>([])
    const [refreshing, setRefreshing] = useState(true)
    const [viewingMedia, setViewingMedia] = useState<number | null>(null)

    const [media, setMedia] = useState<ImagePickerAsset>()
    const [text, setText] = useState("")

    const onSubmitText = () => {
        if (!chat || !socket.current || !user || (!text && !media)) return
        console.log(text)

        const data: MessageForm = {
            chat_id: chat.id,
            user_id: user.id,
            text,
            video_id: null,
            video_timestamp: null,
        }

        if (media) {
            data.media = {
                ...media,
                position: messages.filter((item) => item.media).length + 1,
                name: getFilename(media),
                height: media.height,
                width: media.width,
                type: media.type || "image",
            }
        }

        if (sharingLesson) {
            data.video_id = sharingLesson.lesson.id
            data.video_timestamp = sharingLesson.timestamp.toString()
        }

        socket.current?.emit("chat:message", data)
        dismissMediaModal()
        setText("")
    }

    const onAddMediaPres = async (event: GestureResponderEvent) => {
        event.preventDefault()
        const result = await pickMedia(undefined, false, MediaTypeOptions.Images)
        if (result) {
            setMedia(result[0])
        }
    }

    const addMessage = (message: Message) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setMessages((messages) => [...messages, message])
    }

    const dismissMediaModal = () => {
        setMedia(undefined)
        setSharingLesson(undefined)
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

    const [keyboardOpen, setKeyboardOpen] = useState(false)
    const iosKeyboard = Platform.OS == "ios" && keyboardOpen

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            setKeyboardOpen(true)
        })
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            setKeyboardOpen(false)
        })

        return () => {
            showSubscription.remove()
            hideSubscription.remove()
        }
    }, [])

    return chat && course ? (
        <View style={{ flex: 1, padding: 20, paddingBottom: 0, paddingTop: 10, position: "relative" }}>
            <ScreenTitle title={`Grupo - ${course.name}`} />

            <FlatList
                ref={scrollRef}
                data={messages.sort((a, b) => Number(a.datetime) - Number(b.datetime))}
                renderItem={({ item, index }) => (
                    <MessageContainer
                        message={item}
                        list={messages}
                        creators={[course.owner, ...course.creators]}
                        refreshing={refreshing}
                        showImage={(position: number) => setViewingMedia(position - 1)}
                    />
                )}
                style={{ marginHorizontal: -20 }}
                contentContainerStyle={{
                    // flex: 1,
                    gap: 20,
                    paddingHorizontal: 20,
                    paddingTop: iosKeyboard ? 270 : 80,
                    flexDirection: "column-reverse",
                }}
                inverted
                refreshing={refreshing}
                initialScrollIndex={0}
            />

            <Modal
                visible={!!sharingLesson || !!media}
                onDismiss={dismissMediaModal}
                contentContainerStyle={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: iosKeyboard && sharingLesson ? 10 : iosKeyboard && !sharingLesson ? 220 : 80,
                }}
            >
                <Image
                    source={{ uri: sharingLesson?.thumb || media?.uri }}
                    style={{
                        width:
                            Platform.OS === "ios" && sharingLesson
                                ? 250
                                : Platform.OS === "ios" && !sharingLesson
                                ? 120
                                : Platform.OS === "android" && sharingLesson
                                ? 300
                                : 100,
                        aspectRatio: media ? media.width / media.height : 16 / 9,
                        maxHeight: 500,
                        borderRadius: 15,
                    }}
                />
                {sharingLesson && (
                    <View
                        style={{
                            position: Platform.OS == "ios" ? "relative" : "absolute",
                            width: 300,
                            height: Platform.OS == "ios" ? "60%" : "100%",
                            alignItems: "center",
                            padding: 10,
                            justifyContent: "space-between",
                            paddingBottom: 120,
                            bottom: Platform.OS === "ios" ? 150 : 85,
                        }}
                    >
                        <Text
                            variant={Platform.OS == "ios" ? "bodyLarge" : "headlineMedium"}
                            style={{ color: theme.colors.secondary }}
                            numberOfLines={1}
                        >
                            {sharingLesson.lesson.name}
                        </Text>
                        <IconButton
                            icon={"play-circle-outline"}
                            iconColor={theme.colors.secondary}
                            size={Platform.OS == "ios" ? 40 : 50}
                        />
                        <Text
                            style={{ color: theme.colors.secondary }}
                            variant={Platform.OS == "ios" ? "bodyMedium" : "headlineMedium"}
                        >
                            {/* @ts-ignore */}
                            {moment.duration(sharingLesson.timestamp).format("mm:ss", { trim: false })}
                        </Text>
                    </View>
                )}
            </Modal>

            <TextInput
                placeholder="Envie uma mensagem"
                value={text}
                onChangeText={setText}
                mode="outlined"
                style={{
                    backgroundColor: theme.colors.elevation.level2,
                    position: "absolute",
                    bottom: iosKeyboard ? 200 : 10,
                    width: "100%",
                    alignSelf: "center",
                }}
                outlineStyle={{ borderRadius: 10, borderWidth: 0 }}
                left={<TextInput.Icon icon={"image-plus"} onPress={onAddMediaPres} disabled={!!sharingLesson || !!media} />}
                right={<TextInput.Icon icon="send" onPress={onSubmitText} />}
                onSubmitEditing={onSubmitText}
                blurOnSubmit={false}
                returnKeyType="send"
                keyboardType="twitter"
            />

            <ImageView
                images={messages.filter((item) => item.media).map((item) => ({ uri: item.media!.url }))}
                imageIndex={viewingMedia ?? 0}
                visible={viewingMedia !== null}
                onRequestClose={() => setViewingMedia(null)}
                animationType="slide"
            />
        </View>
    ) : null
}

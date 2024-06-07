import ImageView from "react-native-image-viewing"
import { RouteProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useEffect, useRef, useState } from "react"
import {
    Dimensions,
    FlatList,
    GestureResponderEvent,
    Keyboard,
    LayoutAnimation,
    NativeSyntheticEvent,
    Platform,
    Pressable,
    TextInputSubmitEditingEventData,
    TouchableWithoutFeedback,
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
import { api } from "../../backend/api"

interface ChatProps {
    route: RouteProp<any, any>
}

export const ChatScreen: React.FC<ChatProps> = ({ route }) => {
    const theme = useTheme()
    const course_id = route.params?.course_id as string | undefined
    const { user } = useUser()
    const socket = useRef<Socket | null>(null)
    const scrollRef = useRef<FlatList>(null)

    const [course, setCourse] = useState(route.params?.course as Course | undefined)
    const [sharingLesson, setSharingLesson] = useState(
        route.params?.sharingLesson as { lesson: Lesson; timestamp: number; thumb: string } | undefined
    )
    const [chat, setChat] = useState(course?.chat as Chat | undefined)
    const [messages, setMessages] = useState<Message[]>([])
    const [refreshing, setRefreshing] = useState(true)
    const [viewingMedia, setViewingMedia] = useState<number | null>(null)

    const [media, setMedia] = useState<ImagePickerAsset>()
    const [text, setText] = useState("")
    const [selectedList, setSelectedList] = useState<Message[]>([])
    const [deleting, setDeleting] = useState(false)

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
                duration: undefined,
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

    const deleteMessages = (deleted: Message[]) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setMessages((currentMessages) => currentMessages.filter((message) => !deleted.some((deletedMessage) => deletedMessage.id === message.id)))
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
            }, 1000)
        })

        socket.current.on("chat:message", (message: Message) => {
            addMessage(message)
        })

        socket.current.on("chat:message:delete", (messages: Message[]) => {
            deleteMessages(messages)
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
        socket.current.off("chat:message:delete")
    }

    const socketConnect = () => {
        socket.current = io(`ws${url}`)
        listenToEvents()

        socket.current.emit("chat:join", chat?.id, "app")
    }

    const onSelectMessage = (message: Message, selected: boolean) => {
        if (Platform.OS == "ios") LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        if (selected) {
            setSelectedList((list) => [...list, message])
        } else {
            setSelectedList((list) => list.filter((item) => item.id != message.id))
        }
    }

    const handleDelete = async () => {
        if (deleting || !socket.current) return

        socket.current.emit("chat:message:delete", selectedList, chat?.id)
        setSelectedList([])
    }

    const refreshCourse = async () => {
        console.log("fetching course")
        try {
            const response = await api.get("/course", { params: { course_id } })
            setCourse(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useFocusEffect(
        useCallback(() => {
            if (course && chat) {
                console.log(course)
                socketConnect()

                return () => {
                    unListenEvents()
                    socket.current?.disconnect()
                }
            } else {
                console.log("oi")
                refreshCourse()
            }
        }, [course, chat])
    )

    useEffect(() => {
        if (!!messages.length && !refreshing) {
            console.log("should scroll")
            setTimeout(() => scrollRef.current?.scrollToOffset({ offset: 0 }), 2000)
        }
    }, [messages])

    useEffect(() => {
        if (course) {
            setChat(course.chat!)
        }
    }, [course])


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

    const SharingLessonDetails = () =>
        sharingLesson ? (
            <Pressable
                style={{
                    position: "absolute",
                    width: Dimensions.get("screen").width * 0.85,
                    height: "100%",
                    alignItems: "center",
                    padding: 10,
                    justifyContent: "space-between",
                }}
                onPress={() => Keyboard.dismiss()}
            >
                <Text variant="headlineMedium" style={{ color: theme.colors.secondary }} numberOfLines={1}>
                    {sharingLesson.lesson.name}
                </Text>
                <IconButton icon={"play-circle-outline"} iconColor={theme.colors.secondary} size={50} />
                <Text style={{ color: theme.colors.secondary }} variant="headlineMedium">
                    {/* @ts-ignore */}
                    {moment.duration(sharingLesson.timestamp).format("mm:ss", { trim: false })}
                </Text>
            </Pressable>
        ) : null

    return chat && course ? (
        <View style={{ flex: 1, padding: 20, paddingBottom: 0, paddingTop: 10, position: "relative" }}>
            <ScreenTitle
                title={`Grupo - ${course.name}`}
                right={!!selectedList.length && <IconButton loading={deleting} icon={"delete"} style={{ margin: 0 }} onPress={handleDelete} />}
            />

            <FlatList
                ref={scrollRef}
                data={messages.sort((a, b) => Number(a.datetime) - Number(b.datetime)).reverse()}
                renderItem={({ item, index }) => (
                    <MessageContainer
                        message={item}
                        list={messages}
                        creators={[course.owner, ...course.creators]}
                        refreshing={refreshing}
                        showImage={(position: number) => setViewingMedia(position - 1)}
                        selectedList={selectedList}
                        onSelectMessage={onSelectMessage}
                    />
                )}
                keyExtractor={(item: Message) => item.id}
                style={{ marginHorizontal: -20 }}
                contentContainerStyle={{
                    // flex: 1,
                    gap: 20,
                    paddingHorizontal: 20,
                    paddingTop: iosKeyboard ? 270 : 80,
                    paddingBottom: 5,
                }}
                inverted
                refreshing={refreshing}
                initialScrollIndex={0}
            />

            <Modal
                visible={!!sharingLesson || !!media}
                onDismiss={dismissMediaModal}
                contentContainerStyle={{
                    position: "relative",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: iosKeyboard ? 250 : 0,
                }}
            >
                <Image
                    source={{ uri: sharingLesson?.thumb || media?.uri }}
                    style={{
                        width: Dimensions.get("screen").width * 0.85,
                        aspectRatio: media ? media.width / media.height : 16 / 9,
                        borderRadius: 15,
                    }}
                    children={Platform.OS == "ios" ? <SharingLessonDetails /> : undefined}
                />
                {Platform.OS == "android" && <SharingLessonDetails />}
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
                images={messages
                    .filter((item) => item.media)
                    .reverse()
                    .map((item) => ({ uri: item.media!.url }))}
                imageIndex={viewingMedia ?? 0}
                visible={viewingMedia !== null}
                onRequestClose={() => setViewingMedia(null)}
                animationType="slide"
            />
        </View>
    ) : null
}

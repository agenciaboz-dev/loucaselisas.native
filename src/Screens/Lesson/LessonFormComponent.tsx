import { NavigationProp, RouteProp } from "@react-navigation/native"
import React, { useEffect, useRef, useState } from "react"
import {
    Dimensions,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    LayoutAnimation,
    Platform,
    ScrollView,
    View,
} from "react-native"
import { ScreenTitle } from "../../components/ScreenTItle"
import { useFormik } from "formik"
import { Lesson, LessonForm } from "../../types/server/class/Course/Lesson"
import { MediaForm } from "../../types/server/class/Gallery/Media"
import { Button } from "../../components/Button"
import { Surface, Text, useTheme } from "react-native-paper"
import { FormText } from "../../components/FormText"
import { api } from "../../backend/api"
import { useSnackbar } from "../../hooks/useSnackbar"
import { LessonMediaForm } from "./LessonMediaForm"
import * as Yup from "yup"
import { validationErrors } from "../../tools/validationErrors"
import { ImagePickerAsset } from "expo-image-picker"
import { getFilename } from "../../tools/pickMedia"
import { AxiosError } from "axios"
import { DeclinedWarning } from "../Creator/ManageCourse/DeclinedWarning"

interface LessonFormComponentProps {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>
}

export const LessonFormComponent: React.FC<LessonFormComponentProps> = ({ navigation, route }) => {
    const lesson = route.params?.lesson as Lesson | undefined
    const course_id = (route.params?.course?.id as string | undefined) || lesson?.course_id
    const theme = useTheme()
    const image_width = Dimensions.get("screen").width * 0.9
    const max_image_height = (image_width / 16) * 9

    const mediasRef = useRef<FlatList>(null)

    const { snackbar } = useSnackbar()

    const [media, setMedia] = useState<ImagePickerAsset | null>(null)
    const [thumb, setThumb] = useState<ImagePickerAsset | null>(null)
    const [loading, setLoading] = useState(false)
    const [mediaError, setMediaError] = useState("")

    const validation_schema = Yup.object({
        name: Yup.string().required(validationErrors.required),
        info: Yup.string().required(validationErrors.required),
    })

    const formik = useFormik<LessonForm>({
        initialValues: {
            name: "",
            info: "",
            pdf: null,
            course_id: course_id || "",
        },
        async onSubmit(values, formikHelpers) {
            if (loading) return
            if (!lesson && (!media || !thumb)) return
            setLoading(true)

            const formData = new FormData()
            const data: LessonForm & { id?: string } = {
                ...values,
                id: lesson ? lesson.id : undefined,
            }
            if (media) {
                data.media = {
                    ...values.media,
                    position: 1,
                    name: getFilename(media),
                    height: media.height,
                    width: media.width,
                    type: media.type == "image" ? "image" : "video",
                    duration: media.duration || undefined,
                }
            }

            if (thumb) {
                data.thumb = { name: getFilename(thumb) }
            }

            formData.append("data", JSON.stringify(data))
            if (media) {
                formData.append("media", { uri: media.uri, type: media.mimeType!, name: getFilename(media) } as any)
            }
            if (thumb) {
                formData.append("thumb", { uri: thumb.uri, type: thumb.mimeType!, name: getFilename(thumb) } as any)
            }

            try {
                const response = lesson
                    ? await api.patch("/lesson", formData, { headers: { "content-type": "multipart/form-data" } })
                    : await api.post("/lesson", formData, { headers: { "content-type": "multipart/form-data" } })
                snackbar(`lição ${lesson ? "atualizada" : "criada"} com sucesso`)
                navigation.goBack()
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        },
        validationSchema: validation_schema,
        validateOnChange: false,
    })

    const flashMediaScroll = () => {
        if (lesson) return
        setTimeout(() => {
            mediasRef.current?.scrollToIndex({ index: 1, viewOffset: image_width * 0.7 })
            setTimeout(() => mediasRef.current?.scrollToIndex({ index: 0, viewOffset: 20 }), 200)
        }, 500)
    }

    const preSubmit = () => {
        formik.validateForm()

        if (!lesson) {
            if (!thumb && !media) setMediaError("Insira uma mídia e thumbnail")
            if (!thumb && media) setMediaError("Thumbnail é obrigatória")
            if (thumb && !media) setMediaError("Insira uma mídia")
            if (thumb && media) {
                formik.handleSubmit()
            }
        } else {
            formik.handleSubmit()
        }
    }

    useEffect(() => {
        if (media) {
            setTimeout(() => mediasRef.current?.scrollToIndex({ index: 1, viewOffset: 20 }), 1000)
        }
    }, [media])

    useEffect(() => {
        if (lesson) {
            formik.setFieldValue("name", lesson.name)
            formik.setFieldValue("info", lesson.info)
        }
    }, [lesson])

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

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "height" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={{ flex: 1 }}
                contentContainerStyle={{
                    padding: 20,
                    gap: 10,
                    paddingBottom: 10,
                    // position: iosKeyboard ? "relative" : "relative",
                    bottom: iosKeyboard ? 190 : 0,
                }}
            >
                <ScreenTitle title={lesson ? "Editar lição" : "Nova lição"} />
                {lesson?.status == "declined" && (
                    <Surface style={{ padding: 10, borderRadius: 20, gap: 10 }}>
                        <DeclinedWarning lesson />
                        <Text variant="headlineMedium" style={{ color: theme.colors.tertiary }}>
                            Motivo da reprovação
                        </Text>

                        <Text style={{ color: theme.colors.tertiary }}>{lesson.declined_reason}</Text>
                    </Surface>
                )}

                <FlatList
                    ref={mediasRef}
                    horizontal
                    data={[
                        { media: media || lesson?.media, setMedia: setMedia, thumb: false, previousUri: lesson?.media.url },
                        { media: thumb || lesson?.thumb, setMedia: setThumb, thumb: true, previousUri: lesson?.thumb },
                    ]}
                    renderItem={({ item }) => (
                        <LessonMediaForm media={item.media} setMedia={item.setMedia} thumb={item.thumb} previousUri={item.previousUri} />
                    )}
                    style={{ marginHorizontal: -20 }}
                    contentContainerStyle={{ gap: 10, height: max_image_height + 5, paddingHorizontal: 20 }}
                    showsHorizontalScrollIndicator={false}
                    onLayout={flashMediaScroll}
                />
                {mediaError && <Text style={{ color: "red" }}>{mediaError}</Text>}

                <FormText formik={formik} name="name" label={"Título"} />
                <FormText formik={formik} name="info" label={"Descrição"} multiline numberOfLines={5} />
                <Button loading={loading} mode="contained" onPress={() => preSubmit()} disabled={loading}>
                    Enviar
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

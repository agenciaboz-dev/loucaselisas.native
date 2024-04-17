import { NavigationProp, RouteProp } from "@react-navigation/native"
import React, { useState } from "react"
import { ScrollView, View } from "react-native"
import { ScreenTitle } from "../../components/ScreenTItle"
import { useFormik } from "formik"
import { LessonForm } from "../../types/server/class/Course/Lesson"
import { FileUpload } from "../../types/server/class/helpers"
import { Media, MediaForm } from "../../types/server/class/Gallery/Media"
import { Course } from "../../types/server/class/Course"
import { Button } from "../../components/Button"
import { getFilename, pickMedia } from "../../tools/pickMedia"
import * as FileSystem from "expo-file-system"
import { Image, ImageStyle } from "expo-image"
import { ImagePickerAsset, MediaTypeOptions } from "expo-image-picker"
import { IconButton, Text, useTheme } from "react-native-paper"
import { ResizeMode, Video } from "expo-av"
import { FormText } from "../../components/FormText"
import { api } from "../../backend/api"
import { useSnackbar } from "../../hooks/useSnackbar"

interface LessonFormComponentProps {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>
}

export const LessonFormComponent: React.FC<LessonFormComponentProps> = ({ navigation, route }) => {
    const course = route.params?.course as Course
    const theme = useTheme()
    const media_style: ImageStyle = { width: "100%", aspectRatio: "16/9", borderRadius: 15 }

    const { snackbar } = useSnackbar()

    const [media, setMedia] = useState<MediaForm | null>(null)
    const [thumb, setThumb] = useState<MediaForm | null>(null)
    const [loading, setLoading] = useState(false)

    const formik = useFormik<LessonForm>({
        initialValues: {
            media: { height: 1, id: "", name: "", position: 1, type: "VIDEO", url: "", width: 1 },
            thumb: { name: "" },
            name: "",
            info: "",
            pdf: null,
            course_id: course.id,
        },
        async onSubmit(values, formikHelpers) {
            if (loading || !media || !thumb) return
            console.log(values)

            setLoading(true)

            const data: LessonForm = {
                ...values,
                media: { ...media, id: "", url: "" },
                thumb,
            }

            try {
                const response = await api.post("/lesson", data)
                snackbar("lição criada com sucesso")
                navigation.goBack()
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        },
    })

    const onUpdateMedia = async () => {
        const result = await pickMedia([16, 9])
        if (result) {
            const media = result[0]

            if (!media.base64) {
                media.base64 = await FileSystem.readAsStringAsync(media.uri, {
                    encoding: "base64",
                })
            }

            setMedia({
                height: media.height,
                name: getFilename(media),
                position: 1,
                type: media.type == "image" ? "IMAGE" : "VIDEO",
                width: media.width,
                base64: media.base64,
            })
        }
    }

    const onUpdateThumb = async () => {
        const result = await pickMedia([16, 9], false, MediaTypeOptions.Images)
        if (result) {
            const media = result[0]

            setThumb({
                height: media.height,
                name: getFilename(media),
                position: 1,
                type: "IMAGE",
                width: media.width,
                base64: media.base64!,
            })
        }
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, gap: 10 }}
        >
            <ScreenTitle title="Nova lição" />

            {media ? (
                <View style={{ position: "relative" }}>
                    {media.type == "IMAGE" ? (
                        <Image source={{ uri: media.url || "data:image/png;base64," + media.base64 }} style={media_style} contentFit="cover" />
                    ) : (
                        <Video
                            source={{ uri: media.url || "data:video/mp4;base64," + media.base64 }}
                            style={media_style}
                            resizeMode={ResizeMode.COVER}
                            useNativeControls
                            isLooping
                            onError={(error) => console.log({ error })}
                        />
                    )}
                    <IconButton
                        icon={"pencil-outline"}
                        style={{ position: "absolute", right: 5, top: 5 }}
                        containerColor={theme.colors.background}
                        onPress={onUpdateMedia}
                    />
                </View>
            ) : (
                <Button
                    mode="outlined"
                    style={{ borderStyle: "dashed", width: "100%", aspectRatio: "16/9" }}
                    contentStyle={{ height: "100%" }}
                    onPress={onUpdateMedia}
                >
                    Mídia da lição
                </Button>
            )}

            {thumb ? (
                <View style={{ position: "relative" }}>
                    <Image source={{ uri: thumb.url || "data:image/png;base64," + thumb.base64 }} style={media_style} contentFit="cover" />
                    <IconButton
                        icon={"pencil-outline"}
                        style={{ position: "absolute", right: 5, top: 5 }}
                        containerColor={theme.colors.background}
                        onPress={onUpdateThumb}
                    />
                </View>
            ) : (
                <Button
                    mode="outlined"
                    style={{ borderStyle: "dashed", width: "100%", aspectRatio: "16/9" }}
                    contentStyle={{ height: "100%" }}
                    onPress={onUpdateThumb}
                >
                    Thumbnail
                </Button>
            )}

            <FormText formik={formik} name="name" label={"Título"} />
            <FormText formik={formik} name="info" label={"Descrição"} multiline numberOfLines={5} />
            <Button loading={loading} mode="contained" onPress={() => formik.handleSubmit()} disabled={loading}>
                Enviar
            </Button>
        </ScrollView>
    )
}

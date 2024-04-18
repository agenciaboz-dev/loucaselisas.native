import { NavigationProp, RouteProp } from "@react-navigation/native"
import React, { useRef, useState } from "react"
import { Dimensions, FlatList, ScrollView, View } from "react-native"
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
import { LessonMediaForm } from "./LessonMediaForm"

interface LessonFormComponentProps {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>
}

export const LessonFormComponent: React.FC<LessonFormComponentProps> = ({ navigation, route }) => {
    const course = route.params?.course as Course
    const theme = useTheme()
    const image_width = Dimensions.get("screen").width * 0.9
    const max_image_height = (image_width / 16) * 9

    const mediasRef = useRef<FlatList>(null)

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

    const flashMediaScroll = () => {
        setTimeout(() => {
            mediasRef.current?.scrollToIndex({ index: 1, viewOffset: image_width * 0.7 })
            setTimeout(() => mediasRef.current?.scrollToIndex({ index: 0, viewOffset: 20 }), 200)
        }, 500)
    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, gap: 10 }}
        >
            <ScreenTitle title="Nova lição" />

            <FlatList
                ref={mediasRef}
                horizontal
                data={[
                    { media: media, setMedia: setMedia, thumb: false },
                    { media: thumb, setMedia: setThumb, thumb: true },
                ]}
                renderItem={({ item }) => <LessonMediaForm media={item.media} setMedia={item.setMedia} thumb={item.thumb} />}
                style={{ marginHorizontal: -20 }}
                contentContainerStyle={{ gap: 10, height: max_image_height, paddingHorizontal: 20 }}
                showsHorizontalScrollIndicator={false}
                onLayout={flashMediaScroll}
            />

            <FormText formik={formik} name="name" label={"Título"} />
            <FormText formik={formik} name="info" label={"Descrição"} multiline numberOfLines={5} />
            <Button loading={loading} mode="contained" onPress={() => formik.handleSubmit()} disabled={loading}>
                Enviar
            </Button>
        </ScrollView>
    )
}

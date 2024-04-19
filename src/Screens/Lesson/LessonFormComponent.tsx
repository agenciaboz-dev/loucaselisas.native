import { NavigationProp, RouteProp } from "@react-navigation/native"
import React, { useEffect, useRef, useState } from "react"
import { Dimensions, FlatList, ScrollView, View } from "react-native"
import { ScreenTitle } from "../../components/ScreenTItle"
import { useFormik } from "formik"
import { Lesson, LessonForm } from "../../types/server/class/Course/Lesson"
import { MediaForm } from "../../types/server/class/Gallery/Media"
import { Button } from "../../components/Button"
import { Text, useTheme } from "react-native-paper"
import { FormText } from "../../components/FormText"
import { api } from "../../backend/api"
import { useSnackbar } from "../../hooks/useSnackbar"
import { LessonMediaForm } from "./LessonMediaForm"
import * as Yup from "yup"
import { validationErrors } from "../../tools/validationErrors"

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

    const [media, setMedia] = useState<MediaForm | null>(null)
    const [thumb, setThumb] = useState<MediaForm | null>(null)
    const [loading, setLoading] = useState(false)
    const [mediaError, setMediaError] = useState("")

    const validation_schema = Yup.object({
        name: Yup.string().required(validationErrors.required),
        info: Yup.string().required(validationErrors.required),
    })

    const formik = useFormik<LessonForm>({
        initialValues: {
            media: { height: 1, id: "", name: "", position: 1, type: "VIDEO", url: "", width: 1 },
            thumb: { name: "" },
            name: "",
            info: "",
            pdf: null,
            course_id: course_id || "",
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
                const response = lesson ? await api.patch("/lesson", { ...data, id: lesson.id }) : await api.post("/lesson", data)
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
        setTimeout(() => {
            mediasRef.current?.scrollToIndex({ index: 1, viewOffset: image_width * 0.7 })
            setTimeout(() => mediasRef.current?.scrollToIndex({ index: 0, viewOffset: 20 }), 200)
        }, 500)
    }

    const preSubmit = () => {
        formik.validateForm()

        console.log({ media, thumb })
        if (!thumb && !media) setMediaError("Insira uma mídia e thumbnail")
        if (!thumb && media) setMediaError("Thumbnail é obrigatória")
        if (thumb && !media) setMediaError("Insira uma mídia")

        if (thumb && media) formik.handleSubmit()
    }

    useEffect(() => {
        if (media) {
            setTimeout(() => mediasRef.current?.scrollToIndex({ index: 1, viewOffset: 20 }), 1000)
        }
    }, [media])

    useEffect(() => {
        if (lesson) {
            setMedia({ ...lesson.media, name: "" })
            setThumb({ url: lesson.thumb || undefined, height: 1, name: "", position: 1, type: "IMAGE", width: 1 })
            formik.setFieldValue("name", lesson.name)
            formik.setFieldValue("info", lesson.info)
        }
    }, [lesson])

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
            {mediaError && <Text style={{ color: "red" }}>{mediaError}</Text>}

            <FormText formik={formik} name="name" label={"Título"} />
            <FormText formik={formik} name="info" label={"Descrição"} multiline numberOfLines={5} style={{ paddingVertical: 15 }} />
            <Button loading={loading} mode="contained" onPress={() => preSubmit()} disabled={loading}>
                Enviar
            </Button>
        </ScrollView>
    )
}

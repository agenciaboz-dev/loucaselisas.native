import { NavigationProp, RouteProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useEffect, useRef, useState } from "react"
import {
    Keyboard,
    KeyboardAvoidingView,
    LayoutAnimation,
    Platform,
    ScrollView,
    TextInput,
    View,
    ViewStyle,
} from "react-native"
import { ScreenTitle } from "../../components/ScreenTItle"
import { useFormik } from "formik"
import { Course, CourseForm, CoverForm } from "../../types/server/class/Course"
import { useUser } from "../../hooks/useUser"
import * as Yup from "yup"
import { FormText } from "../../components/FormText"
import { MentionInput, MentionSuggestionsProps, Suggestion } from "react-native-controlled-mentions"
import { Creator } from "../../types/server/class"
import { api } from "../../backend/api"
import { Checkbox, Surface, Text, TouchableRipple, useTheme, TextInput as PaperInput, IconButton } from "react-native-paper"
import { dropdown_style } from "../../style/dropdown_style"
import { Dropdown, IDropdownRef } from "react-native-element-dropdown"
import { Category } from "../../types/server/class/Category"
import fetchLists from "../../tools/fetchLists"
import { currencyMask } from "../../tools/currencyMask"
import { unmaskCurrency } from "../../tools/unmaskCurrency"
import { Button } from "../../components/Button"
import { useSnackbar } from "../../hooks/useSnackbar"
import { GalleryFormComponent } from "./GalleryForm"
import { ImagePickerAsset } from "expo-image-picker"
import { FileUpload } from "../../types/server/class/helpers"
import { GalleryForm } from "../../types/server/class/Gallery/Gallery"
import unmask from "../../tools/unmask"
import { Image, ImageStyle } from "expo-image"
import { ResizeMode, Video } from "expo-av"
import { colors } from "../../style/colors"
import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"
import { pickMedia } from "../../tools/pickMedia"
import placeholders from "../../tools/placeholders"
import { LabeledComponent } from "../../components/LabeledComponent"
import { validationErrors } from "../../tools/validationErrors"
import { DeclinedWarning } from "../Creator/ManageCourse/DeclinedWarning"

interface CourseFormProps {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>
}

export const CourseFormComponent: React.FC<CourseFormProps> = ({ navigation, route }) => {
    const theme = useTheme()
    const { user } = useUser()
    const creator = user?.creator!
    const { snackbar } = useSnackbar()
    const course = (route.params?.course as Course) || undefined
    const add_media_button_style: ViewStyle = { borderStyle: "dashed", justifyContent: "center", alignItems: "center" }
    const image_style: ImageStyle = { width: "100%", aspectRatio: "16/9", borderRadius: 15 }

    const [loading, setLoading] = useState(false)
    const [availableCreators, setAvailableCreators] = useState<Creator[]>([])
    const [availableCategories, setAvailableCategories] = useState<Category[]>([])

    const [participants, setParticipants] = useState<Creator[]>([])
    const [participantsText, setParticipantsText] = useState("")

    const [categories, setCategories] = useState<Category[]>([])
    const [gallery, setGallery] = useState<GalleryForm>({ media: [], name: "" })
    const [cover, setCover] = useState<CoverForm>()

    const courseSchema = Yup.object().shape({
        description: Yup.string().required(validationErrors.required),
        name: Yup.string().required(validationErrors.required).max(35, "Máximo de caracteres ultrapassado."),
    })

    const formik = useFormik<CourseForm>({
        initialValues: {
            id: undefined,
            categories: [],
            creators: [],
            description: "",
            gallery: { media: [], name: "Galeria do curso" },
            language: "pt-br",
            name: "",
            owner_id: creator.id,
            recorder: "",
            lessons: [],
            status: "pending",
        },
        async onSubmit(values, formikHelpers) {
            if (loading) return
            setLoading(true)
            const data: CourseForm = {
                ...values,
                categories: categories.map((item) => ({ id: item.id })),
                creators: participants.map((item) => ({ id: item.id })),
                recorder: participantsText,
                cover,
                gallery: { ...gallery, name: gallery.name || "Galeria 1" },
            }
            console.log(data)
            try {
                const response = course ? await api.patch("/course", data) : await api.post("/course", data)
                snackbar("solicitação enviada com sucesso")
                navigation.goBack()
            } catch (error) {
                console.log(error)
                snackbar("erro ao processar curso")
            } finally {
                setLoading(false)
            }
        },
        validationSchema: courseSchema,
        validateOnChange: false,
        validateOnMount: false,
    })

    const input_refs = Object.entries(formik.values).map(([key, value]) => useRef<TextInput>(null))

    const focusInput = (index: number) => {
        const ref = input_refs[index].current
        ref?.focus()
    }

    const handleCategoryPress = (category: Category) => {
        const selected = categories.find((item) => item.id == category.id)
        setCategories(selected ? categories.filter((item) => item.id != category.id) : [...categories, category])
    }

    const renderSuggestions: React.FC<MentionSuggestionsProps> = ({ keyword, onSuggestionPress }) => {
        if (keyword == null) {
            return null
        }

        const onCreatorPress = (item: Creator) => {
            onSuggestionPress({ id: item.id, name: item.nickname })
            const new_participants = [...participants]
            new_participants.push(item)
            setParticipants(new_participants)
        }

        return (
            <Surface
                style={{
                    position: "absolute",
                    top: 50,
                    width: "100%",
                    backgroundColor: theme.colors.elevation.level5,
                    borderRadius: 15,
                    paddingVertical: 10,
                    zIndex: 90,
                }}
            >
                <View
                    style={{
                        borderTopWidth: 0,
                        width: 0,
                        height: 0,
                        position: "absolute",
                        left: 15,
                        top: -10,
                        borderBottomColor: theme.colors.elevation.level5,
                        borderLeftColor: "transparent",
                        borderRightColor: "transparent",
                        borderBottomWidth: 10,
                        borderRightWidth: 10,
                        borderLeftWidth: 10,
                    }}
                ></View>
                {availableCreators
                    .filter((item) => !participants.find((creat) => creat.id == item.id))
                    .filter((item) => item.nickname.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()))
                    .map((item) => (
                        <TouchableRipple
                            key={item.id}
                            onPress={() => onCreatorPress(item)}
                            style={{
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                flexDirection: "row",
                                gap: 10,
                                alignItems: "center",
                            }}
                        >
                            <>
                                <Image
                                    source={item.image || placeholders.avatar}
                                    contentFit="cover"
                                    style={{ borderRadius: 100, width: 40, aspectRatio: "1/1" }}
                                />
                                <Text>{item.nickname}</Text>
                            </>
                        </TouchableRipple>
                    ))}
            </Surface>
        )
    }

    const fetchData = async () => {
        setAvailableCreators(await fetchLists.creators())
        setAvailableCategories(await fetchLists.categories())
    }

    const pickCover = async () => {
        const result = await pickMedia([16, 9])
        if (result) {
            const media = result[0]
            const filename = media?.uri.substring(media?.uri.lastIndexOf("/") + 1, media?.uri.length) || "cover"
            if (media?.base64) {
                setCover({ type: "image", file: { name: filename, base64: media.base64 } })
            } else if (media?.type == "video") {
                const base64video = await FileSystem.readAsStringAsync(media.uri, {
                    encoding: "base64",
                })
                setCover({ type: "video", file: { name: filename, base64: base64video } })
            }
        }
    }

    useEffect(() => {
        console.log({ participants })
        const regex = /@\[[^\]]+\]\(([^)]+)\)/g
        let ids: string[] = []
        let match
        while ((match = regex.exec(participantsText)) !== null) {
            ids.push(match[1])
        }
        // deleting from participants if deleted on textfield
        participants.forEach((item) => {
            if (!ids.includes(item.id)) {
                console.log(ids)
                console.log(item.id)
                setParticipants((participants) => participants.filter((creat) => creat.id != item.id))
            }
        })
    }, [participantsText, participants])

    useFocusEffect(
        useCallback(() => {
            fetchData()

            if (course) {
                formik.setFieldValue("id", course.id)
                formik.setFieldValue("name", course.name)
                formik.setFieldValue("language", course.language)
                formik.setFieldValue("description", course.description)
                setParticipantsText(course.recorder || "")
                setGallery({ ...course.gallery, media: course.gallery.media.map((item) => ({ ...item, name: item.url })) })
                setCover({ file: { name: course.cover }, type: course.cover_type, url: course.cover })
                setCategories(course.categories)
            }
        }, [])
    )

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
            keyboardVerticalOffset={Platform.OS === "ios" ? -500 : 0}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                    gap: 10,
                    paddingBottom: 10,
                    // position: iosKeyboard ? "relative" : "relative",
                    bottom: iosKeyboard ? 190 : 0,
                }}
            >
                <ScreenTitle title={course ? course.name : "Novo Curso"} />
                {course?.status == "declined" && (
                    <Surface style={{ padding: 10, borderRadius: 20, gap: 10 }}>
                        <DeclinedWarning />
                        <Text variant="headlineMedium" style={{ color: theme.colors.tertiary }}>
                            Motivo da reprovação
                        </Text>

                        <Text style={{ color: theme.colors.tertiary }}>{course.declined_reason}</Text>
                    </Surface>
                )}
                {cover ? (
                    <Surface style={{ position: "relative", borderRadius: 15 }}>
                        {cover.type == "image" ? (
                            <Image source={{ uri: cover.url || "data:image/png;base64," + cover.file.base64 }} style={image_style} />
                        ) : (
                            <Video
                                source={{ uri: cover.url || "data:video/mp4;base64," + cover.file.base64 }}
                                style={image_style}
                                resizeMode={ResizeMode.COVER}
                                shouldPlay
                                isLooping
                                useNativeControls={false}
                                isMuted
                            />
                        )}
                        <IconButton
                            icon={"image-edit"}
                            style={{ position: "absolute", right: 0, top: 0, backgroundColor: colors.secondary }}
                            iconColor={colors.primary}
                            onPress={pickCover}
                        />
                    </Surface>
                ) : (
                    <Button mode="outlined" style={add_media_button_style} contentStyle={image_style} onPress={pickCover}>
                        Capa
                    </Button>
                )}
                <GalleryFormComponent gallery={gallery} setGallery={setGallery} cover={cover} setCover={setCover} />
                <FormText formik={formik} name="name" label={"Nome do curso"} ref={input_refs[0]} onSubmitEditing={() => focusInput(1)} transparent />
                <LabeledComponent
                    label={"Participantes"}
                    Component={
                        <MentionInput
                            inputRef={input_refs[1]}
                            placeholder="Participantes"
                            placeholderTextColor={theme.colors.primary}
                            value={participantsText}
                            onChange={setParticipantsText}
                            multiline={false}
                            style={[dropdown_style, { flex: 0 }]}
                            keyboardType="email-address"
                            partTypes={[
                                {
                                    trigger: "@",
                                    renderSuggestions,
                                    textStyle: { fontWeight: "bold", color: theme.colors.tertiary },
                                    isBottomMentionSuggestionsRender: true,
                                    isInsertSpaceAfterMention: true,
                                },
                            ]}
                            onSubmitEditing={() => focusInput(2)}
                            returnKeyType={"next"}
                        />
                    }
                />
                <LabeledComponent
                    label="Idioma"
                    Component={
                        <Dropdown
                            data={[
                                { label: "Português", value: "pt-br" },
                                { label: "Inglês", value: "en-us" },
                            ]}
                            labelField="label"
                            onChange={(item) => formik.setFieldValue("language", item.value)}
                            valueField="value"
                            value={formik.values.language}
                            style={dropdown_style}
                            placeholderStyle={{ color: theme.colors.onSurfaceVariant }}
                        />
                    }
                />
                <LabeledComponent
                    label="Categorias"
                    Component={
                        <Dropdown
                            data={availableCategories}
                            labelField="name"
                            onChange={(item) => handleCategoryPress(item)}
                            valueField="id"
                            value={categories.map((item) => item.name).join(", ")}
                            style={[dropdown_style]}
                            placeholderStyle={{ color: theme.colors.onSurfaceVariant }}
                            containerStyle={{ paddingVertical: 10 }}
                            placeholder=""
                            renderItem={(category, selected) => (
                                <TouchableRipple
                                    style={{
                                        flex: 1,
                                        paddingHorizontal: 10,
                                        paddingVertical: 10,
                                        flexDirection: "row",
                                        alignItems: "center",
                                        gap: 5,
                                    }}
                                    onPress={(ev) => {
                                        ev.preventDefault()
                                        handleCategoryPress(category)
                                    }}
                                >
                                    <>
                                        <Checkbox status={categories.find((item) => item.id == category.id) ? "checked" : "unchecked"} />
                                        <Text style={{}}>{category.name}</Text>
                                    </>
                                </TouchableRipple>
                            )}
                        />
                    }
                />
                <FormText
                    formik={formik}
                    name="description"
                    label={"Descrição"}
                    ref={input_refs[5]}
                    onSubmitEditing={() => focusInput(6)}
                    multiline
                    numberOfLines={5}
                    transparent
                />

                <Button mode="contained" style={{}} loading={loading} onPress={() => formik.handleSubmit()}>
                    Enviar para análise
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

import { NavigationProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ScrollView, TextInput, View } from "react-native"
import { ScreenTitle } from "../../components/ScreenTItle"
import { useFormik } from "formik"
import { CourseForm } from "../../types/server/class/Course"
import { useUser } from "../../hooks/useUser"
import * as Yup from "yup"
import { FormText } from "../../components/FormText"
import { MentionInput, MentionSuggestionsProps, Suggestion } from "react-native-controlled-mentions"
import { Creator } from "../../types/server/class"
import { api } from "../../backend/api"
import { Checkbox, Surface, Text, TouchableRipple, useTheme, TextInput as PaperInput } from "react-native-paper"
import { dropdown_style } from "../../style/dropdown_style"
import { Dropdown, IDropdownRef } from "react-native-element-dropdown"
import { Category } from "../../types/server/class/Category"
import fetchLists from "../../tools/fetchLists"
import { currencyMask } from "../../tools/currencyMask"
import { unmaskCurrency } from "../../tools/unmaskCurrency"
import { Button } from "../../components/Button"
import { useSnackbar } from "../../hooks/useSnackbar"
import { GalleryForm } from "../../types/server/class/Gallery"
import { GalleryFormComponent } from "./GalleryForm"
import { ImagePickerAsset } from "expo-image-picker"
import { FileUpload } from "../../types/server/class/helpers"

interface CourseFormProps {
    navigation: NavigationProp<any, any>
}

export const CourseFormComponent: React.FC<CourseFormProps> = ({ navigation }) => {
    const theme = useTheme()
    const { user, setUser } = useUser()
    const creator = user?.creator!
    const { snackbar } = useSnackbar()

    const [loading, setLoading] = useState(false)
    const [availableCreators, setAvailableCreators] = useState<Creator[]>([])
    const [availableCategories, setAvailableCategories] = useState<Category[]>([])

    const [participants, setParticipants] = useState<Creator[]>([])
    const [participantsText, setParticipantsText] = useState("")

    const [categories, setCategories] = useState<Category[]>([])
    const [gallery, setGallery] = useState<GalleryForm>({ images: [], videos: [], name: "" })
    const [cover, setCover] = useState<FileUpload | null>(null)

    const required_field_message = "Campo obrigatório."

    const courseSchema = Yup.object().shape({
        description: Yup.string().required(required_field_message),
        name: Yup.string().required(required_field_message),
        price: Yup.number()
            .moreThan(0, required_field_message)
            .required(required_field_message)
            .test("is-decimal", "Preço inválido. Permitido apenas números e até 2 casas decimais.", (value) => {
                // Replace comma with dot to validate as a number
                const numberValue = value.toString().replace(",", ".")
                // Validate only if the input can be converted to a valid number
                return !isNaN(parseFloat(numberValue)) && /^\d+(\,\d{0,2}|\.\d{0,2})?$/.test(value.toString())
            }),
    })

    const formik = useFormik<CourseForm>({
        initialValues: {
            categories: [],
            creators: [],
            description: "",
            gallery: { images: [], name: "Primeira galeria", videos: [] },
            language: "pt-br",
            name: "",
            owner_id: creator.id,
            recorder: "",
            lessons: [],
            price: 0,
        },
        async onSubmit(values, formikHelpers) {
            console.log("asdoais")
            if (loading) return
            setLoading(true)
            const data: CourseForm = {
                ...values,
                categories: categories.map((item) => ({ id: item.id })),
                creators: participants.map((item) => ({ id: item.id })),
                recorder: participantsText,
                price: unmaskCurrency(values.price),
            }
            console.log(data)
            try {
                const response = await api.post("/course", data)
                setUser(response.data)
                snackbar("curso criado com sucesso")
                navigation.goBack()
            } catch (error) {
                console.log(error)
                snackbar("erro ao criar curso")
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
            new_participants.push(creator)
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
                        <TouchableRipple key={item.id} onPress={() => onCreatorPress(item)} style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                            <Text>{item.nickname}</Text>
                        </TouchableRipple>
                    ))}
            </Surface>
        )
    }

    const fetchData = async () => {
        setAvailableCreators(await fetchLists.creators())
        setAvailableCategories(await fetchLists.categories())
    }

    useEffect(() => {
        console.log(availableCategories)
    }, [availableCategories])

    useEffect(() => {
        // deleting from participants if deleted on textfield
        participants.forEach((item) => {
            if (!participantsText.includes(item.nickname)) {
                setParticipants((participants) => participants.filter((creat) => creat.id != item.id))
            }
        })
    }, [participantsText, participants])

    useFocusEffect(
        useCallback(() => {
            fetchData()
        }, [])
    )

    return (
        <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20, gap: 10 }}
        >
            <ScreenTitle title="Novo Curso" />

            <FormText formik={formik} name="name" label={"Nome do curso"} ref={input_refs[0]} onSubmitEditing={() => focusInput(1)} transparent />
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
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
                <FormText
                    formik={formik}
                    name="price"
                    label={"Preço sugerido"}
                    ref={input_refs[2]}
                    onSubmitEditing={() => focusInput(3)}
                    left={<PaperInput.Affix text="R$" />}
                    keyboardType="decimal-pad"
                    style={{ minWidth: 170 }}
                    transparent
                />
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
                    placeholder="Idioma"
                    placeholderStyle={{ color: theme.colors.onSurfaceVariant }}
                />
            </View>
            <Dropdown
                data={availableCategories}
                labelField="name"
                onChange={(item) => handleCategoryPress(item)}
                valueField="id"
                value={categories.map((item) => item.name).join(", ")}
                style={[dropdown_style]}
                placeholderStyle={{ color: theme.colors.onSurfaceVariant }}
                containerStyle={{ paddingVertical: 10 }}
                placeholder="Categorias"
                renderItem={(category, selected) => (
                    <TouchableRipple
                        style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 5 }}
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
            <GalleryFormComponent gallery={gallery} setGallery={setGallery} cover={cover} setCover={setCover} />
            <Button mode="contained" style={{ alignSelf: "center" }} loading={loading} onPress={() => formik.handleSubmit()}>
                Enviar para análise
            </Button>
        </ScrollView>
    )
}

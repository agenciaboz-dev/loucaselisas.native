import React, { useEffect, useRef, useState } from "react"
import { Icon, Surface, Text, TextInput as PaperInput, Avatar, useTheme } from "react-native-paper"
import { useSignupSchema } from "../hooks/useSignupSchema"
import { User, UserForm } from "../types/server/class"
import { useFormik } from "formik"
import unmask from "../tools/unmask"
import { api } from "../backend/api"
import { AxiosError } from "axios"
import { useSnackbar } from "../hooks/useSnackbar"
import { Keyboard, LayoutAnimation, Platform, Pressable, ScrollView, TextInput, View } from "react-native"
import { Dropdown, IDropdownRef } from "react-native-element-dropdown"
import { colors } from "../style/colors"
import { FormText } from "./FormText"
import { dropdown_style } from "../style/dropdown_style"
import { estados } from "../tools/estadosBrasil"
import { Button } from "./Button"
import DatePicker from "react-native-date-picker"
import { mask } from "react-native-mask-text"
import { LabeledComponent } from "./LabeledComponent"
import { useUser } from "../hooks/useUser"

interface UserFormProps {
    user?: User
    externalData?: Partial<UserForm>
    submitLabel: string

    onSubmit: (user: User) => void
}

export const UserFormComponent: React.FC<UserFormProps> = ({ user, onSubmit, externalData, submitLabel }) => {
    const theme = useTheme()
    const schema = useSignupSchema()
    const { snackbar } = useSnackbar()
    const { expoPushToken } = useUser()

    const [selectDate, setSelectDate] = useState(false)
    const [loading, setLoading] = useState(false)

    const eighteen_years_behind = new Date(new Date().getFullYear() - 18, new Date().getMonth() - 1, new Date().getDate())

    const formik = useFormik<UserForm>({
        initialValues: {
            bio: "",
            birth: "",
            cover: null,
            cpf: "",
            creator: null,
            email: "",
            google_id: null,
            google_token: null,
            image: null,
            instagram: "",
            name: "",
            password: "",
            payment_cards: [],
            phone: "",
            profession: "",
            pronoun: "",
            student: true,
            tiktok: "",
            uf: "",
            username: "",
            expoPushToken: [expoPushToken],
        },
        async onSubmit(values, formikHelpers) {
            if (loading) return
            setLoading(true)

            const data: UserForm = {
                ...values,
                cpf: unmask(values.cpf),
                phone: unmask(values.phone),
                ...externalData,
            }

            try {
                const response = user
                    ? await api.patch("/user", { ...data, image: undefined, cover: undefined, bio: undefined, id: user.id })
                    : await api.post("/signup", data)
                const responded_user = response.data
                if (responded_user) {
                    onSubmit(responded_user)
                }
            } catch (error) {
                console.log(error)
                if (error instanceof AxiosError) {
                    const message = error.response?.data
                    snackbar("Erro: " + message)
                }
            } finally {
                setLoading(false)
            }
        },
        validationSchema: schema,
        validateOnChange: false,
        validateOnMount: false,
    })

    const input_refs = Object.entries(formik.values).map(([key, value]) => useRef<TextInput>(null))
    const dropdown_refs = Object.entries(formik.values).map(([key, value]) => useRef<IDropdownRef>(null))
    const focusInput = (index: number) => {
        const ref = input_refs[index].current || dropdown_refs[index].current

        if (ref) {
            try {
                // @ts-ignore
                ref.focus()
            } catch (error) {
                // @ts-ignore
                ref.open()
            }
        }
    }

    const handleDateChange = (date?: Date) => {
        formik.setFieldValue("birth", date?.getTime().toString() || "")
        setSelectDate(false)
        setTimeout(() => formik.validateField("birth"), 500)
    }

    useEffect(() => {
        if (user) {
            formik.setFieldValue("name", user.name)
            formik.setFieldValue("cpf", mask(user.cpf, "999.999.999-99"))
            formik.setFieldValue("username", user.username)
            formik.setFieldValue("email", user.email)
            formik.setFieldValue("password", user.password)
            formik.setFieldValue("pronoun", user.pronoun)
            formik.setFieldValue("birth", user.birth)
            formik.setFieldValue("profession", user.profession)
            formik.setFieldValue("phone", mask(user.phone, "(99) 9 9999-9999"))
            formik.setFieldValue("uf", user.uf)
            formik.setFieldValue("instagram", user.instagram)
            formik.setFieldValue("tiktok", user.tiktok)
        }
    }, [])

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
        <View style={{ flex: 1, gap: 20, marginHorizontal: -20, paddingHorizontal: 20, bottom: iosKeyboard ? 120 : 0 }}>
            <Surface elevation={2} style={{ padding: 10, borderRadius: 20, gap: 10 }}>
                <FormText
                    ref={input_refs[0]}
                    name="name"
                    label={"Nome completo"}
                    onSubmitEditing={() => focusInput(1)}
                    formik={formik}
                    autoCapitalize="words"
                />
                <FormText
                    ref={input_refs[1]}
                    name="cpf"
                    label={"CPF"}
                    mask={"999.999.999-99"}
                    formik={formik}
                    autoCapitalize={"none"}
                    onSubmitEditing={() => focusInput(2)}
                    keyboardType="numeric"
                    disabled={!!user}
                />
                <FormText
                    ref={input_refs[2]}
                    formik={formik}
                    label={"Nome de Usuário"}
                    name="username"
                    autoCapitalize={"none"}
                    onSubmitEditing={() => focusInput(3)}
                    left={<PaperInput.Icon icon="at" />}
                    keyboardType="twitter"
                    disabled={!!user}
                />
                <FormText
                    ref={input_refs[3]}
                    name="email"
                    formik={formik}
                    label={"E-mail"}
                    keyboardType="email-address"
                    autoCapitalize={"none"}
                    onSubmitEditing={() => focusInput(4)}
                />
                <FormText
                    ref={input_refs[4]}
                    name="password"
                    formik={formik}
                    label={"Senha"}
                    autoCapitalize={"none"}
                    secureTextEntry
                    onSubmitEditing={() => focusInput(5)}
                />
                <LabeledComponent
                    label="Pronome"
                    Component={
                        <Dropdown
                            ref={dropdown_refs[5]}
                            data={[
                                { label: "Ele/dele", value: "him" },
                                { label: "Ela/dela", value: "her" },
                            ]}
                            placeholder=""
                            labelField="label"
                            onChange={(item) => formik.setFieldValue("pronoun", item.value)}
                            valueField="value"
                            value={formik.values.pronoun}
                            style={dropdown_style}
                            placeholderStyle={{ color: theme.colors.onSurfaceVariant }}
                        />
                    }
                />
                <Pressable onPress={() => setSelectDate(true)} style={{ flex: 1.28 }}>
                    <FormText
                        ref={input_refs[6]}
                        label={"Data de nascimento"}
                        name="birth"
                        formik={formik}
                        onSubmitEditing={() => focusInput(6)}
                        readOnly
                        flex={1}
                        right={<PaperInput.Icon icon={"calendar-range"} pointerEvents="none" />}
                        value={formik.values.birth ? new Date(Number(formik.values.birth)).toLocaleDateString("pt-br") : ""}
                    />
                </Pressable>
                <FormText ref={input_refs[7]} name="profession" formik={formik} label={"Profissão"} onSubmitEditing={() => focusInput(8)} />
                <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
                    <FormText
                        ref={input_refs[8]}
                        name="phone"
                        formik={formik}
                        label={"Telefone"}
                        onSubmitEditing={() => focusInput(9)}
                        keyboardType="number-pad"
                        style={{ flex: 1, minWidth: 170 }}
                        maxLength={16}
                        mask={"(99) 9 9999-9999"}
                    />
                    <LabeledComponent
                        label="Estado"
                        Component={
                            <Dropdown
                                placeholder=""
                                ref={dropdown_refs[9]}
                                data={estados.reverse()}
                                labelField="label"
                                onChange={(item) => formik.setFieldValue("uf", item.value)}
                                valueField="value"
                                value={formik.values.uf}
                                style={[dropdown_style]}
                                dropdownPosition="top"
                                placeholderStyle={{ color: theme.colors.onSurfaceVariant }}
                            />
                        }
                    />
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <FormText
                        ref={input_refs[10]}
                        name="instagram"
                        formik={formik}
                        label={"Instagram"}
                        onSubmitEditing={() => focusInput(11)}
                        keyboardType="twitter"
                        autoCapitalize="none"
                        left={<PaperInput.Icon icon="at" />}
                        flex={1}
                    />
                    <FormText
                        ref={input_refs[11]}
                        name="tiktok"
                        formik={formik}
                        label={"Tiktok"}
                        keyboardType="twitter"
                        returnKeyType="done"
                        autoCapitalize="none"
                        flex={1}
                        left={<PaperInput.Icon icon="at" />}
                    />
                </View>
            </Surface>

            <Button mode="contained" onPress={() => formik.handleSubmit()} style={{ marginBottom: 30 }} loading={loading}>
                {submitLabel}
            </Button>

            <DatePicker
                modal
                open={selectDate}
                date={formik.values.birth ? new Date(Number(formik.values.birth)) : eighteen_years_behind}
                onConfirm={(date) => handleDateChange(date)}
                onCancel={() => setSelectDate(false)}
                mode="date"
                locale="pt-BR"
                title={"Data de nascimento"}
                cancelText="Cancelar"
                confirmText="Confirmar"
                theme="light"
            />
        </View>
    )
}

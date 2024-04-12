import { useFormik } from "formik"
import React, { useRef, useState } from "react"
import { Icon, Surface, Text, TextInput as PaperInput } from "react-native-paper"
import { UserForm } from "../../types/server/class"
import { colors } from "../../style/colors"
import { FormText } from "../../components/FormText"
import { KeyboardAvoidingView, Pressable, TextInput, View } from "react-native"
import { Dropdown, IDropdownRef } from "react-native-element-dropdown"
import DatePicker from "react-native-date-picker"
import { estados } from "../../tools/estadosBrasil"
import { dropdown_style } from "../../style/dropdown_style"
import { Button } from "../../components/Button"
import { mask } from "react-native-mask-text"
import * as Yup from "yup"
import { useSignupSchema } from "../../hooks/useSignupSchema"

interface SignupProps {}

export const Signup: React.FC<SignupProps> = ({}) => {
    const schema = useSignupSchema()

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
        },
        onSubmit(values, formikHelpers) {
            if (loading) return
            console.log(values)
            setLoading(true)
            setTimeout(() => setLoading(false), 2000)
        },
        validationSchema: schema,
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
    }

    return (
        <KeyboardAvoidingView behavior="height" style={{ flex: 1, padding: 20, paddingTop: 100, gap: 30 }}>
            <Surface style={{ backgroundColor: colors.box, padding: 20, borderRadius: 20, gap: 10 }}>
                <FormText ref={input_refs[0]} name="name" label={"Nome completo"} onSubmitEditing={() => focusInput(1)} formik={formik} />
                <FormText
                    ref={input_refs[1]}
                    name="cpf"
                    label={"CPF"}
                    mask={"999.999.999-99"}
                    formik={formik}
                    autoCapitalize={"none"}
                    onSubmitEditing={() => focusInput(2)}
                    keyboardType="numeric"
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
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <Dropdown
                        ref={dropdown_refs[5]}
                        data={[
                            { label: "Ele/dele", value: "him" },
                            { label: "Ela/dela", value: "her" },
                        ]}
                        labelField="label"
                        onChange={(item) => formik.setFieldValue("pronoun", item.value)}
                        valueField="value"
                        value={formik.values.pronoun}
                        style={dropdown_style}
                        placeholder="Pronome"
                    />
                    <Pressable onPress={() => setSelectDate(true)} style={{ flex: 1.28 }}>
                        <FormText
                            ref={input_refs[6]}
                            label={"Data de nascimento"}
                            name="birth"
                            formik={formik}
                            onSubmitEditing={() => focusInput(6)}
                            readOnly
                            right={<PaperInput.Icon icon={"calendar-range"} pointerEvents="none" />}
                        />
                    </Pressable>
                </View>
                <FormText ref={input_refs[7]} name="profession" formik={formik} label={"Profissão"} onSubmitEditing={() => focusInput(8)} />
                <View style={{ flexDirection: "row", gap: 10, width: "100%", minHeight: formik.errors.phone ? 65 : undefined }}>
                    <FormText
                        ref={input_refs[8]}
                        name="phone"
                        formik={formik}
                        label={"Telefone"}
                        onSubmitEditing={() => focusInput(9)}
                        keyboardType="number-pad"
                        style={{ flex: 1, minWidth: 156.5 }}
                        maxLength={16}
                    />
                    <Dropdown
                        ref={dropdown_refs[9]}
                        data={estados}
                        labelField="label"
                        onChange={(item) => formik.setFieldValue("uf", item.value)}
                        valueField="value"
                        value={formik.values.uf}
                        style={[dropdown_style]}
                        placeholder="Estado"
                    />
                </View>
                <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
                    <FormText
                        ref={input_refs[10]}
                        name="instagram"
                        formik={formik}
                        label={"Instagram"}
                        onSubmitEditing={() => focusInput(11)}
                        keyboardType="twitter"
                        autoCapitalize="none"
                        style={{ width: "100%" }}
                        left={<PaperInput.Icon icon="at" />}
                    />
                    <FormText
                        ref={input_refs[11]}
                        name="tiktok"
                        formik={formik}
                        label={"Tiktok"}
                        keyboardType="twitter"
                        returnKeyType="done"
                        autoCapitalize="none"
                        style={{ width: "120%" }}
                        left={<PaperInput.Icon icon="at" />}
                    />
                </View>
            </Surface>

            <Button mode="contained" onPress={() => formik.handleSubmit()} style={{ width: 200, alignSelf: "center" }} loading={loading}>
                Cadastrar-se
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
                maximumDate={eighteen_years_behind}
            />
        </KeyboardAvoidingView>
    )
}

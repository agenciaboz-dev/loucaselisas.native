import { NavigationProp, useFocusEffect, useRoute } from "@react-navigation/native"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { RadioButton, Surface, Text, useTheme } from "react-native-paper"
import { ScreenTitle } from "../../../../components/ScreenTItle"
import { useFormik } from "formik"
import { PaymentCard, PaymentCardForm } from "../../../../types/server/class/PaymentCard"
import * as Yup from "yup"
import { FormText } from "../../../../components/FormText"
import { Alert, Keyboard, LayoutAnimation, Platform, ScrollView, TextInput, View } from "react-native"
import { Button } from "../../../../components/Button"
import { useUser } from "../../../../hooks/useUser"
import { PartialUser } from "../../../../types/server/class/User"
import unmask from "../../../../tools/unmask"
import { api } from "../../../../backend/api"
import { useSnackbar } from "../../../../hooks/useSnackbar"
import { mask } from "react-native-mask-text"
import { validationErrors } from "../../../../tools/validationErrors"

interface CardFormProps {
    navigation: NavigationProp<any, any>
}

export const CardForm: React.FC<CardFormProps> = ({ navigation }) => {
    const { user } = useUser()
    const { snackbar } = useSnackbar()
    const route = useRoute<any>()
    const card = route.params?.card as PaymentCard | undefined
    const theme = useTheme()

    const [loading, setLoading] = useState(false)

    const creditCardSchema = Yup.object().shape({
        number: Yup.string()
            .required(validationErrors.required)
            .matches(/^(?:\d{4} ){3}\d{4}$/, "O número do cartão está em um formato inválido."),
        validity: Yup.string()
            .required("A data de validade é obrigatória.")
            .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "A data de validade deve estar no formato MM/AA."),
        cvc: Yup.string()
            .required(validationErrors.required)
            .matches(/^\d{3}$/, "O CVC deve conter 3 dígitos."),
        owner: Yup.string()
            .required(validationErrors.required)
            .matches(/^[^\s]+(\s+[^\s]+)+$/, "Insira o nome e o sobrenome do titular.")
            .test("two-words", "Insira pelo menos dois nomes.", (value) => {
                return !!(value && value.trim().split(/\s+/).length >= 2)
            }),
    })

    const formik = useFormik<PaymentCardForm>({
        initialValues: {
            cvc: "",
            id: 0,
            number: "",
            owner: "",
            type: "CREDIT",
            validity: "",
            bank: null,
            flag: null,
            user_id: user!.id,
        },
        validateOnChange: false,
        validateOnMount: false,
        validationSchema: creditCardSchema,

        async onSubmit(values, formikHelpers) {
            if (!user || loading) return
            setLoading(true)

            const data: PaymentCardForm = {
                ...values,
                number: unmask(values.number),
            }

            try {
                const response = card ? await api.patch("/card", data) : await api.post("/card", data)
                snackbar("Cartão salvo")
                navigation.goBack()
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        },
    })

    const input_refs = Object.entries(formik.values).map(([key, value]) => useRef<TextInput>(null))

    const focusInput = (index: number) => {
        const ref = input_refs[index].current
        ref?.focus()
    }

    const onDelete = async () => {
        if (loading) return
        Alert.alert("Deletar cartão", "Essa ação é irreversível, deseja continuar?", [
            { text: "Cancelar" },
            {
                text: "Confirmar",
                onPress: async () => {
                    setLoading(true)
                    try {
                        const response = await api.delete("/card", { data: { card_id: card?.id } })
                        snackbar("Cartão deletado")
                        navigation.goBack()
                    } catch (error) {
                        console.log(error)
                    } finally {
                        setLoading(false)
                    }
                },
            },
        ])
    }

    useFocusEffect(
        useCallback(() => {
            if (card) {
                formik.setFieldValue("cvc", card.cvc)
                formik.setFieldValue("id", card.id)
                formik.setFieldValue("number", mask(card.number, "9999 9999 9999 9999"))
                formik.setFieldValue("owner", card.owner)
                formik.setFieldValue("type", card.type)
                formik.setFieldValue("validity", card.validity)
                formik.setFieldValue("bank", card.bank)
                formik.setFieldValue("flag", card.flag)
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
        <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}
            contentContainerStyle={{ gap: 10, padding: 20, bottom: iosKeyboard ? 30 : 0 }}
            showsVerticalScrollIndicator={false}
        >
            <ScreenTitle title={card ? "Atualizar cartão" : "Novo cartão"} />
            <RadioButton.Group value={formik.values.type} onValueChange={(value) => formik.setFieldValue("type", value)}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                        <RadioButton value={"CREDIT"} />
                        <Text>Crédito</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                        <RadioButton value={"DEBIT"} />
                        <Text>Débito</Text>
                    </View>
                </View>
            </RadioButton.Group>
            <FormText
                ref={input_refs[0]}
                name="number"
                formik={formik}
                label={"Número do cartão"}
                mask={"9999 9999 9999 9999"}
                keyboardType="numeric"
                onSubmitEditing={() => focusInput(1)}
            />
            <FormText
                ref={input_refs[1]}
                name="owner"
                formik={formik}
                label={"Nome do titular"}
                autoCapitalize="words"
                onSubmitEditing={() => focusInput(2)}
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
                <FormText
                    ref={input_refs[2]}
                    name="validity"
                    formik={formik}
                    label={"Data de validade"}
                    mask={"99/99"}
                    style={{ width: "100%" }}
                    keyboardType="numeric"
                    flex={1}
                    onSubmitEditing={() => focusInput(3)}
                />
                <FormText
                    ref={input_refs[3]}
                    name="cvc"
                    formik={formik}
                    label={"CVC"}
                    mask={"999"}
                    style={{ width: "100%" }}
                    keyboardType="numeric"
                    flex={1}
                    returnKeyType="done"
                />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 }}>
                {card && (
                    <Button
                        mode="outlined"
                        rippleColor={theme.colors.error}
                        onPress={onDelete}
                        disabled={loading}
                        style={{ flex: 1 }}
                    >
                        Deletar
                    </Button>
                )}
                <Button loading={loading} onPress={() => formik.handleSubmit()} mode="contained" style={{ flex: 1 }}>
                    Salvar cartão
                </Button>
            </View>
        </ScrollView>
    )
}

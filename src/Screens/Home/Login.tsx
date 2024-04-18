import { NavigationProp } from "@react-navigation/native"
import React, { useEffect, useRef, useState } from "react"
import { Surface, Switch, Text } from "react-native-paper"
import { TextInput } from "./TextInput"
import { useFormik } from "formik"
import { LoginForm } from "../../types/server/login"
import { Keyboard, KeyboardAvoidingView, TextInput as TextInputRef, View } from "react-native"
import { Button } from "./Button"
import { api } from "../../backend/api"
import { AxiosError } from "axios"
import { useSnackbar } from "../../hooks/useSnackbar"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { KeepSession } from "../../components/KeepSession"
import { colors } from "../../style/colors"
import { useUser } from "../../hooks/useUser"
import { User } from "../../types/server/class"

interface LoginProps {
    navigation: NavigationProp<any, any>
}

export const Login: React.FC<LoginProps> = ({ navigation }) => {
    const password_ref = useRef<TextInputRef>(null)
    const { snackbar } = useSnackbar()
    const { onLogin } = useUser()

    const [loading, setLoading] = useState(false)
    const [keepSession, setKeepSession] = useState(false)

    const formik = useFormik<LoginForm>({
        initialValues: {
            login: "",
            password: "",
        },
        onSubmit: async (values) => {
            if (loading) return
            setLoading(true)
            Keyboard.dismiss()

            try {
                const response = await api.post("/login", values)
                const user = response.data
                if (user) {
                    onLogin(user)
                    if (keepSession) {
                        await AsyncStorage.setItem("session", JSON.stringify(user))
                    } else {
                        await AsyncStorage.setItem("session", JSON.stringify(null))
                    }
                } else {
                    snackbar("credenciais inválidas")
                }
            } catch (error) {
                console.log(error)
                snackbar("erro desconhecido")
            } finally {
                setLoading(false)
            }
        },
    })

    const handleStayConnected = (value: boolean) => {
        AsyncStorage.setItem("stay_connected", JSON.stringify(value))
        setKeepSession(value)
    }

    useEffect(() => {
        AsyncStorage.getItem("session").then((result) => {
            const user = JSON.parse(result || "null") as User | null
            if (user) {
                formik.setFieldValue("login", user.email)
                formik.setFieldValue("password", user.password)
            }
        })

        AsyncStorage.getItem("stay_connected").then((result) => {
            const value = JSON.parse(result || "null")
            setKeepSession(value)
        })
    }, [])

    return (
        <KeyboardAvoidingView style={{ backgroundColor: "transparent", gap: 10, width: "100%" }} behavior="padding">
            <TextInput
                label={"E-mail ou nome de usuário"}
                value={formik.values.login}
                onChangeText={formik.handleChange("login")}
                keyboardType="email-address"
                returnKeyType="next"
                autoCapitalize={"none"}
                onSubmitEditing={() => password_ref.current?.focus()}
                readOnly={loading}
            />
            <TextInput
                ref={password_ref}
                label={"Senha"}
                value={formik.values.password}
                onChangeText={formik.handleChange("password")}
                secureTextEntry
                autoCapitalize={"none"}
                onSubmitEditing={() => formik.handleSubmit()}
                readOnly={loading}
            />
            <Surface style={{ flexDirection: "row", backgroundColor: "transparent", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <Switch value={keepSession} onValueChange={(value) => handleStayConnected(value)} color={colors.success} />
                    <Text style={{ color: colors.secondary }}>Manter-se conectado</Text>
                </View>
                <Button loading={loading} onPress={() => formik.handleSubmit()}>
                    Entrar
                </Button>
            </Surface>
            <KeepSession setLoading={setLoading} />
        </KeyboardAvoidingView>
    )
}

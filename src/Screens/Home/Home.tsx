import { NavigationProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useRef, useState } from "react"
import { Surface, Text } from "react-native-paper"
import { colors } from "../../style/colors"
import { Logo } from "../../components/Logo"
import { Button } from "./Button"
import { Dimensions, Pressable, ScrollView, TouchableOpacity } from "react-native"
import { Login } from "./Login"
import { ResizeMode, Video } from "expo-av"
import { setStatusBarStyle } from "expo-status-bar"

interface HomeProps {
    navigation: NavigationProp<any, any>
}

export const Home: React.FC<HomeProps> = ({ navigation }) => {
    const video = useRef<Video>(null)
    const { width, height } = Dimensions.get("screen")
    const [form, setForm] = useState<"login" | "signup">()

    useFocusEffect(
        useCallback(() => {
            setStatusBarStyle("light")

            return () => {
                setStatusBarStyle("dark")
            }
        }, [])
    )


    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={"handled"}
            style={{ backgroundColor: colors.primary }}
            contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 20, paddingHorizontal: 60 }}
        >
            <Video
                ref={video}
                style={{ width, height, position: "absolute", top: -0 }}
                source={require("../../../assets/background.webm")}
                useNativeControls={false}
                shouldPlay
                resizeMode={ResizeMode.COVER}
                isLooping
                onLoad={() => setStatusBarStyle("light")}
            />
            <Logo invert />
            {!form && (
                <Surface style={{ gap: 10, backgroundColor: "transparent", alignItems: "center" }}>
                    <Button onPress={() => setForm("login")} icon={"account-outline"}>
                        Login
                    </Button>
                </Surface>
            )}
            {form == "login" && <Login navigation={navigation} />}
            <TouchableOpacity onPress={() => navigation.navigate("signup")}>
                <Text style={{ color: colors.secondary }}>
                    Ainda não tem uma conta? <Text style={{ color: colors.secondary, fontWeight: "bold" }}>Faça o cadastro</Text>{" "}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

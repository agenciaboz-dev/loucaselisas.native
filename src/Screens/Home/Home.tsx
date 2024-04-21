import { NavigationProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useRef, useState } from "react"
import { Surface, Text } from "react-native-paper"
import { colors } from "../../style/colors"
import { Logo } from "../../components/Logo"
import { Button } from "./Button"
import { BackHandler, Dimensions, LayoutAnimation, Pressable, ScrollView, TouchableOpacity } from "react-native"
import { Login } from "./Login"
import { ResizeMode, Video } from "expo-av"
import { setStatusBarStyle } from "expo-status-bar"
import * as SplashScreen from "expo-splash-screen"
import { HomeStackParams } from "../../Routes"

interface HomeProps {
    navigation: NavigationProp<HomeStackParams, "home">
}

export const Home: React.FC<HomeProps> = ({ navigation }) => {
    const video = useRef<Video>(null)
    const { width, height } = Dimensions.get("screen")
    const [form, setForm] = useState<"login" | "signup">()

    const onLoginPress = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setForm("login")
    }

    useFocusEffect(
        useCallback(() => {
            setStatusBarStyle("light")

            const onBackPress = () => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
                setForm(undefined)
                return true
            }
            const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress)

            return () => {
                setStatusBarStyle("dark")
                backHandler.remove()
            }
        }, [])
    )

    const onVideoLoad = async () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        await SplashScreen.hideAsync()
        setStatusBarStyle("light")
    }

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
                source={require("../../../assets/background.mp4")}
                useNativeControls={false}
                shouldPlay
                resizeMode={ResizeMode.COVER}
                isLooping
                onLoad={onVideoLoad}
            />
            <Logo />
            {!form && (
                <Surface style={{ gap: 10, backgroundColor: "transparent", alignItems: "center" }}>
                    <Button onPress={onLoginPress} icon={"account-outline"}>
                        Login
                    </Button>
                </Surface>
            )}
            {form == "login" && <Login navigation={navigation} />}
            <TouchableOpacity onPress={() => navigation.navigate("signup")}>
                <Text style={{ color: colors.secondary }}>
                    Ainda não tem uma conta? <Text style={{ color: colors.secondary, fontFamily: "Founders-Grotesk-Bold" }}>Faça o cadastro</Text>{" "}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

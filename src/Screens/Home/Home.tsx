import { NavigationProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useRef, useState } from "react"
import { Surface, Text } from "react-native-paper"
import { colors } from "../../style/colors"
import { Logo } from "../../components/Logo"
import { Button } from "./Button"
import {
    BackHandler,
    Dimensions,
    LayoutAnimation,
    Platform,
    Pressable,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native"
import { Login } from "./Login"
import { ResizeMode, Video } from "expo-av"
import { setStatusBarStyle } from "expo-status-bar"
import * as SplashScreen from "expo-splash-screen"
import { HomeStackParams } from "../../Routes"
import constants from "expo-constants"
import * as Linking from "expo-linking"
import { ExternalRoute } from "../../types/ExternalRoute"
import { useUser } from "../../hooks/useUser"

interface HomeProps {
    navigation: any
}

export const Home: React.FC<HomeProps> = ({ navigation }) => {
    const { user } = useUser()
    const video = useRef<Video>(null)
    const { width, height } = Dimensions.get("screen")
    const [form, setForm] = useState<"login" | "signup">()
    const url = Linking.useURL()
    const externalRoute = useRef<ExternalRoute>()

    if (url) {
        const { hostname, path, queryParams } = Linking.parse(url)

        const app_routes = [
            {
                path: "course",
                route: "course:profile",
            },
            {
                path: "lesson",
                route: "lesson",
            },
        ]

        externalRoute.current = app_routes.find((item) => item.path == path)
        if (externalRoute.current) {
            externalRoute.current.query = queryParams

            if (user) {
                navigation.navigate("panel")
                setTimeout(() => navigation.push(externalRoute.current!.route, externalRoute.current!.query), 200)
            }
        }
        console.log({ path, queryParams, route: externalRoute.current })
    }

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
            contentContainerStyle={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: 20,
                paddingHorizontal: 60,
            }}
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
            {form == "login" && <Login navigation={navigation} externalRoute={externalRoute.current} />}
            <TouchableOpacity onPress={() => navigation.navigate("signup")} style={{ gap: 50 }}>
                <Text style={{ color: colors.secondary, fontSize: 13 }}>
                    Ainda não tem uma conta? <Text style={{ color: colors.secondary, fontFamily: "Lato_700Bold" }}>Faça o cadastro</Text>{" "}
                </Text>
                <View
                    style={{
                        alignItems: "center",
                        position: "absolute",
                        top: Platform.OS == "ios" ? 180 : 190,
                        right: Platform.OS == "ios" ? 30 : 25,
                        flex: 1,
                    }}
                >
                    <Text style={{ color: colors.secondary, fontSize: 11 }}>2024 © Direitos Reservados - v{constants.expoConfig?.version}</Text>
                    <Text style={{ color: colors.secondary, fontSize: 11 }}>Powered by BOZ</Text>
                </View>
            </TouchableOpacity>
        </ScrollView>
    )
}

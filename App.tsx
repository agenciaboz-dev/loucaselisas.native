import { StatusBar } from "expo-status-bar"
import { Providers } from "./src/Providers"
import { Routes } from "./src/Routes"
import { useKeepAwake } from "expo-keep-awake"
import { Platform, UIManager, View } from "react-native"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { useCallback } from "react"

SplashScreen.preventAutoHideAsync()

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function App() {
    useKeepAwake()

    const [fontsLoaded, fontError] = useFonts({
        "Custom-Founders-Grotesk-Regular": require("./assets/fonts/custom/FoundersGroteskBOZ-Regular.otf"),
        "Custom-Founders-Grotesk-Bold": require("./assets/fonts/custom/FoundersGroteskBOZ-Bold.otf"),
        "Custom-Founders-Grotesk-XCondBold": require("./assets/fonts/custom/FoundersGroteskXCondBOZ-Bold.otf"),

        "Founders-Grotesk-Regular": require("./assets/fonts/FoundersGrotesk-Regular.otf"),
        "Founders-Grotesk-Bold": require("./assets/fonts/FoundersGrotesk-Bold.otf"),
        "Founders-Grotesk-XCondBold": require("./assets/fonts/FoundersGroteskXCond-Bold.otf"),
    })

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            // await SplashScreen.hideAsync()
        }
    }, [fontsLoaded, fontError])

    if (!fontsLoaded && !fontError) {
        return null
    }

    return (
        <View onLayout={onLayoutRootView} style={{ flex: 1 }}>
            <StatusBar animated translucent />
            <Providers>
                <Routes />
            </Providers>
        </View>
    )
}

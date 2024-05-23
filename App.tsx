import { StatusBar } from "expo-status-bar"
import { Providers } from "./src/Providers"
import { Routes } from "./src/Routes"
import { useKeepAwake } from "expo-keep-awake"
import { View } from "react-native"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { useCallback } from "react"
import { useVideoPlayer } from "./src/hooks/useVideoplayer"

SplashScreen.preventAutoHideAsync()

// if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
//     UIManager.setLayoutAnimationEnabledExperimental(true)
// }

const StatusBarContainer = () => {
    const { isFullscreen } = useVideoPlayer()

    return <StatusBar animated translucent hidden={isFullscreen} />
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
            <Providers>
                <StatusBarContainer />
                <Routes />
            </Providers>
        </View>
    )
}

import { StatusBar } from "expo-status-bar"
import { Providers } from "./src/Providers"
import { Routes } from "./src/Routes"
import { useKeepAwake } from "expo-keep-awake"
import { View } from "react-native"
import * as SplashScreen from "expo-splash-screen"
import { useCallback } from "react"
import { useVideoPlayer } from "./src/hooks/useVideoplayer"
import { Lato_400Regular, Lato_700Bold, useFonts } from "@expo-google-fonts/lato"
import { NotificationsHandler } from "./src/components/NotificationsHandler"

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

    let [fontsLoaded, fontError] = useFonts({
        Lato_400Regular,
        Lato_700Bold,
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
                <NotificationsHandler />
            </Providers>
        </View>
    )
}

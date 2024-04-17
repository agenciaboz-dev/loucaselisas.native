import { StatusBar } from "expo-status-bar"
import { Providers } from "./src/Providers"
import { Routes } from "./src/Routes"
import { useKeepAwake } from "expo-keep-awake"
import { Platform, UIManager } from "react-native"

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true)
}

export default function App() {
    useKeepAwake()

    return (
        <>
            <StatusBar animated translucent />
            <Providers>
                <Routes />
            </Providers>
        </>
    )
}

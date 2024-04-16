import { StatusBar } from "expo-status-bar"
import { Providers } from "./src/Providers"
import { Routes } from "./src/Routes"
import { useKeepAwake } from "expo-keep-awake"
import { SafeAreaView } from "react-native"

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

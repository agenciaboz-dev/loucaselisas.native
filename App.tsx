import { StatusBar } from "expo-status-bar"
import { Providers } from "./src/Providers"
import { colors } from "./src/style/colors"
import { Routes } from "./src/Routes"
import { useKeepAwake } from "expo-keep-awake"

export default function App() {
    useKeepAwake()

    return (
        <>
            <StatusBar animated backgroundColor={colors.primary} style="light" />
            <Providers>
                <Routes />
            </Providers>
        </>
    )
}

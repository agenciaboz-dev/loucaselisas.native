import React, { useEffect } from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Home } from "./Screens/Home/Home"
import { MainScreen } from "./Screens/MainScreen/MainScreen"
import { Signup } from "./Screens/Signup/Signup"
import { Header } from "./components/Header/Header"
import { default_navigator_options } from "./tools/default_navigator_options"
import { Platform } from "react-native"
import { HeaderIos } from "./components/Header/HeaderIos"
import { useVideoPlayer } from "./hooks/useVideoplayer"

interface RoutesProps {}

export type HomeStackParams = {
    home: undefined
    signup: undefined
    mainscreen: undefined
    chat: undefined
    lesson: undefined
}

const Stack = createNativeStackNavigator<HomeStackParams>()

export const Routes: React.FC<RoutesProps> = ({}) => {
    const ios = Platform.OS == "ios"
    const { showHeader } = useVideoPlayer()

    return (
        <Stack.Navigator
            screenOptions={{
                ...default_navigator_options,
                headerTitle: ios ? undefined : () => <Header />,
                header: ios ? () => <HeaderIos /> : undefined,
                headerShown: showHeader,
            }}
        >
            <Stack.Screen name="home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="signup" component={Signup} options={{ headerShown: false }} />
            <Stack.Screen name="mainscreen" component={MainScreen} options={{}} />
        </Stack.Navigator>
    )
}

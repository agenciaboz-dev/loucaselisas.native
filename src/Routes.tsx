import React from "react"
import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack"
import { Home } from "./Screens/Home/Home"
import { MainScreen } from "./Screens/MainScreen/MainScreen"

interface RoutesProps {}

export const Routes: React.FC<RoutesProps> = ({}) => {
    const Stack = createNativeStackNavigator()
    const navigator_options: NativeStackNavigationOptions = {
        animation: "slide_from_right",
        headerShown: false,
    }

    return (
        <Stack.Navigator screenOptions={navigator_options}>
            <Stack.Screen name="home" component={Home} />
            <Stack.Screen name="mainscreen" component={MainScreen} />
        </Stack.Navigator>
    )
}

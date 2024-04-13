import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Home } from "./Screens/Home/Home"
import { MainScreen } from "./Screens/MainScreen/MainScreen"
import { Signup } from "./Screens/Signup/Signup"
import { Header } from "./components/Header/Header"
import { default_navigator_options } from "./tools/default_navigator_options"

interface RoutesProps {}

export const Routes: React.FC<RoutesProps> = ({}) => {
    const Stack = createNativeStackNavigator()

    return (
        <Stack.Navigator screenOptions={{ ...default_navigator_options, headerTitle: () => <Header />, headerShown: true }}>
            <Stack.Screen name="home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="signup" component={Signup} options={{ headerShown: false }} />
            <Stack.Screen name="mainscreen" component={MainScreen} options={{}} />
        </Stack.Navigator>
    )
}

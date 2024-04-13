import React from "react"
import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack"
import { Home } from "./Screens/Home/Home"
import { MainScreen } from "./Screens/MainScreen/MainScreen"
import { Signup } from "./Screens/Signup/Signup"
import { Header } from "./components/Header/Header"
import { Account } from "./Screens/Account/Account"

interface RoutesProps {}

export const Routes: React.FC<RoutesProps> = ({}) => {
    const Stack = createNativeStackNavigator()
    const navigator_options: NativeStackNavigationOptions = {
        animation: "slide_from_right",
        headerTitle: () => <Header />,
        headerBackVisible: false,
    }

    return (
        <Stack.Navigator screenOptions={navigator_options}>
            <Stack.Screen name="home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen name="signup" component={Signup} options={{ headerShown: false }} />
            <Stack.Screen name="mainscreen" component={MainScreen} options={{}} />
        </Stack.Navigator>
    )
}

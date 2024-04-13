import { NavigationProp } from "@react-navigation/native"
import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"
import { Dashboard } from "./Dashboard"

interface PanelProps {
    navigation: NavigationProp<any, any>
}

const PanelStack = createNativeStackNavigator()

export const Panel: React.FC<PanelProps> = ({ navigation }) => {
    const navigator_options: NativeStackNavigationOptions = {
        animation: "slide_from_right",
        headerShown: false,
    }

    return (
        <PanelStack.Navigator screenOptions={navigator_options}>
            <PanelStack.Screen name="dashboard" component={Dashboard} />
        </PanelStack.Navigator>
    )
}

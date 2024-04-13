import { NavigationProp } from "@react-navigation/native"
import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"
import { Dashboard } from "./Dashboard"
import { default_navigator_options } from "../../../tools/default_navigator_options"

interface PanelProps {
    navigation: NavigationProp<any, any>
}

const PanelStack = createNativeStackNavigator()

export const Panel: React.FC<PanelProps> = ({ navigation }) => {
    return (
        <PanelStack.Navigator screenOptions={default_navigator_options}>
            <PanelStack.Screen name="dashboard" component={Dashboard} />
        </PanelStack.Navigator>
    )
}

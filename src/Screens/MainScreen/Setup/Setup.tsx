import { NavigationProp } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"
import { Menus } from "./Menus"
import { Account } from "../../Account/Account"
import { default_navigator_options } from "../../../tools/default_navigator_options"

interface SetupProps {
    navigation: NavigationProp<any, any>
}

const Stack = createNativeStackNavigator()

export const Setup: React.FC<SetupProps> = ({ navigation }) => {
    return (
        <Stack.Navigator screenOptions={default_navigator_options}>
            <Stack.Screen name="setup:menus" component={Menus} />
            <Stack.Screen name="setup:account" component={Account} />
        </Stack.Navigator>
    )
}

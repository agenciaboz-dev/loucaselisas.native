import { NavigationProp } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"
import { View } from "react-native"
import { default_navigator_options } from "../../tools/default_navigator_options"
import { CreatorHome } from "./CreatorHome/CreatorHome"
import { CourseFormComponent } from "../Course/CourseFormComponent"

interface CreatorStackProps {
    navigation: NavigationProp<any, any>
}

const Stack = createNativeStackNavigator()

export const CreatorStack: React.FC<CreatorStackProps> = ({ navigation }) => {
    return (
        <Stack.Navigator screenOptions={default_navigator_options}>
            <Stack.Screen name="creator:home" component={CreatorHome} />
            <Stack.Screen name="creator:course:form" component={CourseFormComponent} />
        </Stack.Navigator>
    )
}
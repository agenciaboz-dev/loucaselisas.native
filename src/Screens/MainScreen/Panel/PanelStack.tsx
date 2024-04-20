import { NavigationProp } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"
import { Dashboard } from "./Dashboard"
import { default_navigator_options } from "../../../tools/default_navigator_options"
import { CourseProfile } from "../../Course/CourseProfile"
import { ChatScreen } from "../../Chat/ChatScreen"

interface PanelProps {
    navigation: NavigationProp<any, any>
}

const PanelStack = createNativeStackNavigator()

export const Panel: React.FC<PanelProps> = ({ navigation }) => {
    return (
        <PanelStack.Navigator screenOptions={default_navigator_options}>
            <PanelStack.Screen name="dashboard" component={Dashboard} />
            <PanelStack.Screen name="course:profile" component={CourseProfile} />
            <PanelStack.Screen name="course:chat" component={ChatScreen} />
        </PanelStack.Navigator>
    )
}

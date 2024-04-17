import { NavigationProp, RouteProp } from "@react-navigation/native"
import React from "react"
import { View } from "react-native"

interface LessonFormComponentProps {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>
}

export const LessonFormComponent: React.FC<LessonFormComponentProps> = ({ navigation, route }) => {
    return <View style={{ flex: 1 }}></View>
}

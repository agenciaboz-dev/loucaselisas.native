import { NavigationProp } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"
import { default_navigator_options } from "../../tools/default_navigator_options"
import { CreatorHome } from "./CreatorHome/CreatorHome"
import { CourseFormComponent } from "../Course/CourseFormComponent"
import { ManageCourse } from "./ManageCourse/ManageCourse"
import { DeleteCourseScreen } from "./ManageCourse/DeleteCourseScreen"
import { LessonFormComponent } from "../Lesson/LessonFormComponent"
import { DeleteLesson } from "../Lesson/DeleteLesson"
import { ManageLesson } from "../Lesson/ManageLesson"

interface CreatorStackProps {
    navigation: NavigationProp<any, any>
}

const Stack = createNativeStackNavigator()

export const CreatorStack: React.FC<CreatorStackProps> = ({ navigation }) => {
    return (
        <Stack.Navigator screenOptions={default_navigator_options} initialRouteName="creator:home">
            <Stack.Screen name="creator:home" component={CreatorHome} />
            <Stack.Screen name="creator:course:form" component={CourseFormComponent} />
            <Stack.Screen name="creator:course:manage" component={ManageCourse} />
            <Stack.Screen name="creator:course:delete" component={DeleteCourseScreen} />
            <Stack.Screen name="creator:lesson:form" component={LessonFormComponent} />
            <Stack.Screen name="creator:lesson:delete" component={DeleteLesson} />
            <Stack.Screen name="creator:lesson" component={ManageLesson} />
        </Stack.Navigator>
    )
}

import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"
import { View } from "react-native"
import { default_navigator_options } from "../../../tools/default_navigator_options"
import { Search } from "./Search"
import { CategoryScreen } from "./CategoryScreen"
import { SearchCoursesScreen } from "./SearchCoursesScreen"
import { CourseProfile } from "../../Course/CourseProfile"

interface SearchStackProps {}

const Stack = createNativeStackNavigator()

export const SearchStack: React.FC<SearchStackProps> = ({}) => {
    return (
        <Stack.Navigator screenOptions={default_navigator_options}>
            <Stack.Screen name="search:category" component={Search} />
            <Stack.Screen name="search:courses" component={SearchCoursesScreen} />
            <Stack.Screen name="category:screen" component={CategoryScreen} />
            <Stack.Screen name="search:course:profile" component={CourseProfile} />
        </Stack.Navigator>
    )
}

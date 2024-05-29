import React, { useEffect, useRef, useState } from "react"
import { Dimensions, TextInput as OriginalText, NativeSyntheticEvent, Platform, ScrollView, TextInputFocusEventData, View } from "react-native"
import { Course } from "../../../types/server/class/Course"
import { Text, TextInput, useTheme } from "react-native-paper"
import { CourseCardContainer } from "./CourseCardContainer"
import { useArray } from "burgos-array"
import { LessonsSkeletons } from "../../Creator/ManageCourse/LessonsSkeletons"
import { NavigationProp, useNavigation } from "@react-navigation/native"

interface CourseListProps {
    courses: Course[]
    scrollRef: React.RefObject<ScrollView>
    refreshing: boolean
}
const screenHeight = Dimensions.get("window").height

export const CourseList: React.FC<CourseListProps> = ({ courses, scrollRef, refreshing }) => {
    const theme = useTheme()
    const searchRef = useRef<OriginalText>(null)
    const skeletons = useArray().newArray(5)
    const navigation = useNavigation<NavigationProp<any, any>>()

    const [searchText, setSearchValue] = useState("")

    const handleSearch = () => {
        if (searchText) {
            navigation.navigate("search:courses", { text: searchText })
        }
    }

    return (
        <>
            <TextInput
                ref={searchRef}
                placeholder={"Pesquisar Cursos"}
                mode="outlined"
                value={searchText}
                onChangeText={setSearchValue}
                style={{ backgroundColor: theme.colors.surfaceDisabled }}
                outlineStyle={{ borderRadius: 100, borderWidth: 0 }}
                // left={<TextInput.Icon icon={"menu"} />}
                right={<TextInput.Icon icon="magnify" onPress={handleSearch} />}
                disabled={refreshing}
                onSubmitEditing={handleSearch}
            />

            {refreshing && !courses.length && skeletons.map((index) => <LessonsSkeletons key={index} />)}

            {!refreshing && !courses.length && (
                <View>
                    <Text>Nenhum curso encontrado</Text>
                </View>
            )}

            {courses
                .sort((a, b) => Number(b.published) - Number(a.published))
                .map((item) => (
                    <CourseCardContainer key={item.id} course={item} />
                ))}
        </>
    )
}

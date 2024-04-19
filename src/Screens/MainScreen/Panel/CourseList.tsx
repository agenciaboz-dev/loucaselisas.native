import React, { useEffect, useRef, useState } from "react"
import { Dimensions, TextInput as OriginalText, NativeSyntheticEvent, Platform, ScrollView, TextInputFocusEventData, View } from "react-native"
import { Course } from "../../../types/server/class/Course"
import { TextInput, useTheme } from "react-native-paper"
import { CourseCardContainer } from "./CourseCardContainer"

interface CourseListProps {
    courses: Course[]
    scrollRef: React.RefObject<ScrollView>
}
const screenHeight = Dimensions.get("window").height

export const CourseList: React.FC<CourseListProps> = ({ courses, scrollRef }) => {
    const theme = useTheme()
    const searchRef = useRef<OriginalText>(null)

    const [searchValue, setSearchValue] = useState("")
    const [courseList, setCourseList] = useState(courses)

    const handleSearch = (value: string) => {
        setSearchValue(value)
        setCourseList(courses.filter((item) => item.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())))
    }

    const onSearchFocus = () => {
        // searchRef.current?.measure((x, y, w, h, px, py) => {
        //     console.log({ y, py })
        //     scrollRef.current?.scrollTo({ y: py - h * 2 - 20 })
        // })
    }

    useEffect(() => {
        setCourseList(courses)
    }, [courses])

    useEffect(() => {
        if (searchValue) {
            onSearchFocus()
        }
    }, [searchValue])

    return (
        <>
            <TextInput
                ref={searchRef}
                placeholder={"Pesquisar Cursos"}
                mode="outlined"
                value={searchValue}
                onChangeText={handleSearch}
                style={{ backgroundColor: theme.colors.surfaceDisabled }}
                outlineStyle={{ borderRadius: 100, borderWidth: 0 }}
                left={<TextInput.Icon icon={"menu"} />}
                right={<TextInput.Icon icon="magnify" />}
                onFocus={onSearchFocus}
            />
            {courseList
                .sort((a, b) => Number(b.published) - Number(a.published))
                .map((item) => (
                    <CourseCardContainer key={item.id} course={item} />
                ))}
        </>
    )
}

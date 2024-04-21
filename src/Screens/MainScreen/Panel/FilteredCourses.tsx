import React, { useEffect, useState } from "react"
import { FlatList, LayoutAnimation, View } from "react-native"
import { Course } from "../../../types/server/class/Course"
import { CourseContainer } from "../../Creator/CreatorHome/Resume/CourseContainer"
import { Text } from "react-native-paper"
import { CourseSkeletons } from "../../../components/CourseSkeletons"
import { Filters } from "./Filters/Filters"

interface FilteredCoursesProps {
    courses: Course[]
    refreshing?: boolean
}

export const FilteredCourses: React.FC<FilteredCoursesProps> = ({ courses, refreshing }) => {
    const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses)
    const [active, setActive] = useState("popular")

    const onFilterCourses = (filtered_courses: Course[]) => {
        console.log("PRIMEIRO DA LISTA")
        console.log(JSON.stringify(filtered_courses[0], null, 4))
        console.log("PRIMEIRO DA LISTA")
        // TODO: ACTIVATE ON BUILD
        // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setFilteredCourses(filtered_courses)
    }

    useEffect(() => {
        const current_filter = active
        setActive("")
        setTimeout(() => setActive(current_filter), 100)
    }, [courses])

    return (
        <>
            <Filters onFilter={onFilterCourses} courses={courses} active={active} setActive={setActive} />
            <FlatList
                data={filteredCourses}
                renderItem={({ item }) => <CourseContainer course={item} route="course:profile" />}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                style={{ marginHorizontal: -20, minHeight: 75 }}
                contentContainerStyle={{ gap: 10, paddingHorizontal: 20, paddingBottom: 10 }}
                ListEmptyComponent={<CourseSkeletons />}
                // ListEmptyComponent={refreshing ? <CourseSkeletons /> : <Text style={{ flex: 1, textAlign: "center" }}>Nenhum curso encontrado</Text>}
            />
        </>
    )
}

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

    const onFilterCourses = (filtered_courses: Course[]) => {
        console.log(filtered_courses)
        // TODO: ACTIVATE ON BUILD
        // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setFilteredCourses(filtered_courses)
    }

    useEffect(() => {
        setFilteredCourses(courses)
    }, [courses])

    return (
        <>
            <Filters onFilter={onFilterCourses} courses={courses} />
            <FlatList
                data={filteredCourses.sort((a, b) => Number(b.published) - Number(a.published))}
                renderItem={({ item }) => <CourseContainer course={item} route="" />}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                style={{ marginHorizontal: -20, minHeight: 75 }}
                contentContainerStyle={{ gap: 10, paddingHorizontal: 20, paddingBottom: 10 }}
                ListEmptyComponent={refreshing ? <CourseSkeletons /> : <Text style={{ flex: 1, textAlign: "center" }}>Nenhum curso encontrado</Text>}
            />
        </>
    )
}

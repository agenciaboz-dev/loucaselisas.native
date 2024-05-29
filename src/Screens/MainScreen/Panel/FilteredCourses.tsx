import React, { useEffect, useRef, useState } from "react"
import { FlatList, LayoutAnimation, View } from "react-native"
import { Course } from "../../../types/server/class/Course"
import { CourseContainer } from "../../Creator/CreatorHome/Resume/CourseContainer"
import { Text } from "react-native-paper"
import { CourseSkeletons } from "../../../components/CourseSkeletons"
import { Filters } from "./Filters/Filters"

interface FilteredCoursesProps {
    courses: Course[]
}

export const FilteredCourses: React.FC<FilteredCoursesProps> = ({ courses }) => {
    const scrollRef = useRef<FlatList>(null)
    const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses)
    const [active, setActive] = useState("popular")
    const [refreshing, setRefreshing] = useState(!!courses.length)

    const onFilterCourses = (filtered_courses: Course[]) => {
        setRefreshing(true)
        setFilteredCourses([])
        setTimeout(() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            setFilteredCourses(filtered_courses)
            setRefreshing(false)
        }, 200)
    }

    useEffect(() => {
        const current_filter = active
        setActive("")
        setTimeout(() => setActive(current_filter), 100)
    }, [courses])

    useEffect(() => {
        scrollRef.current?.scrollToOffset({ offset: 0 })
    }, [filteredCourses])

    return (
        <>
            <Filters onFilter={onFilterCourses} courses={courses} active={active} setActive={setActive} />
            <FlatList
                ref={scrollRef}
                data={filteredCourses}
                renderItem={({ item }) => <CourseContainer course={item} route="course:profile" />}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                style={{ marginHorizontal: -20, minHeight: 75 }}
                contentContainerStyle={{ gap: 10, paddingHorizontal: 20, paddingBottom: 10 }}
                ListEmptyComponent={refreshing ? <CourseSkeletons /> : <Text>Nenhum curso encontrado</Text>}
                // ListEmptyComponent={refreshing ? <CourseSkeletons /> : <Text style={{ flex: 1, textAlign: "center" }}>Nenhum curso encontrado</Text>}
            />
        </>
    )
}

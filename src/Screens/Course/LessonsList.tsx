import React from "react"
import { View } from "react-native"
import { Lesson } from "../../types/server/class/Course/Lesson"
import { Text } from "react-native-paper"
import { LessonContainer } from "./LessonContainer"
import { useArray } from "burgos-array"
import { LessonsSkeletons } from "../Creator/ManageCourse/LessonsSkeletons"
import { Course } from "../../types/server/class/Course"

interface LessonsListProps {
    lessons: Lesson[]
    refreshing: boolean
    refreshCourse: () => Promise<void>
    blocked?: boolean
    course?: Course
}

export const LessonsList: React.FC<LessonsListProps> = ({ lessons, course, refreshing, blocked, refreshCourse }) => {
    const quantity = course?.lessons || 0
    const skeletons = useArray().newArray(quantity)

    return course ? (
        <View style={{ gap: 10, padding: 20, paddingBottom: 0 }}>
            {refreshing && !!quantity && !lessons.length && skeletons.map((index) => <LessonsSkeletons key={index} />)}
            {quantity ? (
                lessons
                    .filter((lesson) => lesson.status == "active")
                    .sort((a, b) => Number(b.published) - Number(a.published))
                    .map((item, index) => (
                        <LessonContainer
                            key={item.id}
                            lesson={item}
                            index={lessons.length - index}
                            course={course}
                            blocked={blocked}
                            refreshCourse={refreshCourse}
                        />
                    ))
            ) : (
                <Text>Esse curso ainda não possui nenhuma lição.</Text>
            )}
        </View>
    ) : null
}

import React from "react"
import { View } from "react-native"
import { Lesson } from "../../types/server/class/Course/Lesson"
import { Text } from "react-native-paper"
import { LessonContainer } from "./LessonContainer"
import { useArray } from "burgos-array"
import { LessonsSkeletons } from "../Creator/ManageCourse/LessonsSkeletons"

interface LessonsListProps {
    lessons: Lesson[]
    quantity: number
    refreshing: boolean
}

export const LessonsList: React.FC<LessonsListProps> = ({ lessons, quantity, refreshing }) => {
    const skeletons = useArray().newArray(quantity)

    return (
        <View style={{ gap: 10, padding: 20, paddingBottom: 0 }}>
            {refreshing && !!quantity && !lessons.length && skeletons.map((index) => <LessonsSkeletons key={index} />)}
            {quantity ? (
                lessons
                    .sort((a, b) => Number(b.published) - Number(a.published))
                    .map((item, index) => <LessonContainer key={item.id} lesson={item} index={lessons.length - index} />)
            ) : (
                <Text>Esse curso ainda não possui nenhuma lição.</Text>
            )}
        </View>
    )
}

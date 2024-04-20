import React from "react"
import { View } from "react-native"
import { Lesson } from "../../types/server/class/Course/Lesson"

interface LessonsListProps {
    lessons: Lesson[]
}

export const LessonsList: React.FC<LessonsListProps> = ({ lessons }) => {
    return <View style={{ flex: 1 }}></View>
}

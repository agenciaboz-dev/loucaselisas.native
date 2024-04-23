import React from "react"
import { FlatList, View } from "react-native"
import { Course } from "../../../types/server/class/Course"
import { Text } from "react-native-paper"
import { CourseContainer } from "../../Creator/CreatorHome/Resume/CourseContainer"
import { CourseSkeletons } from "../../../components/CourseSkeletons"

interface CategoryCourseListProps {
    title: string
    courses: Course[]
    loading?: boolean
}

export const CategoryCourseList: React.FC<CategoryCourseListProps> = ({ courses, title, loading }) => {
    return (
        <View style={{ flex: 1, gap: 10 }}>
            <Text variant="bodyLarge">{title}</Text>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={courses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CourseContainer course={item} route={"search:course:profile"} />}
                style={{ margin: -20 }}
                contentContainerStyle={{ gap: 10, padding: 20 }}
                ListEmptyComponent={loading ? <CourseSkeletons /> : <Text>Nenhum curso encontrado</Text>}
            />
        </View>
    )
}

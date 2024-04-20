import React, { useCallback, useEffect, useState } from "react"
import { FlatList, View } from "react-native"
import { FilterButton } from "./FilterButton"
import { Category } from "../../../../types/server/class/Category"
import { useFocusEffect } from "@react-navigation/native"
import { api } from "../../../../backend/api"
import { Course } from "../../../../types/server/class/Course"
import { FilterSkeleton } from "./FilterSkeleton"

interface FiltersProps {
    onFilter: (courses: Course[]) => void
    courses: Course[]
    active: string
    setActive: React.Dispatch<React.SetStateAction<string>>
}

export const Filters: React.FC<FiltersProps> = ({ onFilter, courses, setActive, active }) => {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(false)

    const fetchCategories = async () => {
        setLoading(true)
        try {
            const response = await api.get("/category/list")
            setCategories(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const onPress = (id: string) => {
        setActive(id)
    }

    useFocusEffect(
        useCallback(() => {
            fetchCategories()
        }, [])
    )

    useEffect(() => {
        if (courses.length && active) {
            let filtered_courses: Course[] = []

            if (active == "popular") {
                filtered_courses = courses.sort((a, b) => b.views - a.views)
            }

            if (active == "recent") {
                filtered_courses = courses.sort((a, b) => Number(b.published) - Number(a.published))
            }

            const selected_category = categories.find((item) => item.id == active)
            if (selected_category) {
                filtered_courses = courses
                    .filter((item) => item.categories.find((category) => category.id == selected_category.id))
                    .sort((a, b) => b.views - a.views)
            }

            filtered_courses = filtered_courses.slice(0, 10)
            onFilter(filtered_courses)
        }
    }, [active])

    return (
        <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal
            data={categories}
            style={{ marginHorizontal: -20 }}
            contentContainerStyle={{ gap: 5, paddingHorizontal: 20 }}
            ListHeaderComponent={
                <View style={{ flexDirection: "row", gap: 5 }}>
                    <FilterButton active={"popular" == active} onPress={() => onPress("popular")}>
                        Mais vistos
                    </FilterButton>
                    <FilterButton active={"recent" == active} onPress={() => onPress("recent")}>
                        Novos Cursos
                    </FilterButton>
                </View>
            }
            renderItem={({ item }) => (
                <FilterButton active={item.id == active} onPress={() => onPress(item.id)}>
                    {item.name}
                </FilterButton>
            )}
            ListEmptyComponent={<FilterSkeleton quantity={5} />}
        />
    )
}

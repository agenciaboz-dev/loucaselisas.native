import { NavigationProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { View, TextInput as OriginalInput, FlatList } from "react-native"
import { Text, TextInput, useTheme } from "react-native-paper"
import { ScreenTitle } from "../../../components/ScreenTItle"
import { Course } from "../../../types/server/class/Course"
import { Lesson } from "../../../types/server/class/Course/Lesson"
import { useArray } from "burgos-array"
import { useUser } from "../../../hooks/useUser"
import { LessonsSkeletons } from "../../Creator/ManageCourse/LessonsSkeletons"
import { LessonContainer } from "../../Course/LessonContainer"
import { api } from "../../../backend/api"

interface FavoritesProps {
    navigation: NavigationProp<any, any>
}

export const Favorites: React.FC<FavoritesProps> = ({ navigation }) => {
    const { user } = useUser()
    const searchRef = useRef<OriginalInput>(null)
    const theme = useTheme()
    const skeletons = useArray().newArray(user?.liked_lessons || 0)

    const [lessons, setLessons] = useState<Lesson[]>([])
    const [courses, setCourses] = useState<Course[]>([])
    const [lessonList, setLessonList] = useState(lessons)
    const [refreshing, setRefreshing] = useState(true)
    const [searchValue, setSearchValue] = useState("")

    const handleSearch = (value: string) => {
        setSearchValue(value)
        setLessonList(lessons.filter((item) => item.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())))
    }

    const onRefresh = async () => {
        setRefreshing(true)
        try {
            const response = await api.get("/lesson/liked", { params: { user_id: user?.id } })
            setLessons(response.data.lessons)
            setCourses(response.data.courses)
        } catch (error) {
            console.log(error)
        } finally {
            setRefreshing(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            onRefresh()
        }, [])
    )

    useEffect(() => {
        setLessonList(lessons)
    }, [lessons])

    return user ? (
        <View style={{ flex: 1, padding: 20, gap: 10, paddingBottom: 0 }}>
            <ScreenTitle title="Seus Favoritos" hideBackArrow />
            <TextInput
                ref={searchRef}
                placeholder={"Pesquisar Favoritos"}
                mode="outlined"
                value={searchValue}
                onChangeText={handleSearch}
                style={{ backgroundColor: theme.colors.surfaceDisabled }}
                outlineStyle={{ borderRadius: 100, borderWidth: 0 }}
                left={<TextInput.Icon icon={"menu"} />}
                right={<TextInput.Icon icon="magnify" />}
                disabled={refreshing}
            />

            {refreshing && !lessons.length && skeletons.map((index) => <LessonsSkeletons key={index} />)}

            <FlatList
                data={lessonList.sort((a, b) => Number(b.published) - Number(a.published))}
                renderItem={({ item, index }) => (
                    <LessonContainer course={courses.find((course) => course.id == item.course_id)} index={index} lesson={item} liked_variant />
                )}
                keyExtractor={(item) => item.id}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListEmptyComponent={!refreshing && !lessons.length ? <Text variant="bodyLarge">Nenhuma lição favoritada</Text> : null}
                style={{ margin: -20 }}
                contentContainerStyle={{ padding: 20, gap: 15 }}
            />
        </View>
    ) : null
}

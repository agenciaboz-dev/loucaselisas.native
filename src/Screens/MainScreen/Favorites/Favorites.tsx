import { NavigationProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { View, TextInput as OriginalInput, FlatList } from "react-native"
import { Surface, Text, TextInput, useTheme } from "react-native-paper"
import { ScreenTitle } from "../../../components/ScreenTItle"
import { Course } from "../../../types/server/class/Course"
import { Lesson } from "../../../types/server/class/Course/Lesson"
import { useArray } from "burgos-array"
import { useUser } from "../../../hooks/useUser"
import { api } from "../../../backend/api"
import { FavoriteContainer } from "./FavoriteContainer"
import { Button } from "../../../components/Button"
import { FavoritesSkeletons } from "../../Creator/ManageCourse/FavoritesSkeletons"

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
        <View style={{ flex: 1, padding: 20, paddingTop: 10 }}>
            <ScreenTitle title="Seus Favoritos" hideBackArrow />
            <TextInput
                ref={searchRef}
                placeholder={"Pesquisar Favoritos"}
                mode="outlined"
                value={searchValue}
                onChangeText={handleSearch}
                style={{ backgroundColor: theme.colors.surfaceDisabled }}
                outlineStyle={{ borderRadius: 100, borderWidth: 0 }}
                // left={<TextInput.Icon icon={"menu"} />}
                right={<TextInput.Icon icon="magnify" disabled />}
                disabled={refreshing}
            />

            <Surface
                style={{
                    width: "120%",
                    height: 1,
                    backgroundColor: "transparent",
                    marginTop: 20,
                    marginLeft: -20,
                    elevation: 1,
                }}
            >
                <View
                    style={{
                        width: "100%",
                        height: 1,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 1,
                        backgroundColor: "#ddd",
                    }}
                />
            </Surface>

            {refreshing && !lessons.length && (
                <View style={{ flex: 1, paddingTop: 20, gap: 15 }}>
                    {skeletons.map((index) => (
                        <FavoritesSkeletons key={index} />
                    ))}
                </View>
            )}

            <FlatList
                data={lessonList.sort((a, b) => Number(b.published) - Number(a.published))}
                renderItem={({ item, index }) => (
                    <FavoriteContainer course={courses.find((course) => course.id == item.course_id)} lesson={item} refresh={onRefresh} />
                )}
                keyExtractor={(item) => item.id}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListEmptyComponent={!refreshing && !lessons.length ? <Text variant="bodyLarge">Nenhuma lição favoritada</Text> : null}
                style={{ margin: -20, marginTop: 0 }}
                contentContainerStyle={{ padding: 20, gap: 15 }}
                ListFooterComponent={
                    !refreshing ? (
                        <Button mode="outlined" onPress={() => navigation.navigate("search")}>
                            Adicionar conteúdo
                        </Button>
                    ) : null
                }
            />
        </View>
    ) : null
}

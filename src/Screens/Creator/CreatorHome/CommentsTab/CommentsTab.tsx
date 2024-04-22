import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { FlatList, LayoutAnimation, Platform, View } from "react-native"
import { TextInput, useTheme } from "react-native-paper"
import { useUser } from "../../../../hooks/useUser"
import { Course } from "../../../../types/server/class/Course"
import { api } from "../../../../backend/api"
import { CommentContainer } from "./CommentContainer"

interface CommentsTabProps {}

export const CommentsTab: React.FC<CommentsTabProps> = ({}) => {
    const theme = useTheme()
    const navigation = useNavigation<NavigationProp<any, any>>()
    const { user, setUser } = useUser()
    const creator = user?.creator
    const scrollRef = useRef<FlatList>(null)

    const [refreshing, setRefreshing] = useState(false)
    const [ownedCourses, setOwnedCourses] = useState<Course[]>([])
    const [filteredCourses, setFilteredCourses] = useState(ownedCourses)
    const [filterCourseName, setFilterCourseName] = useState("")

    const refreshCourses = async () => {
        setOwnedCourses([])
        setRefreshing(true)
        setTimeout(async () => {
            try {
                const response = await api.get("/course/owner", { params: { owner_id: creator?.id } })
                LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
                setOwnedCourses(response.data)
            } catch (error) {
                console.log(error)
            } finally {
                setRefreshing(false)
            }
        }, 500)
    }

    const filterCourses = (scroll = true) => {
        // TODO: ACTIVATE ON BUILD
        // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setFilteredCourses(ownedCourses.filter((item) => item.name.toLocaleLowerCase().includes(filterCourseName.toLocaleLowerCase())))
        if (scroll) scrollRef.current?.scrollToEnd()
    }

    useEffect(() => {
        filterCourses(false)
    }, [ownedCourses])

    const handleSearchCourse = (text: string) => {
        setFilterCourseName(text)
        filterCourses()
    }

    useFocusEffect(
        useCallback(() => {
            refreshCourses()

            // return () => setOwnedCourses([])
        }, [])
    )

    return (
        <View style={{ flex: 1, padding: 20, gap: 10, paddingTop: 0 }}>
            <TextInput
                placeholder={"Pesquisar Cursos"}
                mode="outlined"
                value={filterCourseName}
                onChangeText={handleSearchCourse}
                style={{ backgroundColor: theme.colors.surfaceDisabled, marginTop: 10 }}
                outlineStyle={{ borderRadius: 100, borderWidth: 0 }}
                left={<TextInput.Icon icon={"menu"} />}
                right={<TextInput.Icon icon="magnify" />}
                onFocus={() => setTimeout(() => Platform.OS == "android" && scrollRef.current?.scrollToOffset({ offset: 0 }), 500)}
            />

            <FlatList
                data={ownedCourses.filter((item) => !!item.chat?.messages)}
                renderItem={({ item }) => <CommentContainer course={item} />}
                keyExtractor={(item) => item.id}
                refreshing={refreshing}
                onRefresh={refreshCourses}
                style={{ margin: -20, marginTop: -10 }}
                contentContainerStyle={{ padding: 20, gap: 15 }}
            />
        </View>
    )
}

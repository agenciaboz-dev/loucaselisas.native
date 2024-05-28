import React, { useCallback, useEffect, useRef, useState } from "react"
import { FlatList, LayoutAnimation, Platform, RefreshControl, ScrollView, View } from "react-native"
import { Text, TextInput, useTheme } from "react-native-paper"
import { useUser } from "../../../../hooks/useUser"
import { Button } from "../../../../components/Button"
import * as ImagePicker from "expo-image-picker"
import { UserImageForm } from "../../../../types/server/class/User"
import { api } from "../../../../backend/api"
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native"
import { Course } from "../../../../types/server/class/Course"
import { CourseContainer } from "./CourseContainer"
import { ManageProfileCard } from "../../../../components/ManageProfileCard"
import { getFilename } from "../../../../tools/pickMedia"
import { PartialCreator } from "../../../../types/server/class/Creator"
import { IosAvoidKeyboard } from "../../../../components/IosAvoidKeyboard"
import { CourseSkeletons } from "../../../../components/CourseSkeletons"

interface ResumeProps {}

export const Resume: React.FC<ResumeProps> = ({}) => {
    const theme = useTheme()
    const navigation = useNavigation<NavigationProp<any, any>>()
    const { user, setUser } = useUser()
    const creator = user?.creator
    const screenRef = useRef<ScrollView>(null)

    const [refreshing, setRefreshing] = useState(false)
    const [ownedCourses, setOwnedCourses] = useState<Course[]>([])
    const [filteredCourses, setFilteredCourses] = useState(ownedCourses)
    const [filterCourseName, setFilterCourseName] = useState("")

    const uploadImage = async (type: "cover" | "profile", image: ImagePicker.ImagePickerAsset) => {
        if (!creator) return

        if (image.base64) {
            const filename = getFilename(image)
            const data: UserImageForm = {
                id: creator.id,
                cover: type == "cover" ? { name: filename, base64: image.base64 } : undefined,
                image: type == "profile" ? { name: filename, base64: image.base64 } : undefined,
            }
            const response = await api.patch("/creator/image", data)
            const updated_user = response.data
            setUser(updated_user)
        }
    }

    const onUpdateDescription = async (text: string) => {
        if (!creator) return

        const data: PartialCreator = { id: creator.id, description: text }
        const response = await api.patch("/creator", data)
        const updated_user = response.data
        setUser(updated_user)
    }

    const refreshCourses = async () => {
        setOwnedCourses([])
        setRefreshing(true)
        setTimeout(async () => {
            try {
                const response = await api.get("/course/owner", { params: { owner_id: creator?.id } })
                // LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
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
        if (scroll) screenRef.current?.scrollToEnd()
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

    return creator ? (
        <ScrollView
            ref={screenRef}
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshCourses} />}
        >
            <IosAvoidKeyboard style={{ gap: 10 }}>
                <ManageProfileCard
                    cover={creator.cover}
                    picture={creator.image}
                    name={creator.nickname}
                    description={creator.description}
                    instagram={user.instagram}
                    tiktok={user.tiktok}
                    onUpdateCover={(image) => uploadImage("cover", image)}
                    onUpdatePicture={(image) => uploadImage("profile", image)}
                    onUpdateDescription={onUpdateDescription}
                />
                <TextInput
                    placeholder={"Pesquisar Cursos"}
                    mode="outlined"
                    value={filterCourseName}
                    onChangeText={handleSearchCourse}
                    style={{ backgroundColor: theme.colors.surfaceDisabled, marginTop: 15 }}
                    outlineStyle={{ borderRadius: 100, borderWidth: 0 }}
                    left={<TextInput.Icon icon={"menu"} />}
                    right={<TextInput.Icon icon="magnify" />}
                    onFocus={() => setTimeout(() => Platform.OS == "android" && screenRef.current?.scrollToEnd(), 500)}
                />
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text variant="bodyLarge">Seus Cursos</Text>
                </View>
                <Button
                    mode="outlined"
                    icon={"plus-circle"}
                    style={{ borderStyle: "dashed" }}
                    onPress={() => navigation.navigate("creator:course:form")}
                >
                    Novo curso
                </Button>
                <FlatList
                    data={filteredCourses.sort((a, b) => Number(b.published) - Number(a.published))}
                    renderItem={({ item }) => <CourseContainer course={item} route="creator:course:manage" creatorInfo />}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    style={{ marginHorizontal: -20, minHeight: 75 }}
                    contentContainerStyle={{ gap: 10, paddingHorizontal: 20, paddingBottom: 10 }}
                    ListEmptyComponent={
                        refreshing ? <CourseSkeletons /> : <Text style={{ flex: 1, textAlign: "center" }}>Nenhum curso encontrado</Text>
                    }
                    refreshing={refreshing}
                    onRefresh={refreshCourses}
                />
            </IosAvoidKeyboard>
        </ScrollView>
    ) : (
        <Text>no creator</Text>
    )
}

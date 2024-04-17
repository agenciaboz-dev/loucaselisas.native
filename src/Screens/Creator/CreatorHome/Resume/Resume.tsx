import React, { useCallback, useEffect, useState } from "react"
import { FlatList, ScrollView, View } from "react-native"
import { Text, TextInput } from "react-native-paper"
import { useUser } from "../../../../hooks/useUser"
import { Button } from "../../../../components/Button"
import * as ImagePicker from "expo-image-picker"
import { UserImageForm } from "../../../../types/server/class/User"
import { api } from "../../../../backend/api"
import { colors } from "../../../../style/colors"
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native"
import { Course } from "../../../../types/server/class/Course"
import { CourseContainer } from "./CourseContainer"
import { ManageProfileCard } from "../../../../components/ManageProfileCard"
import { getFilename } from "../../../../tools/pickMedia"
import { PartialCreator } from "../../../../types/server/class/Creator"

interface ResumeProps {}

export const Resume: React.FC<ResumeProps> = ({}) => {
    const navigation = useNavigation<NavigationProp<any, any>>()
    const { user, setUser, refresh } = useUser()
    const creator = user?.creator

    const [editingDescription, setEditingDescription] = useState(false)
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
        console.log("refreshing owned courses")
        setRefreshing(true)
        try {
            const response = await api.get("/course/owner", { params: { owner_id: creator?.id } })
            console.log(response.data)
            setOwnedCourses(response.data)
        } catch (error) {
            console.log(error)
        }

        setRefreshing(false)
    }

    const filterCourses = () => {
        setFilteredCourses(ownedCourses.filter((item) => item.name.toLocaleLowerCase().includes(filterCourseName.toLocaleLowerCase())))
    }

    useEffect(() => {
        filterCourses()
    }, [ownedCourses])

    useEffect(() => {
        filterCourses()
    }, [filterCourseName])

    useFocusEffect(
        useCallback(() => {
            refreshCourses()
        }, [])
    )

    return creator ? (
        <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10, gap: 10 }}
        >
            <ManageProfileCard
                cover={creator.cover}
                picture={creator.image}
                name={creator.nickname}
                description={creator.description}
                onUpdateCover={(image) => uploadImage("cover", image)}
                onUpdatePicture={(image) => uploadImage("profile", image)}
                onUpdateDescription={onUpdateDescription}
            />
            <TextInput
                label={"Pesquisar Cursos"}
                mode="outlined"
                value={filterCourseName}
                onChangeText={setFilterCourseName}
                style={{ backgroundColor: colors.grey }}
                outlineStyle={{ borderRadius: 100, borderWidth: 0 }}
                left={<TextInput.Icon icon={"menu"} />}
                right={<TextInput.Icon icon="magnify" />}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text variant="bodyLarge">Seus Cursos</Text>
            </View>
            <Button mode="outlined" icon={"plus-circle"} style={{ borderStyle: "dashed" }} onPress={() => navigation.navigate("creator:course:form")}>
                Novo curso
            </Button>
            <FlatList
                data={filteredCourses.sort((a, b) => Number(b.published) - Number(a.published))}
                renderItem={({ item }) => <CourseContainer course={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                style={{ marginHorizontal: -20 }}
                contentContainerStyle={{ gap: 10, paddingHorizontal: 20, paddingBottom: 20 }}
                ListEmptyComponent={<Text style={{ flex: 1, textAlign: "center" }}>Você ainda não possui nenhum curso</Text>}
                refreshing={refreshing}
                onRefresh={refreshCourses}
            />
        </ScrollView>
    ) : null
}

import { Image } from "expo-image"
import React, { useCallback, useEffect, useState } from "react"
import { FlatList, Pressable, ScrollView, View } from "react-native"
import { Avatar, Icon, IconButton, Surface, Text, TextInput } from "react-native-paper"
import { useUser } from "../../../../hooks/useUser"
import placeholders from "../../../../tools/placeholders"
import { Button } from "../../../../components/Button"
import { EditDescription } from "./EditDescription"
import * as ImagePicker from "expo-image-picker"
import { UserImageForm } from "../../../../types/server/class/User"
import { api } from "../../../../backend/api"
import { colors } from "../../../../style/colors"
import { NavigationProp, useFocusEffect, useNavigation } from "@react-navigation/native"
import { Course } from "../../../../types/server/class/Course"
import { CourseContainer } from "./CourseContainer"
import images from "../../../../tools/images"

interface ResumeProps {}

export const Resume: React.FC<ResumeProps> = ({}) => {
    const navigation = useNavigation<NavigationProp<any, any>>()
    const { user, setUser, refresh } = useUser()
    const creator = user?.creator

    const [uploading, setUploading] = useState<"cover" | "profile">()
    const [editingDescription, setEditingDescription] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [ownedCourses, setOwnedCourses] = useState<Course[]>([])
    const [filteredCourses, setFilteredCourses] = useState(ownedCourses)
    const [filterCourseName, setFilterCourseName] = useState("")

    const pickImage = async (aspect: [number, number]) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect,
            quality: 1,
            base64: true,
        })

        return result.assets ? result.assets[0] : null
    }

    const uploadImage = async (type: "cover" | "profile") => {
        if (!creator || uploading) return

        const image = await pickImage(type == "cover" ? [5, 2] : [1, 1])
        const filename = image?.uri.substring(image?.uri.lastIndexOf("/") + 1, image?.uri.length) || "cover.png"
        if (image?.base64) {
            setUploading(type)
            const data: UserImageForm = {
                id: creator.id,
                cover: type == "cover" ? { name: filename, base64: image.base64 } : undefined,
                image: type == "profile" ? { name: filename, base64: image.base64 } : undefined,
            }
            try {
                const response = await api.patch("/creator/image", data)
                const updated_user = response.data
                setUser(updated_user)
            } catch (error) {
                console.log(error)
            } finally {
                setUploading(undefined)
            }
        }
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
            <View style={{ position: "relative", height: 200, justifyContent: "space-between", alignItems: "flex-end", flexDirection: "row" }}>
                <Image
                    source={creator.cover || placeholders.cover}
                    style={{ width: "100%", height: 150, borderRadius: 15, position: "absolute", top: 0, left: 0, objectFit: "contain" }}
                />
                <IconButton
                    icon={"pencil-outline"}
                    style={{ position: "absolute", top: 0, right: 0 }}
                    loading={uploading == "cover"}
                    onPress={() => uploadImage("cover")}
                    mode="contained"
                />
                <Icon size={30} source={"instagram"} />
                <View style={{ position: "relative" }}>
                    <Avatar.Image size={100} source={creator.image ? { uri: creator.image } : placeholders.avatar} />
                    <IconButton
                        size={20}
                        icon={"pencil-outline"}
                        style={{ position: "absolute", top: -10, right: -10 }}
                        loading={uploading == "profile"}
                        onPress={() => uploadImage("profile")}
                        mode="contained"
                    />
                </View>
                <Image source={images.tiktok_icon} style={{ height: 30, aspectRatio: "1/1" }} contentFit="contain" />
            </View>
            <Text style={{ alignSelf: "center" }} variant="bodyLarge">
                {creator.nickname}
            </Text>
            {editingDescription ? (
                <EditDescription creator={creator} onDone={() => setEditingDescription(false)} />
            ) : (
                <Pressable onPress={() => setEditingDescription(true)}>
                    <Text numberOfLines={3} style={{ position: "relative" }}>
                        {creator.description || <Button labelStyle={{ textDecorationLine: "underline" }}>Inserir uma descrição</Button>}
                    </Text>
                </Pressable>
            )}
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
            <View style={{ flexDirection: "row", gap: 0, alignItems: "center" }}>
                <Text variant="bodyLarge">Seus Cursos</Text>
                <IconButton
                    mode="contained"
                    icon={"plus-circle"}
                    containerColor="transparent"
                    iconColor="black"
                    style={{ alignSelf: "center", margin: 0, padding: 0 }}
                    onPress={() => navigation.navigate("creator:course:form")}
                ></IconButton>
            </View>
            <FlatList
                data={filteredCourses}
                renderItem={({ item }) => <CourseContainer course={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                style={{ marginHorizontal: -20 }}
                contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}
                ListEmptyComponent={<Text style={{ flex: 1, textAlign: "center" }}>Você ainda não possui nenhum curso</Text>}
                refreshing={refreshing}
                onRefresh={refreshCourses}
            />
        </ScrollView>
    ) : null
}

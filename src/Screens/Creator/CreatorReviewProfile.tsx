import React, { useEffect, useState } from "react"
import { Dimensions, ScrollView, View } from "react-native"
import { Creator, CreatorForm } from "../../types/server/class"
import { useFormik } from "formik"
import { useUser } from "../../hooks/useUser"
import { api } from "../../backend/api"
import { PartialCreator } from "../../types/server/class/Creator"
import { ScreenTitle } from "../../components/ScreenTItle"
import { Avatar, Surface, TextInput } from "react-native-paper"
import { Image } from "expo-image"
import placeholders from "../../tools/placeholders"
import { IconButton } from "../../components/IconButton"
import { getFilename, pickMedia } from "../../tools/pickMedia"
import { ImagePickerAsset } from "expo-image-picker"
import { UserImageForm } from "../../types/server/class/User"
import { FormText } from "../../components/FormText"
import { Button } from "../../components/Button"

interface CreatorReviewProfileProps {}

export const CreatorReviewProfile: React.FC<CreatorReviewProfileProps> = ({}) => {
    const { user, setUser } = useUser()
    const creator = user!.creator!

    const [loading, setLoading] = useState(false)
    const [cover, setCover] = useState<string | null>(creator.cover)
    const [picture, setPicture] = useState<string | null>(creator.image)
    const [uploadingPicuture, setUploadingPicuture] = useState<"cover" | "profile">()

    const formik = useFormik<PartialCreator>({
        initialValues: {
            id: creator.id,
            description: creator.description,
            language: creator.language,
            nickname: creator.nickname,
            user_id: creator.user_id,
            need_send_data: false,
        },
        async onSubmit(values) {
            if (loading) return

            setLoading(true)

            try {
                const response = await api.patch("/creator", values)
                setUser(response.data)
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        },
    })

    const uploadImage = async (type: "cover" | "profile", image: ImagePickerAsset) => {
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

    const onEditImage = async (type: "cover" | "profile") => {
        if (uploadingPicuture == type) return

        const result = await pickMedia(type == "cover" ? [16, 9] : [1, 1])
        if (result) {
            setUploadingPicuture(type)
            const image = result[0]
            try {
                await uploadImage(type, image)
            } catch (error) {
                console.log(error)
            } finally {
                setUploadingPicuture(undefined)
            }
        }
    }

    useEffect(() => {
        setCover(creator.cover)
        setPicture(creator.image)
    }, [user])

    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, flex: 1, gap: 10, minHeight: Dimensions.get("screen").height }}
            keyboardShouldPersistTaps="handled"
        >
            <ScreenTitle title="Revisar perfil de criador de conteúdo" hideBackArrow />
            <View
                style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16/9",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    flexDirection: "row",
                }}
            >
                <Surface style={{ borderRadius: 15, position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                    <Image
                        source={cover || placeholders.cover}
                        style={{ width: "100%", height: "100%", borderRadius: 15 }}
                        contentFit="cover"
                        placeholderContentFit="cover"
                    />
                </Surface>
                <IconButton
                    icon={"pencil-outline"}
                    wrapperStyle={{ position: "absolute", top: 10, right: 10 }}
                    loading={uploadingPicuture == "cover"}
                    onPress={() => onEditImage("cover")}
                    mode="contained"
                />

                <View
                    style={{
                        position: "absolute",
                        flexDirection: "row",
                        width: "100%",
                        left: 0,
                        bottom: -60,
                        alignItems: "flex-end",
                    }}
                >
                    <View style={{ position: "relative", justifyContent: "center", alignItems: "center", marginHorizontal: "auto" }}>
                        <Surface style={{ borderRadius: 100 }}>
                            <Avatar.Image size={120} source={picture ? { uri: picture } : placeholders.avatar} />
                        </Surface>
                        <IconButton
                            size={20}
                            icon={"pencil-outline"}
                            wrapperStyle={{ position: "absolute", top: 0, right: 0 }}
                            loading={uploadingPicuture == "profile"}
                            onPress={() => onEditImage("profile")}
                            mode="contained"
                        />
                    </View>
                </View>
            </View>
            <View style={{ marginTop: 60, gap: 10 }}>
                <TextInput label={"Apelido"} value={formik.values.nickname} onChangeText={formik.handleChange("nickname")} mode="outlined" />
                <TextInput
                    label={"Descrição"}
                    value={formik.values.description}
                    onChangeText={formik.handleChange("description")}
                    mode="outlined"
                    multiline
                />
            </View>
            <Button
                mode="contained"
                style={{ alignSelf: "center", marginLeft: "auto" }}
                loading={loading}
                onPress={() => formik.handleSubmit()}
                disabled={!creator.cover || !creator.image || !formik.values.description || !formik.values.nickname}
            >
                Salvar
            </Button>
        </ScrollView>
    )
}

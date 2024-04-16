import React, { useRef } from "react"
import { Button, IconButton, Surface, TextInput } from "react-native-paper"
import { FlatList, ScrollView, View, ViewStyle } from "react-native"
import * as ImagePicker from "expo-image-picker"
import * as FileSystem from "expo-file-system"
import { Image } from "expo-image"
import { FileUpload } from "../../types/server/class/helpers"
import { colors } from "../../style/colors"
import { GalleryForm } from "../../types/server/class/Gallery/Gallery"
import { ResizeMode, Video } from "expo-av"
import { CourseForm, CoverForm } from "../../types/server/class/Course"
import { FormikErrors, FormikTouched } from "formik"

interface GalleryFormProps {
    gallery: GalleryForm
    setGallery: React.Dispatch<React.SetStateAction<GalleryForm>>
    cover: CoverForm | undefined
    setCover: React.Dispatch<React.SetStateAction<CoverForm | undefined>>
}

export const GalleryFormComponent: React.FC<GalleryFormProps> = ({ gallery, setGallery, cover, setCover }) => {
    const button_size = 150
    const add_media_button_style: ViewStyle = { borderStyle: "dashed", justifyContent: "center", alignItems: "center" }
    const image_style: ViewStyle = { height: "100%", width: button_size }
    const gallery_ref = useRef<FlatList>(null)

    const pickMedia = async (aspect?: [number, number]) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect,
            quality: 1,
            base64: true,
        })

        return result.assets ? result.assets[0] : null
    }

    const pickCover = async () => {
        const media = await pickMedia([16, 9])
        const filename = media?.uri.substring(media?.uri.lastIndexOf("/") + 1, media?.uri.length) || "cover"
        if (media?.base64) {
            setCover({ type: "image", file: { name: filename, base64: media.base64 } })
        } else if (media?.type == "video") {
            const base64video = await FileSystem.readAsStringAsync(media.uri, {
                encoding: "base64",
            })
            setCover({ type: "video", file: { name: filename, base64: base64video } })
        }
    }

    const addMedia = async () => {
        const media = await pickMedia()
        const filename = media?.uri.substring(media?.uri.lastIndexOf("/") + 1, media?.uri.length) || ""
        console.log({ ...media, base64: media?.base64 ? true : false })
        if (media?.base64) {
            const updated_gallery = { ...gallery }
            updated_gallery.media.push({ name: filename, base64: media.base64, type: "IMAGE" })
            setGallery(updated_gallery)
        } else if (media?.type == "video") {
            const base64video = await FileSystem.readAsStringAsync(media.uri, {
                encoding: "base64",
            })
            const updated_gallery = { ...gallery }
            updated_gallery.media.push({ name: filename, base64: base64video, type: "VIDEO" })
            setGallery(updated_gallery)
        }
        gallery_ref.current?.scrollToEnd()
    }

    const deleteMedia = (filename: string) => {
        setGallery((gallery) => ({ ...gallery, media: gallery.media.filter((item) => item.name != filename) }))
    }

    return (
        <View style={{ flex: 1, gap: 10 }}>
            <TextInput
                label="Galeria 1"
                value={gallery.name}
                onChangeText={(value) => setGallery((gallery) => ({ ...gallery, name: value }))}
                mode="flat"
                style={{ backgroundColor: "transparent" }}
            />
            <FlatList
                ref={gallery_ref}
                data={gallery.media}
                horizontal
                style={{ height: 150, marginHorizontal: -20 }}
                contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}
                showsHorizontalScrollIndicator={false}
                ListHeaderComponent={
                    <>
                        {cover ? (
                            <View style={{ position: "relative" }}>
                                {cover.type == "image" ? (
                                    <Image
                                        source={{ uri: cover.url || "data:image/png;base64," + cover.file.base64 }}
                                        style={{ width: button_size, height: button_size, borderRadius: 15 }}
                                    />
                                ) : (
                                    <Video
                                        source={{ uri: cover.url || "data:video/mp4;base64," + cover.file.base64 }}
                                        style={{ width: button_size, height: button_size, borderRadius: 15 }}
                                        resizeMode={ResizeMode.COVER}
                                        shouldPlay
                                        isLooping
                                        useNativeControls={false}
                                        isMuted
                                    />
                                )}
                                <IconButton
                                    icon={"image-edit"}
                                    style={{ position: "absolute", right: 0, top: 0, backgroundColor: colors.secondary }}
                                    iconColor={colors.primary}
                                    onPress={pickCover}
                                />
                            </View>
                        ) : (
                            <Button mode="outlined" style={add_media_button_style} contentStyle={image_style} onPress={pickCover}>
                                Capa
                            </Button>
                        )}
                    </>
                }
                ListFooterComponent={
                    <Button mode="outlined" style={add_media_button_style} contentStyle={{ height: "100%", width: button_size }} onPress={addMedia}>
                        Adicionar mídia
                    </Button>
                }
                renderItem={({ item }) => (
                    <View style={{ position: "relative" }} key={item.name}>
                        {item.type == "IMAGE" ? (
                            <Image
                                source={{ uri: item.url || "data:image/png;base64," + item.base64 }}
                                style={{ width: button_size, height: button_size, borderRadius: 15 }}
                                contentFit="cover"
                            />
                        ) : (
                            <Video
                                source={{ uri: item.url || "data:video/mp4;base64," + item.base64 }}
                                style={{ width: button_size, height: button_size, borderRadius: 15 }}
                                resizeMode={ResizeMode.COVER}
                                shouldPlay
                                isLooping
                                useNativeControls={false}
                                isMuted
                            />
                        )}
                        <IconButton
                            icon={"delete-circle"}
                            style={{ position: "absolute", right: 0, top: 0, backgroundColor: colors.secondary }}
                            iconColor={colors.primary}
                            onPress={() => deleteMedia(item.name)}
                        />
                    </View>
                )}
            />
        </View>
    )
}

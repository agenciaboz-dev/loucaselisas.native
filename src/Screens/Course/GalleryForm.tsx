import React, { useRef } from "react"
import { Button, IconButton, Surface, TextInput } from "react-native-paper"
import { FlatList, ScrollView, View, ViewStyle } from "react-native"
import * as FileSystem from "expo-file-system"
import { Image } from "expo-image"
import { FileUpload } from "../../types/server/class/helpers"
import { colors } from "../../style/colors"
import { GalleryForm } from "../../types/server/class/Gallery/Gallery"
import { ResizeMode, Video } from "expo-av"
import { CourseForm, CoverForm } from "../../types/server/class/Course"
import { FormikErrors, FormikTouched } from "formik"
import { getFilename, pickMedia } from "../../tools/pickMedia"

interface GalleryFormProps {
    gallery: GalleryForm
    setGallery: React.Dispatch<React.SetStateAction<GalleryForm>>
    cover: CoverForm | undefined
    setCover: React.Dispatch<React.SetStateAction<CoverForm | undefined>>
}

export const GalleryFormComponent: React.FC<GalleryFormProps> = ({ gallery, setGallery, cover, setCover }) => {
    const button_size = 150
    const add_media_button_style: ViewStyle = { borderStyle: "dashed", justifyContent: "center", alignItems: "center" }
    const gallery_ref = useRef<FlatList>(null)

    const addMedia = async () => {
        const result = await pickMedia(undefined, true)
        if (result) {
            const updated_gallery = { ...gallery }
            result.forEach(async (media) => {
                const filename = getFilename(media)
                console.log({ ...media, base64: media?.base64 ? true : false })
                if (media?.base64) {
                    const updated_gallery = { ...gallery }
                    updated_gallery.media.push({ name: filename, base64: media.base64, type: "IMAGE" })
                } else if (media?.type == "video") {
                    const base64video = await FileSystem.readAsStringAsync(media.uri, {
                        encoding: "base64",
                    })
                    updated_gallery.media.push({ name: filename, base64: base64video, type: "VIDEO" })
                }
            })
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
                label="Galeria"
                dense
                readOnly
                value={gallery.name}
                onChangeText={(value) => setGallery((gallery) => ({ ...gallery, name: value }))}
                mode="flat"
                style={{ backgroundColor: "transparent" }}
            />
            <Button mode="outlined" style={{ borderStyle: "dashed" }} contentStyle={{}} onPress={addMedia}>
                Adicionar mídia
            </Button>
            <FlatList
                ref={gallery_ref}
                data={gallery.media}
                horizontal
                style={{ marginHorizontal: -20 }}
                contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}
                showsHorizontalScrollIndicator={false}
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

import React, { useRef } from "react"
import { Button, IconButton, TextInput } from "react-native-paper"
import { FlatList, LayoutAnimation, View, ViewStyle } from "react-native"
import * as FileSystem from "expo-file-system"
import { Image } from "expo-image"
import { colors } from "../../style/colors"
import { GalleryForm } from "../../types/server/class/Gallery/Gallery"
import { ResizeMode, Video } from "expo-av"
import { CoverForm } from "../../types/server/class/Course"
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
            let position = updated_gallery.media.length
            result.forEach(async (media) => {
                const filename = getFilename(media)
                position += 1
                if (media?.base64) {
                    const updated_gallery = { ...gallery }
                    updated_gallery.media.push({
                        name: filename,
                        base64: media.base64,
                        type: "image",
                        position,
                        width: media.width,
                        height: media.height,
                    })
                } else if (media?.type == "video") {
                    const base64video = await FileSystem.readAsStringAsync(media.uri, {
                        encoding: "base64",
                    })
                    updated_gallery.media.push({
                        name: filename,
                        base64: base64video,
                        type: "video",
                        position,
                        width: media.width,
                        height: media.height,
                        duration: media.duration || undefined,
                    })
                }
            })
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
            setGallery(updated_gallery)
        }
        setTimeout(() => gallery_ref.current?.scrollToIndex({ index: gallery.media.length - 1, viewPosition: 1, viewOffset: -20 }), 500)
    }

    const deleteMedia = (filename: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
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
                        {item.type == "image" ? (
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

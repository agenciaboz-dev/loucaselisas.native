import React from "react"
import { Button, IconButton, Surface, TextInput } from "react-native-paper"
import { ScrollView, View, ViewStyle } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { Image } from "expo-image"
import { FileUpload } from "../../types/server/class/helpers"
import { colors } from "../../style/colors"
import { GalleryForm } from "../../types/server/class/Gallery/Gallery"

interface GalleryFormProps {
    gallery: GalleryForm
    setGallery: React.Dispatch<React.SetStateAction<GalleryForm>>
    cover: FileUpload | null
    setCover: React.Dispatch<React.SetStateAction<FileUpload | null>>
}

export const GalleryFormComponent: React.FC<GalleryFormProps> = ({ gallery, setGallery, cover, setCover }) => {
    const button_size = 150
    const add_media_button_style: ViewStyle = { borderStyle: "dashed", justifyContent: "center", alignItems: "center" }
    const image_style: ViewStyle = { height: "100%", width: button_size }

    const pickMedia = async (aspect: [number, number]) => {
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
            setCover({ name: filename, base64: media.base64 })
        }
    }

    const addMedia = async () => {
        const media = await pickMedia([16, 9])
        const filename = media?.uri.substring(media?.uri.lastIndexOf("/") + 1, media?.uri.length) || ""
        if (media?.base64) {
            const updated_gallery = { ...gallery }
            updated_gallery.media.push({ name: filename, base64: media.base64 })
            setGallery(updated_gallery)
        }
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
            <ScrollView
                horizontal
                style={{ flexDirection: "row", height: 150, marginHorizontal: -20 }}
                contentContainerStyle={{ gap: 10, flex: 1, paddingHorizontal: 20 }}
            >
                {cover ? (
                    <View style={{ position: "relative" }}>
                        <Image
                            source={{ uri: "data:image/png;base64," + cover.base64 }}
                            style={{ width: button_size, height: button_size, borderRadius: 15 }}
                        />
                        <IconButton
                            icon={"image-edit"}
                            style={{ position: "absolute", right: 0, bottom: 0, backgroundColor: colors.secondary }}
                            iconColor={colors.primary}
                            onPress={pickCover}
                        />
                    </View>
                ) : (
                    <Button mode="outlined" style={add_media_button_style} contentStyle={image_style} onPress={pickCover}>
                        Capa
                    </Button>
                )}
                <Button mode="outlined" style={add_media_button_style} contentStyle={{ height: "100%", width: button_size }} onPress={addMedia}>
                    Adicionar mídia
                </Button>
                {gallery.media.map((media, index) => (
                    <View style={{ position: "relative" }} key={media.name + index.toString()}>
                        <Image
                            source={{ uri: "data:image/png;base64," + media.base64 }}
                            style={{ width: button_size, height: button_size, borderRadius: 15 }}
                        />
                        <IconButton
                            icon={"delete-circle"}
                            style={{ position: "absolute", right: 0, bottom: 0, backgroundColor: colors.secondary }}
                            iconColor={colors.primary}
                            // onPress={pickCover}
                        />
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

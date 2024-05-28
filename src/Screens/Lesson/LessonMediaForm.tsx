import React from "react"
import { Dimensions, View } from "react-native"
import { Media, MediaForm } from "../../types/server/class/Gallery/Media"
import { Image, ImageStyle } from "expo-image"
import { ResizeMode, Video } from "expo-av"
import { IconButton, Surface, useTheme } from "react-native-paper"
import { getFilename, pickMedia } from "../../tools/pickMedia"
import * as FileSystem from "expo-file-system"
import { ImagePickerAsset, MediaTypeOptions } from "expo-image-picker"
import { Button } from "../../components/Button"

interface LessonMediaFormProps {
    thumb?: boolean
    media?: ImagePickerAsset | null | Media
    setMedia: React.Dispatch<React.SetStateAction<ImagePickerAsset | null>>
    previousUri?: string
}

export const LessonMediaForm: React.FC<LessonMediaFormProps> = ({ thumb, media, setMedia, previousUri }) => {
    const theme = useTheme()
    const image_width = Dimensions.get("screen").width * 0.9
    const max_image_height = (image_width / 16) * 9

    const media_style: ImageStyle = { width: image_width, aspectRatio: "16/9", borderRadius: 15 }

    const onUpdateMedia = async () => {
        const result = await pickMedia([16, 9], undefined, thumb ? MediaTypeOptions.Images : undefined)
        if (result) {
            const media = result[0]

            // if (!media.base64) {
            //     media.base64 = await FileSystem.readAsStringAsync(media.uri, {
            //         encoding: "base64",
            //     })
            // }

            setMedia(media)
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {media ? (
                <Surface style={{ position: "relative", borderRadius: 15 }}>
                    {thumb || media.type == "image" ? (
                        <Image
                            source={{
                                uri: thumb ? media.uri || media : media.url || media.uri || "data:image/png;base64," + media.base64,
                            }}
                            style={media_style}
                            contentFit="cover"
                            placeholderContentFit="cover"
                        />
                    ) : (
                        <Video
                            source={{ uri: media.url || media.uri || "data:video/mp4;base64," + media.base64 }}
                            style={media_style}
                            resizeMode={ResizeMode.COVER}
                            useNativeControls
                            isLooping
                            onError={(error) => console.log({ error })}
                        />
                    )}
                    <IconButton
                        icon={"pencil-outline"}
                        style={{ position: "absolute", right: 5, top: 5 }}
                        containerColor={theme.colors.background}
                        onPress={onUpdateMedia}
                    />
                </Surface>
            ) : (
                <Button
                    mode="outlined"
                    style={{ borderStyle: "dashed", width: "100%", aspectRatio: "16/9" }}
                    contentStyle={{ height: "100%" }}
                    onPress={onUpdateMedia}
                >
                    {thumb ? "Envie uma thumbnail" : "Envie uma mídia"}
                </Button>
            )}
        </View>
    )
}

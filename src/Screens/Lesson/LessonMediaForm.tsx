import React from "react"
import { Dimensions, View } from "react-native"
import { MediaForm } from "../../types/server/class/Gallery/Media"
import { Image, ImageStyle } from "expo-image"
import { ResizeMode, Video } from "expo-av"
import { IconButton, useTheme } from "react-native-paper"
import { getFilename, pickMedia } from "../../tools/pickMedia"
import * as FileSystem from "expo-file-system"
import { MediaTypeOptions } from "expo-image-picker"
import { Button } from "../../components/Button"

interface LessonMediaFormProps {
    thumb?: boolean
    media: MediaForm | null
    setMedia: React.Dispatch<React.SetStateAction<MediaForm | null>>
}

export const LessonMediaForm: React.FC<LessonMediaFormProps> = ({ thumb, media, setMedia }) => {
    const theme = useTheme()
    const image_width = Dimensions.get("screen").width * 0.9
    const max_image_height = (image_width / 16) * 9

    const media_style: ImageStyle = { width: image_width, aspectRatio: "16/9", borderRadius: 15 }

    const onUpdateMedia = async () => {
        const result = await pickMedia([16, 9], undefined, thumb ? MediaTypeOptions.Images : undefined)
        if (result) {
            const media = result[0]

            if (!media.base64) {
                media.base64 = await FileSystem.readAsStringAsync(media.uri, {
                    encoding: "base64",
                })
            }

            setMedia({
                height: media.height,
                name: getFilename(media),
                position: 1,
                type: media.type == "image" ? "IMAGE" : "VIDEO",
                width: media.width,
                base64: media.base64,
            })
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {media ? (
                <View style={{ position: "relative" }}>
                    {media.type == "IMAGE" ? (
                        <Image source={{ uri: media.url || "data:image/png;base64," + media.base64 }} style={media_style} contentFit="cover" />
                    ) : (
                        <Video
                            source={{ uri: media.url || "data:video/mp4;base64," + media.base64 }}
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
                </View>
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

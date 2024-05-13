import { Image } from "expo-image"
import { ImagePickerAsset } from "expo-image-picker"
import React, { useEffect, useLayoutEffect, useState } from "react"
import { LayoutAnimation, View } from "react-native"
import placeholders from "../tools/placeholders"
import { Avatar, Surface, Text, TextInput, TouchableRipple, useTheme } from "react-native-paper"
import { pickMedia } from "../tools/pickMedia"
import images from "../tools/images"
import { colors } from "../style/colors"
import { Button } from "./Button"
import { SocialMediaIcon } from "./SocialMediaIcon"
import { IconButton } from "./IconButton"

interface ManageProfileCardProps {
    cover: string | null
    picture: string | null
    onUpdatePicture?: (image: ImagePickerAsset) => Promise<void>
    onUpdateCover?: (image: ImagePickerAsset) => Promise<void>
    name: string
    description: string
    onUpdateDescription?: (text: string) => Promise<void>
    instagram: string | null
    tiktok: string | null
    readOnly?: boolean
}

export const ManageProfileCard: React.FC<ManageProfileCardProps> = (props) => {
    const {
        cover,
        picture,
        onUpdatePicture,
        onUpdateCover,
        name,
        description,
        onUpdateDescription,
        instagram,
        tiktok,
        readOnly,
    } = props
    const theme = useTheme()

    const [uploadingPicuture, setUploadingPicuture] = useState<"cover" | "profile">()
    const [savingDescription, setSavingDescription] = useState(false)
    const [editing, setEditing] = useState(false)
    const [descriptionState, setDescriptionState] = useState(description)
    const [extendedDescription, setExtendedDescription] = useState(false)

    const toggleEditing = () => {
        setEditing((value) => !value)
    }

    const onEditImage = async (type: "cover" | "profile") => {
        if (uploadingPicuture == type || !onUpdateCover || !onUpdatePicture) return

        const result = await pickMedia(type == "cover" ? [16, 9] : [1, 1])
        if (result) {
            setUploadingPicuture(type)
            const image = result[0]
            try {
                if (type == "cover") {
                    await onUpdateCover(image)
                } else {
                    await onUpdatePicture(image)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setUploadingPicuture(undefined)
            }
        }
    }

    const onEditDescription = async () => {
        if (savingDescription || !onUpdateDescription) return

        setSavingDescription(true)
        try {
            await onUpdateDescription(descriptionState)
        } catch (error) {
            console.log(error)
        } finally {
            setSavingDescription(false)
        }
    }

    const extendDescription = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setExtendedDescription((value) => !value)
    }

    useEffect(() => {
        if (!editing && descriptionState != description) {
            onEditDescription()
        }
    }, [editing])

    useLayoutEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    }, [editing])

    return (
        <View style={{}}>
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
                {editing && (
                    <IconButton
                        icon={"pencil-outline"}
                        wrapperStyle={{ position: "absolute", top: 10, right: 10 }}
                        loading={uploadingPicuture == "cover"}
                        onPress={() => onEditImage("cover")}
                        mode="contained"
                    />
                )}

                {/*  */}
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
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <SocialMediaIcon
                            source={images.instagram_icon}
                            deep_link={`instagram://user?username=${instagram}`}
                            web_url={`https://instagram.com/${instagram}`}
                        />
                        <SocialMediaIcon
                            source={images.tiktok_icon}
                            deep_link={`https://tiktok.com/@${tiktok}`}
                            web_url={`https://tiktok.com/@${tiktok}`}
                        />
                    </View>
                    <View style={{ flex: 1, position: "relative", justifyContent: "center", alignItems: "center" }}>
                        <Surface style={{ borderRadius: 100 }}>
                            <Avatar.Image size={120} source={picture ? { uri: picture } : placeholders.avatar} />
                        </Surface>
                        {editing && (
                            <IconButton
                                size={20}
                                icon={"pencil-outline"}
                                wrapperStyle={{ position: "absolute", top: 0, right: 0 }}
                                loading={uploadingPicuture == "profile"}
                                onPress={() => onEditImage("profile")}
                                mode="contained"
                            />
                        )}
                    </View>
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                        {!readOnly && (
                            <IconButton
                                icon={editing ? "check" : "pencil"}
                                iconColor={editing ? theme.colors.background : theme.colors.primary}
                                containerColor={editing ? theme.colors.primary : theme.colors.background}
                                onPress={toggleEditing}
                                loading={savingDescription}
                            />
                        )}
                    </View>
                </View>
                {/*  */}
            </View>
            <Text style={{ alignSelf: "center", marginTop: 60 }} variant="bodyLarge">
                {name}
            </Text>

            {editing ? (
                <TextInput
                    mode="outlined"
                    multiline
                    value={descriptionState}
                    onChangeText={setDescriptionState}
                    numberOfLines={5}
                    style={{ backgroundColor: "transparent", paddingVertical: 10, marginTop: 10 }}
                    disabled={savingDescription}
                />
            ) : (
                <View style={{ position: "relative", marginBottom: -10 }}>
                    <Text numberOfLines={!extendedDescription ? 3 : undefined} style={{ position: "relative", marginTop: 10 }}>
                        {description || <Button labelStyle={{ textDecorationLine: "underline" }}>Inserir uma descrição</Button>}
                    </Text>
                    <TouchableRipple onPress={extendDescription} style={{ bottom: -10, right: 0, position: "absolute" }}>
                        <Text style={{ textDecorationLine: "underline" }}>ler {extendedDescription ? "menos" : "mais"}...</Text>
                    </TouchableRipple>
                </View>
            )}
        </View>
    )
}

import { Image } from "expo-image"
import { ImagePickerAsset } from "expo-image-picker"
import React, { useEffect, useState } from "react"
import { View } from "react-native"
import placeholders from "../tools/placeholders"
import { Avatar, IconButton, Text, TextInput } from "react-native-paper"
import { pickMedia } from "../tools/pickMedia"
import images from "../tools/images"
import { colors } from "../style/colors"
import { Button } from "./Button"

interface ManageProfileCardProps {
    cover: string | null
    picture: string | null
    onUpdatePicture: (image: ImagePickerAsset) => Promise<void>
    onUpdateCover: (image: ImagePickerAsset) => Promise<void>
    name: string
    description: string
    onUpdateDescription: (text: string) => Promise<void>
}

export const ManageProfileCard: React.FC<ManageProfileCardProps> = ({
    cover,
    picture,
    onUpdatePicture,
    onUpdateCover,
    name,
    description,
    onUpdateDescription,
}) => {
    const [uploadingPicuture, setUploadingPicuture] = useState<"cover" | "profile">()
    const [savingDescription, setSavingDescription] = useState(false)
    const [editing, setEditing] = useState(false)
    const [descriptionState, setDescriptionState] = useState(description)

    const onEditImage = async (type: "cover" | "profile") => {
        if (uploadingPicuture == type) return

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
        if (savingDescription) return

        setSavingDescription(true)
        try {
            await onUpdateDescription(descriptionState)
        } catch (error) {
            console.log(error)
        } finally {
            setSavingDescription(false)
        }
    }

    useEffect(() => {
        if (!editing && descriptionState != description) {
            onEditDescription()
        }
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
                <Image
                    source={cover || placeholders.cover}
                    style={{ width: "100%", height: "100%", borderRadius: 15, position: "absolute", top: 0, left: 0 }}
                    contentFit="cover"
                />
                {editing && (
                    <IconButton
                        icon={"pencil-outline"}
                        style={{ position: "absolute", top: 0, right: 0 }}
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
                        <Image source={images.instagram_icon} style={{ height: 30, aspectRatio: "1/1" }} contentFit="contain" />
                        <Image source={images.tiktok_icon} style={{ height: 30, aspectRatio: "1/1" }} contentFit="contain" />
                    </View>
                    <View style={{ flex: 1, position: "relative", justifyContent: "center", alignItems: "center" }}>
                        <Avatar.Image size={120} source={picture ? { uri: picture } : placeholders.avatar} />
                        {editing && (
                            <IconButton
                                size={20}
                                icon={"pencil-outline"}
                                style={{ position: "absolute", top: -10, right: -10 }}
                                loading={uploadingPicuture == "profile"}
                                onPress={() => onEditImage("profile")}
                                mode="contained"
                            />
                        )}
                    </View>
                    <View style={{ flex: 1, alignItems: "flex-end" }}>
                        <IconButton
                            icon={"pencil"}
                            iconColor={editing ? colors.secondary : colors.primary}
                            containerColor={editing ? colors.primary : colors.secondary}
                            onPress={() => setEditing((value) => !value)}
                            loading={savingDescription}
                        />
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
                    label={"Descrição"}
                    value={descriptionState}
                    onChangeText={setDescriptionState}
                    numberOfLines={5}
                    style={{ backgroundColor: "transparent" }}
                    disabled={savingDescription}
                />
            ) : (
                <Text numberOfLines={3} style={{ position: "relative" }}>
                    {description || <Button labelStyle={{ textDecorationLine: "underline" }}>Inserir uma descrição</Button>}
                </Text>
            )}
        </View>
    )
}
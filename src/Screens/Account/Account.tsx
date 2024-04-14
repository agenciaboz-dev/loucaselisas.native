import { NavigationProp } from "@react-navigation/native"
import React, { useState } from "react"
import { Pressable, TouchableOpacity, View } from "react-native"
import { Avatar, Button, Icon, IconButton, Surface, Text } from "react-native-paper"
import { useUser } from "../../hooks/useUser"
import placeholders from "../../tools/placeholders"
import { Image } from "expo-image"
import { EditBio } from "./EditBio"
import * as ImagePicker from "expo-image-picker"
import { api } from "../../backend/api"
import { UserImageForm } from "../../types/server/class/User"
import { MenuGroup } from "./MenuGroup"

interface AccountProps {
    navigation: NavigationProp<any, any>
}

export const Account: React.FC<AccountProps> = ({ navigation }) => {
    const { user, setUser } = useUser()

    const [edittingBio, setEdittingBio] = useState(false)
    const [uploading, setUploading] = useState<"cover" | "profile">()

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
        if (!user || uploading) return

        const image = await pickImage(type == "cover" ? [5, 2] : [1, 1])
        const filename = image?.uri.substring(image?.uri.lastIndexOf("/") + 1, image?.uri.length) || "cover.png"
        if (image?.base64) {
            setUploading(type)
            const data: UserImageForm = {
                id: user.id,
                cover: type == "cover" ? { name: filename, base64: image.base64 } : undefined,
                image: type == "profile" ? { name: filename, base64: image.base64 } : undefined,
            }
            try {
                const response = await api.patch("/user/image", data)
                const updated_user = response.data
                setUser(updated_user)
            } catch (error) {
                console.log(error)
            } finally {
                setUploading(undefined)
            }
        }
    }

    return user ? (
        <Surface style={{ flex: 1, padding: 20, gap: 10 }}>
            <View style={{ position: "relative", height: 200, justifyContent: "space-between", alignItems: "flex-end", flexDirection: "row" }}>
                <Image
                    source={user.cover || placeholders.cover_placeholder}
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
                    <Avatar.Image size={100} source={{ uri: user.image || placeholders.avatar_placeholder }} />
                    <IconButton
                        size={20}
                        icon={"pencil-outline"}
                        style={{ position: "absolute", top: -10, right: -10 }}
                        loading={uploading == "profile"}
                        onPress={() => uploadImage("profile")}
                        mode="contained"
                    />
                </View>
                <Icon size={30} source={"instagram"} />
            </View>
            <Text style={{ alignSelf: "center" }} variant="bodyLarge">
                {user.name}
            </Text>
            {edittingBio ? (
                <EditBio user={user} onDone={() => setEdittingBio(false)} />
            ) : (
                <Pressable onPress={() => setEdittingBio(true)}>
                    <Text numberOfLines={3} style={{ position: "relative" }}>
                        {user.bio || <Button labelStyle={{ textDecorationLine: "underline" }}>Inserir uma bio</Button>}
                    </Text>
                </Pressable>
            )}
            <MenuGroup
                title="Conta"
                menuItems={[
                    { title: "Gerenciar seu plano", icon: "currency-usd", route: "setup:plan" },
                    { title: "Editar perfil", icon: "account", route: "setup:profile" },
                    { title: "Deletar conta", icon: "alpha-x-circle-outline", route: "setup:delete" },
                ]}
            />
            <MenuGroup
                title="Pagamento"
                menuItems={[
                    { title: "Histórico de pedidos", icon: "refresh", route: "setup:account" },
                    { title: "Cartões de pagamento salvos", icon: "credit-card", route: "setup:profile" },
                ]}
            />
        </Surface>
    ) : null
}

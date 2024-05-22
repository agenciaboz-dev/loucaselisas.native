import { NavigationProp } from "@react-navigation/native"
import React, { useState } from "react"
import { Pressable, ScrollView, TouchableOpacity, View } from "react-native"
import { Avatar, Button, Icon, IconButton, Surface, Text } from "react-native-paper"
import { useUser } from "../../hooks/useUser"
import placeholders from "../../tools/placeholders"
import { Image } from "expo-image"
import * as ImagePicker from "expo-image-picker"
import { api } from "../../backend/api"
import { PartialUser, UserImageForm } from "../../types/server/class/User"
import { MenuGroup } from "./MenuGroup"
import images from "../../tools/images"
import { ManageProfileCard } from "../../components/ManageProfileCard"
import { getFilename } from "../../tools/pickMedia"

interface AccountProps {
    navigation: NavigationProp<any, any>
}

export const Account: React.FC<AccountProps> = ({ navigation }) => {
    const { user, setUser } = useUser()

    const [edittingBio, setEdittingBio] = useState(false)

    const uploadImage = async (type: "cover" | "profile", image: ImagePicker.ImagePickerAsset) => {
        if (!user) return

        if (image.base64) {
            const filename = getFilename(image)
            const data: UserImageForm = {
                id: user.id,
                cover: type == "cover" ? { name: filename, base64: image.base64 } : undefined,
                image: type == "profile" ? { name: filename, base64: image.base64 } : undefined,
            }
            const response = await api.patch("/user/image", data)
            const updated_user = response.data
            setUser(updated_user)
        }
    }

    const onUpdateBio = async (text: string) => {
        if (!user) return

        const data: PartialUser = { id: user.id, bio: text }
        const response = await api.patch("/user", data)
        const updated_user = response.data
        setUser(updated_user)
    }

    return user ? (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, gap: 10 }} showsVerticalScrollIndicator={false}>
            <ManageProfileCard
                cover={user.cover}
                picture={user.image}
                name={user.name}
                description={user.bio || ""}
                instagram={user.instagram}
                tiktok={user.tiktok}
                onUpdateCover={(image) => uploadImage("cover", image)}
                onUpdatePicture={(image) => uploadImage("profile", image)}
                onUpdateDescription={onUpdateBio}
            />
            <MenuGroup
                title="Conta"
                menuItems={[
                    // { title: "Gerenciar seu plano", icon: "currency-usd", route: "setup:plan" },
                    { title: "Editar perfil", icon: "account", route: "setup:profile:edit" },
                    { title: "Deletar conta", icon: "alpha-x-circle-outline", route: "setup:delete" },
                ]}
            />
            {/* <MenuGroup
                title="Pagamento"
                menuItems={[
                    { title: "Histórico de pedidos", icon: "refresh", route: "setup:plan:history" },
                    { title: "Cartões de pagamento salvos", icon: "credit-card", route: "setup:cards" },
                ]}
            /> */}
        </ScrollView>
    ) : null
}

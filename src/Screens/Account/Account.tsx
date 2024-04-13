import { NavigationProp } from "@react-navigation/native"
import React, { useState } from "react"
import { Pressable, TouchableOpacity, View } from "react-native"
import { Avatar, Button, Icon, IconButton, Surface, Text } from "react-native-paper"
import { useUser } from "../../hooks/useUser"
import placeholders from "../../tools/placeholders"
import { Image } from "expo-image"
import { EditBio } from "./EditBio"

interface AccountProps {
    navigation: NavigationProp<any, any>
}

export const Account: React.FC<AccountProps> = ({ navigation }) => {
    const { user } = useUser()

    const [edittingBio, setEdittingBio] = useState(false)

    return user ? (
        <Surface style={{ flex: 1, padding: 20, gap: 10 }}>
            <View style={{ position: "relative", height: 200, justifyContent: "space-between", alignItems: "flex-end", flexDirection: "row" }}>
                <Image
                    source={user.cover || placeholders.cover_placeholder}
                    style={{ width: "100%", height: 150, borderRadius: 15, position: "absolute", top: 0, left: 0, objectFit: "contain" }}
                />
                <Icon size={30} source={"instagram"} />
                <Avatar.Image size={100} source={{ uri: user.image || placeholders.avatar_placeholder }} />
                <Icon size={30} source={"instagram"} />
            </View>
            <Text style={{ alignSelf: "center" }} variant="bodyLarge">
                {user.name}
            </Text>
            {edittingBio ? (
                <EditBio user={user} onDone={() => setEdittingBio(false)} />
            ) : (
                <Pressable onPress={() => setEdittingBio(true)}>
                    <Text numberOfLines={5} style={{ position: "relative" }}>
                        {user.bio || <Button labelStyle={{ textDecorationLine: "underline" }}>Inserir uma bio</Button>}
                    </Text>
                </Pressable>
            )}
        </Surface>
    ) : null
}

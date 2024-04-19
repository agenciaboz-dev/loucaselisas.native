import { NavigationProp, RouteProp } from "@react-navigation/native"
import React from "react"
import { View } from "react-native"
import { ManageProfileCard } from "../../components/ManageProfileCard"
import { useUser } from "../../hooks/useUser"

interface ProfileProps {
    navigation: NavigationProp<any, any>
    route: RouteProp<any, any>
}

export const Profile: React.FC<ProfileProps> = ({ navigation, route }) => {
    const { user } = useUser()

    return user ? (
        <View style={{ flex: 1, padding: 20 }}>
            <ManageProfileCard
                cover={user.cover}
                description={user.bio || ""}
                instagram={user.instagram}
                name={user.name}
                picture={user.image}
                tiktok={user.tiktok}
                readOnly
            />
        </View>
    ) : null
}

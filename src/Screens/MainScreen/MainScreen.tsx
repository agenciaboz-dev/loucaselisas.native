import React from "react"
import { Surface, Text } from "react-native-paper"
import { useUser } from "../../hooks/useUser"

interface MainScreenProps {}

export const MainScreen: React.FC<MainScreenProps> = ({}) => {
    const { user } = useUser()

    return user ? (
        <Surface style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>{user.name}</Text>
        </Surface>
    ) : null
}

import React from "react"
import { Icon, Surface, Text } from "react-native-paper"
import { useUser } from "../../hooks/useUser"
import { BottomTabs } from "../../components/BottomTabs"

interface MainScreenProps {}

export const MainScreen: React.FC<MainScreenProps> = ({}) => {
    const { user } = useUser()

    return user ? (
        <Surface style={{ flex: 1 }}>
            <BottomTabs />
        </Surface>
    ) : null
}

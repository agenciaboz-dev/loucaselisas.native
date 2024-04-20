import React from "react"
import { useUser } from "../../hooks/useUser"
import { BottomTabs } from "../../components/BottomTabs"
import { View } from "react-native"

interface MainScreenProps {}

export const MainScreen: React.FC<MainScreenProps> = ({}) => {
    const { user } = useUser()

    return user ? (
        <View style={{ flex: 1 }}>
            <BottomTabs />
        </View>
    ) : null
}

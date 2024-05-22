import React from "react"
import { View } from "react-native"
import { Text } from "react-native-paper"
import { ScreenTitle } from "../../../components/ScreenTItle"

interface SuportScreenProps {}

export const SupportScreen: React.FC<SuportScreenProps> = ({}) => {
    return (
        <View style={{ flex: 1, padding: 20, gap: 10 }}>
            <ScreenTitle title="Suporte" />
            <Text selectable={true}>E-mail: contato@loucaselisas.com.br</Text>
            <Text selectable={true}>Whatsapp: (48) 9 9940-1049</Text>
            <Text selectable={true}>SAC: (48) 3660-0338</Text>
        </View>
    )
}

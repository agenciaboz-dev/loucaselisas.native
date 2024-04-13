import { NavigationProp } from "@react-navigation/native"
import React from "react"
import { TouchableOpacity } from "react-native"
import { Icon, Surface, Text } from "react-native-paper"

interface SetupProps {
    navigation: NavigationProp<any, any>
}

export const Setup: React.FC<SetupProps> = ({ navigation }) => {
    const account_menus = [
        { icon: "account", label: "Ver conta", route: "account_details" },
        { icon: "account-circle", label: "Perfil", route: "account_profile" },
        { icon: "alpha-x-circle-outline", label: "Sair", route: "home" },
    ]

    const other_menus = [
        { icon: "face-agent", label: "Suporte", route: "support" },
        { icon: "download", label: "Baixados", route: "downloaded" },
        { icon: "shield-alert", label: "Privacidade", route: "privacy" },
        { icon: "wifi", label: "Termos", route: "terms" },
    ]

    return (
        <Surface style={{ flex: 1, padding: 20, gap: 20 }}>
            <Surface style={{ padding: 20, borderRadius: 15, gap: 20 }}>
                {account_menus.map((menu) => (
                    <TouchableOpacity
                        key={menu.route}
                        style={{ flexDirection: "row", width: "100%", alignItems: "center", gap: 20 }}
                        onPress={() => console.log(menu.route)}
                    >
                        <Icon size={24} source={menu.icon} />
                        <Text>{menu.label}</Text>
                    </TouchableOpacity>
                ))}
            </Surface>

            <Surface style={{ padding: 20, borderRadius: 15, gap: 20 }}>
                {other_menus.map((menu) => (
                    <TouchableOpacity
                        key={menu.route}
                        style={{ flexDirection: "row", width: "100%", alignItems: "center", gap: 20 }}
                        onPress={() => console.log(menu.route)}
                    >
                        <Icon size={24} source={menu.icon} />
                        <Text>{menu.label}</Text>
                    </TouchableOpacity>
                ))}
            </Surface>
        </Surface>
    )
}

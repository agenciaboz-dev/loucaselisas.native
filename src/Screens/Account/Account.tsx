import { NavigationProp } from "@react-navigation/native"
import React from "react"
import { TouchableOpacity } from "react-native"
import { Icon, Surface } from "react-native-paper"

interface AccountProps {
    navigation: NavigationProp<any, any>
}

export const Account: React.FC<AccountProps> = ({ navigation }) => {
    const account_menus = [{ icon: "account", label: "Ver conta", route: "account_details" }]

    return (
        <>
            <Surface style={{ flex: 1, padding: 20 }}>
                <Surface style={{ padding: 20 }}>
                    {account_menus.map((menu) => (
                        <TouchableOpacity style={{ flexDirection: "row", width: "100%", alignItems: "center" }}>
                            <Icon size={24} source={menu.icon} />
                        </TouchableOpacity>
                    ))}
                </Surface>
            </Surface>
        </>
    )
}

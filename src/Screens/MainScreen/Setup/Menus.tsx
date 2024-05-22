import { NavigationProp } from "@react-navigation/native"
import React from "react"
import { TouchableOpacity, View, ViewStyle } from "react-native"
import { Icon, Surface, Text, TouchableRipple } from "react-native-paper"
import { SetupMenu } from "../../../types/SetupMenu"
import { useUser } from "../../../hooks/useUser"

interface MenusProps {
    navigation: NavigationProp<any, any>
}

export const Menus: React.FC<MenusProps> = ({ navigation }) => {
    const { logout } = useUser()

    const account_menus: SetupMenu[] = [
        { icon: "account", label: "Ver conta", route: "setup:account" },
        { icon: "account-circle", label: "Perfil", route: "setup:profile" },
        { icon: "alpha-x-circle-outline", label: "Sair", route: "home", onPress: logout },
    ]

    const other_menus: SetupMenu[] = [
        { icon: "face-agent", label: "Suporte", route: "setup:support" },
        // { icon: "download", label: "Baixados", route: "downloaded" },
        { icon: "shield-alert", label: "Privacidade", route: "setup:privacy" },
        { icon: "wifi", label: "Termos", route: "setup:terms" },
    ]

    const wrapper_style: ViewStyle = { borderRadius: 15 }

    const touchable_style: ViewStyle = {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        gap: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
    }

    const onMenuPress = (menu: SetupMenu) => {
        try {
            if (menu.onPress) {
                menu.onPress()
            } else {
                navigation.navigate(menu.route)
            }
        } catch (error) {
            console.log(`there is no route called ${menu.route}`)
        }
    }

    return (
        <View style={{ flex: 1, padding: 20, gap: 20 }}>
            <Surface style={wrapper_style}>
                {account_menus.map((menu, index) => (
                    <TouchableRipple
                        borderless
                        key={menu.route}
                        style={[
                            touchable_style,
                            index == 0
                                ? { borderTopLeftRadius: 15, borderTopRightRadius: 15 }
                                : index == account_menus.length - 1
                                ? { borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }
                                : undefined,
                        ]}
                        onPress={() => onMenuPress(menu)}
                    >
                        <>
                            <Icon size={24} source={menu.icon} />
                            <Text>{menu.label}</Text>
                        </>
                    </TouchableRipple>
                ))}
            </Surface>

            <Surface style={wrapper_style}>
                {other_menus.map((menu, index) => (
                    <TouchableRipple
                        borderless
                        key={menu.route}
                        style={[
                            touchable_style,
                            index == 0
                                ? { borderTopLeftRadius: 15, borderTopRightRadius: 15 }
                                : index == other_menus.length - 1
                                ? { borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }
                                : undefined,
                        ]}
                        onPress={() => onMenuPress(menu)}
                    >
                        <>
                            <Icon size={24} source={menu.icon} />
                            <Text>{menu.label}</Text>
                        </>
                    </TouchableRipple>
                ))}
            </Surface>
        </View>
    )
}

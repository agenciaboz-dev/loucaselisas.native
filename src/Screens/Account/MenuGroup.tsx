import React from "react"
import { Surface, Text } from "react-native-paper"
import { MenuItem, MenuItemType } from "./MenuItem"
import { View } from "react-native"

interface MenuGroupProps {
    title: string
    menuItems: MenuItemType[]
}

export const MenuGroup: React.FC<MenuGroupProps> = ({ title, menuItems }) => {
    return (
        <View style={{ gap: 5, paddingTop: 10 }}>
            <Text variant="bodyLarge">{title}</Text>
            {menuItems.map((item) => (
                <MenuItem key={item.route} icon={item.icon} route={item.route} title={item.title} />
            ))}
        </View>
    )
}

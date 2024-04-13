import React from "react"
import { Icon, Surface, Text } from "react-native-paper"
import { useUser } from "../../hooks/useUser"
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import { Panel } from "./Panel/Panel"
import { colors } from "../../style/colors"
import { View } from "react-native"
import { navigation_theme, paper_theme } from "../../style/theme"
import { Search } from "./Search/Search"
import { Favorites } from "./Favorites/Favorites"
import { Setup } from "./Setup/Setup"

interface MainScreenProps {}

const Tab = createMaterialBottomTabNavigator()

const getIcon = (name: string, focused: boolean) => <Icon color={focused ? colors.secondary : colors.primary} size={24} source={name} />

export const MainScreen: React.FC<MainScreenProps> = ({}) => {
    const { user } = useUser()

    return user ? (
        <Surface style={{ flex: 1 }}>
            <Tab.Navigator
                theme={paper_theme}
                initialRouteName="panel"
                activeColor={colors.primary}
                inactiveColor={colors.primary}
                activeIndicatorStyle={{ backgroundColor: colors.primary }}
            >
                <Tab.Screen
                    name="panel"
                    component={Panel}
                    options={{
                        tabBarLabel: "Painel",
                        tabBarIcon: (tab) => getIcon("apps", tab.focused),
                    }}
                />
                <Tab.Screen
                    name="search"
                    component={Search}
                    options={{ tabBarLabel: "Buscar", tabBarIcon: (tab) => getIcon("magnify", tab.focused) }}
                />
                <Tab.Screen
                    name="favorites"
                    component={Favorites}
                    options={{ tabBarLabel: "Favoritos", tabBarIcon: (tab) => getIcon("heart-outline", tab.focused) }}
                />
                <Tab.Screen
                    name="setup"
                    component={Setup}
                    options={{ tabBarLabel: "Config", tabBarIcon: (tab) => getIcon("cog-outline", tab.focused) }}
                />
            </Tab.Navigator>
        </Surface>
    ) : null
}

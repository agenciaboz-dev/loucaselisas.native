import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import React from "react"
import { Icon, Surface } from "react-native-paper"
import { colors } from "../style/colors"
import { paper_theme } from "../style/theme"
import { Panel } from "../Screens/MainScreen/Panel/Panel"
import { Search } from "../Screens/MainScreen/Search/Search"
import { Favorites } from "../Screens/MainScreen/Favorites/Favorites"
import { Setup } from "../Screens/MainScreen/Setup/Setup"
import { Account } from "../Screens/Account/Account"
import { useUser } from "../hooks/useUser"
import { CreatorStack } from "../Screens/Creator/CreatorStack"

interface BottomTabsProps {}

const Tab = createMaterialBottomTabNavigator()

const getIcon = (name: string, focused: boolean) => <Icon color={focused ? colors.secondary : colors.primary} size={24} source={name} />

export const BottomTabs: React.FC<BottomTabsProps> = ({}) => {
    const { user } = useUser()
    return user ? (
        <Tab.Navigator
            theme={paper_theme}
            initialRouteName={!!user.creator ? "creator" : "panel"}
            activeColor={colors.primary}
            inactiveColor={colors.primary}
            activeIndicatorStyle={{ backgroundColor: colors.primary }}
            sceneAnimationEnabled={true}
            sceneAnimationType="shifting"
        >
            <Tab.Screen
                name="panel"
                component={Panel}
                options={{
                    tabBarLabel: "Painel",
                    tabBarIcon: (tab) => getIcon("apps", tab.focused),
                }}
            />
            {user.creator && (
                <Tab.Screen
                    name="creator"
                    component={CreatorStack}
                    options={{ tabBarLabel: "Criador", tabBarIcon: (tab) => getIcon("account", tab.focused) }}
                />
            )}
            <Tab.Screen name="search" component={Search} options={{ tabBarLabel: "Buscar", tabBarIcon: (tab) => getIcon("magnify", tab.focused) }} />
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
    ) : null
}

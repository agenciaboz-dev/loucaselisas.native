import { NavigationProp } from "@react-navigation/native"
import React, { useState } from "react"
import { Surface, Text, useTheme } from "react-native-paper"
import { SceneMap, TabBar, TabView } from "react-native-tab-view"
import { Resume } from "./Resume/Resume"
import { CommentsTab } from "./CommentsTab/CommentsTab"
import { Statistics } from "./Statistics/Statistics"
import { colors } from "../../../style/colors"
import { View } from "react-native"
import { CreatorStackList } from "../CreatorStack"

interface CreatorHomeProps {
    navigation: NavigationProp<CreatorStackList, "creator:home">
}

const renderScene = SceneMap({ resume: Resume, comments: CommentsTab, statistics: Statistics })

export const CreatorHome: React.FC<CreatorHomeProps> = ({ navigation }) => {
    const theme = useTheme()

    const [index, setIndex] = useState(0)
    const [routes] = useState([
        { key: "resume", title: "Resumo" },
        { key: "comments", title: "Comentários" },
        { key: "statistics", title: "Estatísticas" },
    ])

    return (
        <View style={{ flex: 1 }}>
            <TabView
                navigationState={{ index, routes }}
                onIndexChange={setIndex}
                renderScene={renderScene}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        style={{
                            backgroundColor: theme.colors.background,
                            elevation: 0,
                            shadowOpacity: 0,
                            paddingBottom: routes[index].key === "resume" ? 10 : 0,
                            borderBottomColor: routes[index].key === "resume" ? "#ddd" : "transparent",
                            borderBottomWidth: routes[index].key === "resume" ? 1 : 0,
                        }}
                        labelStyle={{ color: colors.primary, textTransform: "none" }}
                        indicatorStyle={{
                            backgroundColor: "black",
                            borderRadius: 5,
                            height: 5,
                            width: 50,
                            marginBottom: routes[index].key === "resume" ? 10 : 0,
                        }}
                        indicatorContainerStyle={{ marginHorizontal: "10.7%" }}
                    />
                )}
            />
        </View>
    )
}

import { NavigationProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useState } from "react"
import { FlatList, ScrollView, View } from "react-native"
import { Surface, Text, TextInput, useTheme } from "react-native-paper"
import { ScreenTitle } from "../../../components/ScreenTItle"
import { Category } from "../../../types/server/class/Category"
import { api } from "../../../backend/api"
import { CategoryContainer } from "./CategoryContainer"

interface SearchProps {
    navigation: NavigationProp<any, any>
}

export const Search: React.FC<SearchProps> = ({ navigation }) => {
    const theme = useTheme()

    const [searchText, setSearchText] = useState("")
    const [categories, setCategories] = useState<Category[]>([])
    const [refreshing, setRefreshing] = useState(true)

    const searchCourses = async () => {
        if (searchText) {
            navigation.navigate("search:courses", { text: searchText })
        }
    }

    const refresh = async () => {
        setRefreshing(true)
        try {
            const response = await api.get("category/list")
            setCategories(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setRefreshing(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            refresh()
        }, [])
    )

    return (
        <View style={{ flex: 1, padding: 20, paddingTop: 10 }}>
            <ScreenTitle title="Explorar" hideBackArrow />
            <TextInput
                placeholder={"Pesquisar Cursos"}
                mode="outlined"
                value={searchText}
                onChangeText={setSearchText}
                style={{ backgroundColor: theme.colors.surfaceDisabled }}
                outlineStyle={{ borderRadius: 100, borderWidth: 0 }}
                // left={<TextInput.Icon icon={"menu"} />}
                right={<TextInput.Icon icon="magnify" onPress={searchCourses} />}
                onSubmitEditing={searchCourses}
            />

            <Surface
                style={{
                    width: "120%",
                    height: 1,
                    backgroundColor: "transparent",
                    marginTop: 20,
                    marginLeft: -20,
                    elevation: 1,
                }}
            >
                <View
                    style={{
                        width: "100%",
                        height: 1,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 1,
                        backgroundColor: "#ddd",
                    }}
                />
            </Surface>

            <FlatList
                data={categories}
                renderItem={({ item }) => <CategoryContainer category={item} />}
                keyExtractor={(item) => item.id}
                numColumns={2}
                refreshing={refreshing}
                onRefresh={refresh}
                style={{ margin: -20, marginTop: 0 }}
                contentContainerStyle={{ gap: 10, padding: 20 }}
                columnWrapperStyle={{ gap: 10 }}
            />
        </View>
    )
}

import React from "react"
import { Platform, View } from "react-native"
import { Category } from "../../../types/server/class/Category"
import { Surface, Text, TouchableRipple } from "react-native-paper"
import { Image } from "expo-image"
import placeholders from "../../../tools/placeholders"
import { NavigationProp, useNavigation } from "@react-navigation/native"

interface CategoryContainerProps {
    category: Category
}

export const CategoryContainer: React.FC<CategoryContainerProps> = ({ category }) => {
    const navigation = useNavigation<NavigationProp<any, any>>()

    return (
        <Surface style={{ flex: 1 / 2, borderRadius: 15 }}>
            <TouchableRipple
                borderless
                style={{
                    borderRadius: 15,
                    padding: 10,
                    paddingLeft: Platform.OS == "android" ? 4 : 3,
                    flexDirection: "row",
                    alignItems: "center",
                }}
                onPress={() => navigation.navigate("category:screen", { category })}
            >
                <>
                    <Text numberOfLines={2} style={{ flex: 1, textAlign: "center" }}>
                        {category.name}
                    </Text>
                    <Image
                        source={category.cover}
                        contentFit="cover"
                        placeholderContentFit="cover"
                        style={{ width: 75, aspectRatio: 1, borderRadius: 15 }}
                        placeholder={placeholders.square}
                    />
                </>
            </TouchableRipple>
        </Surface>
    )
}

import React from "react"
import { View } from "react-native"
import { Suggestion } from "react-native-controlled-mentions"
import { Menu, Surface, Text, TouchableRipple, useTheme } from "react-native-paper"

interface MentionMenuProps {
    anchor: {
        x: number
        y: number
    }
    suggestions: Suggestion[]
    keyword: string
    onSuggestionPress: (suggestion: Suggestion) => void
}

export const MentionMenu: React.FC<MentionMenuProps> = ({ anchor, suggestions, keyword, onSuggestionPress }) => {
    const theme = useTheme()

    console.log(anchor)

    return (
        <Menu
            visible={true}
            anchorPosition="bottom"
            anchor={anchor}
            contentStyle={{ width: "100%" }}
            style={{ width: 200, height: 200, borderColor: "red", borderWidth: 1 }}
        >
            <View
                style={{
                    borderTopWidth: 0,
                    width: 0,
                    height: 0,
                    position: "absolute",
                    right: 15,
                    top: -11,
                    borderBottomColor: theme.colors.elevation.level2,
                    borderLeftColor: "transparent",
                    borderRightColor: "transparent",
                    borderBottomWidth: 10,
                    borderRightWidth: 10,
                    borderLeftWidth: 10,
                }}
            ></View>
            <View style={{ flex: 1 }}>
                {suggestions
                    .filter((item) => item.name.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()))
                    .map((item) => (
                        <TouchableRipple key={item.id} onPress={() => onSuggestionPress(item)}>
                            <Text>{item.name}</Text>
                        </TouchableRipple>
                    ))}
            </View>
        </Menu>
    )
}

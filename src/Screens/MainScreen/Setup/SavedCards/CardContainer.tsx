import React from "react"
import { Surface, Text, TouchableRipple } from "react-native-paper"
import { PaymentCard } from "../../../../types/server/class/PaymentCard"
import { StyleProp, TextStyle, View } from "react-native"
import { colors } from "../../../../style/colors"
import { mask } from "react-native-mask-text"
import { Image } from "expo-image"
import { getCardFlag } from "./getCardFlag"
import { getBankData } from "./getCardColor"
import { NavigationProp, useNavigation } from "@react-navigation/native"

interface CardContainer {
    card: PaymentCard
}

export const CardContainer: React.FC<CardContainer> = ({ card }) => {
    const masked_number = `****  ****  ****  ${mask(card.number, "9999 9999 9999 9999").split(" ").pop()}`
    const text_style: StyleProp<TextStyle> = { color: colors.secondary }
    const bank_data = getBankData(card.bank)
    const navigation = useNavigation<NavigationProp<any, any>>()

    return (
        <Surface style={{ flex: 1, borderRadius: 20, backgroundColor: bank_data?.color || "#212426" }}>
            <TouchableRipple
                borderless
                style={{ borderRadius: 20, flex: 1, padding: 30, gap: 40, position: "relative" }}
                onPress={() => navigation.navigate("setup:cards:form", { card })}
            >
                <>
                    <Text style={text_style}>
                        {card.type == "CREDIT" ? "Crédito" : "Débito"}
                        {bank_data ? ` - ${bank_data.name}` : null}
                    </Text>
                    <Text variant="headlineSmall" style={text_style}>
                        {masked_number}
                    </Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={text_style}>{card.owner}</Text>
                        <Text style={text_style}>{card.validity}</Text>
                    </View>
                    <Image
                        source={getCardFlag(card.flag)}
                        style={{ position: "absolute", right: 20, top: 20, width: 50, aspectRatio: "3/2" }}
                        contentFit="contain"
                    />
                </>
            </TouchableRipple>
        </Surface>
    )
}

import { Image, ImageSource } from "expo-image"
import React from "react"
import { Linking, View } from "react-native"
import { TouchableRipple } from "react-native-paper"

interface SocialMediaIconProps {
    source: string | number | ImageSource | ImageSource[] | string[] | null | undefined
    deep_link: string
    web_url: string
}

export const SocialMediaIcon: React.FC<SocialMediaIconProps> = ({ source, deep_link, web_url }) => {
    const onPress = async () => {
        try {
            await Linking.openURL(deep_link)
        } catch (error) {
            console.log(error)
            try {
                await Linking.openURL(web_url)
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <TouchableRipple borderless style={{ borderRadius: 100, padding: 5 }} onPress={onPress}>
            <Image source={source} style={{ height: 30, aspectRatio: "1/1" }} contentFit="contain" />
        </TouchableRipple>
    )
}

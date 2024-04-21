import React from "react"
import { Image } from "expo-image"
import { ColorValue } from "react-native"

interface LogoProps {
    size?: number
    tintColor?: ColorValue
}

export const Logo: React.FC<LogoProps> = ({ size, tintColor = "white" }) => {
    const default_size = 200
    return (
        <Image
            source={require("../../assets/logo.webp")}
            style={{ width: size || default_size, height: size || default_size, tintColor: tintColor }}
        />
    )
}

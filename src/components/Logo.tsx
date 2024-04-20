import React from "react"
import { Image } from "expo-image"

interface LogoProps {
    size?: number
    invert?: boolean
}

export const Logo: React.FC<LogoProps> = ({ size, invert }) => {
    const default_size = 200
    return (
        <Image source={require("../../assets/logo.webp")} style={{ width: size || default_size, height: size || default_size, tintColor: "white" }} />
    )
}

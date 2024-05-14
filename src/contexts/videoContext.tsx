import { Video } from "expo-av"
import { createContext, useRef, useState } from "react"
import React from "react"

interface VideoContextValue {
    videoRef: React.RefObject<Video>
}

interface VideoProviderProps {
    children: React.ReactNode
}

const VideoContext = createContext<VideoContextValue>({} as VideoContextValue)

export default VideoContext

export const VideoProvider: React.FC<VideoProviderProps> = ({ children }) => {
    const videoRef = useRef<Video>(null)

    return <VideoContext.Provider value={{ videoRef }}>{children}</VideoContext.Provider>
}

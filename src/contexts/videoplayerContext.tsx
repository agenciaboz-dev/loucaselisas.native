import { Video } from "expo-av"
import { createContext, useRef, useState } from "react"
import React from "react"

interface VideoPlayerContextValue {
    ref: React.RefObject<Video>
}

interface VideoPlayerProviderProps {
    children: React.ReactNode
}

const VideoPlayerContext = createContext<VideoPlayerContextValue>({} as VideoPlayerContextValue)

export default VideoPlayerContext

export const VideoPlayerProvider: React.FC<VideoPlayerProviderProps> = ({ children }) => {
    const ref = useRef<Video>(null)

    return <VideoPlayerContext.Provider value={{ ref }}>{children}</VideoPlayerContext.Provider>
}

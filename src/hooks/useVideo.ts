import { useContext } from "react"
import VideoContext from "../contexts/videoContext"

export const useVideo = () => {
    const videoContext = useContext(VideoContext)

    return { ...videoContext }
}

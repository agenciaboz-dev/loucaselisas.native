import React from "react"
import { Status } from "../types/server/class/Course"
import { Text } from "react-native-paper"
import { formatStatus } from "../tools/formatStatus"

interface StatusTextProps {
    status: Status
}

export const StatusText: React.FC<StatusTextProps> = ({ status }) => {
    return <Text>Status: {formatStatus(status)}</Text>
}

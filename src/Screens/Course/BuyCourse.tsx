import React from "react"
import { View } from "react-native"
import { Course } from "../../types/server/class/Course"
import { Surface, Text } from "react-native-paper"
import { currencyMask } from "../../tools/currencyMask"
import { Button } from "../../components/Button"

interface BuyCourseProps {
    course: Course
}

interface BuyContainerProps {
    onPress: () => void
    label: string
}

const BuyContainer: React.FC<BuyContainerProps> = ({ label, onPress }) => {
    return (
        <Surface
            style={{
                flex: 1,
                borderRadius: 15,
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
                alignItems: "center",
                marginVertical: 10,
            }}
        >
            <Text>{label}</Text>
            <Button mode="contained">Comprar</Button>
        </Surface>
    )
}

export const BuyCourse: React.FC<BuyCourseProps> = ({ course }) => {
    return (
        <View style={{ gap: 0 }}>
            <BuyContainer label={`Valor: ${currencyMask(course.price)}`} onPress={() => null} />
        </View>
    )
}

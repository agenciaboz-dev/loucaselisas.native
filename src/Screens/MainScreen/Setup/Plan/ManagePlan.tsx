import { NavigationProp } from "@react-navigation/native"
import React, { useEffect, useState } from "react"
import { Surface } from "react-native-paper"
import { ScreenTitle } from "../../../../components/ScreenTItle"
import { Plan } from "../../../../types/server/class/Plan"
import { api } from "../../../../backend/api"
import { FlatList } from "react-native"
import { PlanContainer } from "./PlanContainer"

interface ManagePlanProps {
    navigation: NavigationProp<any, any>
}

export const ManagePlan: React.FC<ManagePlanProps> = ({ navigation }) => {
    const [loading, setLoading] = useState(false)
    const [plans, setPlans] = useState<Plan[]>([])

    const refreshPlans = async () => {
        if (loading) return
        setLoading(true)
        try {
            const response = await api.get("/plan")
            const plans = response.data
            setPlans(plans)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refreshPlans()
    }, [])

    return (
        <Surface style={{ flex: 1, padding: 20 }}>
            <ScreenTitle title="Gerenciar seu plano" />
            <FlatList
                data={plans}
                renderItem={({ item }) => <PlanContainer plan={item} />}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                style={{ width: "100%" }}
                contentContainerStyle={{ gap: 20, paddingVertical: 20, paddingHorizontal: 5 }}
                onRefresh={refreshPlans}
                refreshing={loading}
            />
        </Surface>
    )
}

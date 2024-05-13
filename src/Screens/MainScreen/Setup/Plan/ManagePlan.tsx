import { NavigationProp, useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useEffect, useState } from "react"
import { ScreenTitle } from "../../../../components/ScreenTItle"
import { Plan } from "../../../../types/server/class/Plan"
import { api } from "../../../../backend/api"
import { FlatList, LayoutAnimation, View } from "react-native"
import { PlanContainer } from "./PlanContainer"

interface ManagePlanProps {
    navigation: NavigationProp<any, any>
}

export const ManagePlan: React.FC<ManagePlanProps> = ({ navigation }) => {
    const [loading, setLoading] = useState(true)
    const [plans, setPlans] = useState<Plan[]>([])

    const refreshPlans = async () => {
        setLoading(true)
        try {
            const response = await api.get("/plan")
            const plans = response.data
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
            setPlans(plans)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            refreshPlans()
        }, [])
    )

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <ScreenTitle title="Gerenciar seu plano" />
            <FlatList
                data={plans}
                renderItem={({ item }) => <PlanContainer plan={item} />}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                style={{ margin: -20, marginTop: 0 }}
                contentContainerStyle={{ gap: 20, padding: 20 }}
                onRefresh={refreshPlans}
                refreshing={loading}
            />
        </View>
    )
}

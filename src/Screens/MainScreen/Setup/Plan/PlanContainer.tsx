import React, { useState } from "react"
import { IconButton, Surface, Text } from "react-native-paper"
import { Plan, PlanContract } from "../../../../types/server/class/Plan"
import { currencyMask } from "../../../../tools/currencyMask"
import { Button } from "../../../../components/Button"
import { useUser } from "../../../../hooks/useUser"
import { api } from "../../../../backend/api"
import { formatPlanDuration } from "../../../../tools/formatPlanDuration"
import { PlanPurchaseForm } from "../../../../types/server/PlanPurchaseForm"
import { User } from "../../../../types/server/class"
import { useSnackbar } from "../../../../hooks/useSnackbar"
import { NavigationProp, useNavigation } from "@react-navigation/native"

interface PlanContainerProps {
    plan: Plan
}

export const PlanContainer: React.FC<PlanContainerProps> = ({ plan }) => {
    const { user, setUser } = useUser()
    const { snackbar } = useSnackbar()
    const navigation = useNavigation<NavigationProp<any, any>>()
    const is_current_plan = user?.plan?.plan_data.id == plan.id
    console.log(user)

    const [loading, setLoading] = useState(false)

    const onPurchase = async () => {
        if (loading || !user) return
        setLoading(true)
        try {
            const data: PlanPurchaseForm = {
                plan_id: plan.id,
                user_id: user.id,
            }
            const response = await api.post("/plan/purchase", data)
            const updated_user: User = response.data
            setUser(updated_user)
            navigation.navigate("setup:plan:details")
        } catch (error) {
            console.log(error)
            snackbar("erro ao contratar")
        } finally {
            setLoading(false)
        }
    }

    return user ? (
        <Surface elevation={1} style={{ padding: 20, borderRadius: 15, gap: 5, position: "relative" }}>
            <Text variant="bodySmall">{formatPlanDuration(plan.duration)}</Text>
            <Text variant="bodyLarge">{plan.name}</Text>
            <Text variant="bodyLarge">{currencyMask(plan.price)}</Text>

            <Button
                loading={loading}
                mode="contained"
                style={{ alignSelf: "flex-end", marginTop: 10 }}
                disabled={is_current_plan}
                onPress={onPurchase}
            >
                Adquirir {plan.name}
            </Button>

            {is_current_plan && (
                <IconButton
                    icon={"chevron-right"}
                    style={{ position: "absolute", right: 0, top: 0 }}
                    onPress={() => navigation.navigate("setup:plan:details")}
                />
            )}
        </Surface>
    ) : null
}

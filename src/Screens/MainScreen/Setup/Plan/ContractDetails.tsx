import React from "react"
import { Text } from "react-native-paper"
import { NavigationProp } from "@react-navigation/native"
import { useUser } from "../../../../hooks/useUser"
import { ScreenTitle } from "../../../../components/ScreenTItle"
import { currencyMask } from "../../../../tools/currencyMask"
import { View } from "react-native"

interface ContractDetailsProps {
    navigation: NavigationProp<any, any>
}

export const ContractDetails: React.FC<ContractDetailsProps> = ({ navigation }) => {
    const { user } = useUser()
    const plan = user?.plan
    return plan ? (
        <View style={{ flex: 1, padding: 20, gap: 5 }}>
            <ScreenTitle title={plan.plan_data.name} />
            <Text>Início: {new Date(Number(plan.start_date)).toLocaleString("pt-br")}</Text>
            <Text>Fim: {new Date(Number(plan.end_date)).toLocaleString("pt-br")}</Text>
            <Text>Pago: {currencyMask(plan.paid)}</Text>
        </View>
    ) : null
}

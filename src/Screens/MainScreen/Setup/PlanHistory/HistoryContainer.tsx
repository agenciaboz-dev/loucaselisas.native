import React from "react"
import { Surface, Text } from "react-native-paper"
import { ContractLog } from "../../../../types/server/class/Plan"
import { View } from "react-native"
import { currencyMask } from "../../../../tools/currencyMask"

interface HistoryContainerProps {
    log: ContractLog
}

export const HistoryContainer: React.FC<HistoryContainerProps> = ({ log }) => {
    return (
        <Surface style={{ flexDirection: "row", padding: 20, alignItems: "center", justifyContent: "space-between", flex: 1 }}>
            <View style={{ justifyContent: "space-between", height: "100%", gap: 10 }}>
                <Text variant="bodyLarge">Pagamento do {log.plan.name}</Text>
                <Text>Pago: {currencyMask(log.paid)}</Text>
            </View>
            <Text>{new Date(Number(log.start_date)).toLocaleDateString("pt-br")}</Text>
        </Surface>
    )
}

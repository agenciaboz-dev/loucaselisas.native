import { NavigationProp } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import React from "react"
import { Menus } from "./Menus"
import { Account } from "../../Account/Account"
import { default_navigator_options } from "../../../tools/default_navigator_options"
import { Delete } from "./DeleteAccount"
import { ManagePlan } from "./Plan/ManagePlan"
import { ContractDetails } from "./Plan/ContractDetails"
import { PlanHistory } from "./PlanHistory/PlanHistory"
import { SavedCards } from "./SavedCards/SavedCards"
import { CardForm } from "./SavedCards/CardForm"
import { Profile } from "../../Profile/Profile"
import { Profile as EditProfile } from "./Profile"
import { TermsScreen } from "./TermsScreen"
import { PrivacyScreen } from "./PrivacyScreen"
import { SupportScreen } from "./SupportScren"

interface SetupProps {
    navigation: NavigationProp<any, any>
}

const Stack = createNativeStackNavigator()

export const Setup: React.FC<SetupProps> = ({ navigation }) => {
    return (
        <Stack.Navigator screenOptions={default_navigator_options}>
            <Stack.Screen name="setup:menus" component={Menus} />
            <Stack.Screen name="setup:account" component={Account} />
            <Stack.Screen name="setup:profile" component={Profile} />
            <Stack.Screen name="setup:profile:edit" component={EditProfile} />
            <Stack.Screen name="setup:delete" component={Delete} />
            <Stack.Screen name="setup:plan" component={ManagePlan} />
            <Stack.Screen name="setup:plan:details" component={ContractDetails} />
            <Stack.Screen name="setup:plan:history" component={PlanHistory} />
            <Stack.Screen name="setup:cards" component={SavedCards} />
            <Stack.Screen name="setup:cards:form" component={CardForm} />

            <Stack.Screen name="setup:terms" component={TermsScreen} />
            <Stack.Screen name="setup:privacy" component={PrivacyScreen} />
            <Stack.Screen name="setup:support" component={SupportScreen} />
        </Stack.Navigator>
    )
}

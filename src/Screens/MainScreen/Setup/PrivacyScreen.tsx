import React from "react"
import { ScrollView, View } from "react-native"
import { Text } from "react-native-paper"
import { ScreenTitle } from "../../../components/ScreenTItle"

interface PricacyScreenProps {}

export const PrivacyScreen: React.FC<PricacyScreenProps> = ({}) => {
    const privacy = `
    Esta política de privacidade se aplica ao aplicativo Loucas & Lisas (por meio deste referido como "Aplicativo") para dispositivos móveis, criado pela Agência BOZ (por meio deste referida como "Prestador de Serviço") como um serviço gratuito. Este serviço é destinado ao uso "TAL COMO ESTÁ".

Coleta e Uso de Informações

O Aplicativo coleta informações quando você o baixa e o utiliza. Essas informações podem incluir dados como:

- O endereço de Protocolo de Internet (e.g., endereço IP) do seu dispositivo
- As páginas do Aplicativo que você visita, o horário e a data da sua visita, o tempo gasto nessas páginas
- O tempo gasto no Aplicativo
- O sistema operacional que você utiliza no seu dispositivo móvel

O Aplicativo não coleta informações precisas sobre a localização do seu dispositivo móvel.

O Prestador de Serviço pode usar as informações fornecidas para entrar em contato com você periodicamente, a fim de fornecer informações importantes, avisos necessários e promoções de marketing.

Para uma melhor experiência, enquanto usa o Aplicativo, o Prestador de Serviço pode solicitar que você forneça certas informações pessoalmente identificáveis, incluindo, mas não se limitando a: ID de usuário, nome de usuário, apelido, e-mail, senha, CPF, UF, data de nascimento, número de telefone, pronomes, informações do cartão de pagamento. As informações solicitadas pelo Prestador de Serviço serão retidas por eles e usadas conforme descrito nesta política de privacidade.

Acesso de Terceiros

Apenas dados agregados e anonimizados são periodicamente transmitidos a serviços externos para ajudar o Prestador de Serviço a melhorar o Aplicativo e seus serviços. O Prestador de Serviço pode compartilhar suas informações com terceiros da maneira descrita nesta declaração de privacidade.

Por favor, note que o Aplicativo utiliza serviços de terceiros que possuem suas próprias Políticas de Privacidade sobre o tratamento de dados. Abaixo estão os links para a Política de Privacidade dos provedores de serviços de terceiros utilizados pelo Aplicativo:

- Expo

O Prestador de Serviço pode divulgar Informações Fornecidas pelo Usuário e Informações Coletadas Automaticamente:

- conforme exigido por lei, como para cumprir com uma intimação ou processo legal semelhante;
- quando acreditar de boa fé que a divulgação é necessária para proteger seus direitos, proteger sua segurança ou a segurança de outros, investigar fraudes ou responder a uma solicitação governamental;
- com seus provedores de serviços confiáveis que trabalham em seu nome, não têm um uso independente das informações que divulgamos a eles e concordaram em aderir às regras estabelecidas nesta declaração de privacidade.

Direitos de Opt-Out

Você pode parar toda a coleta de informações pelo Aplicativo facilmente desinstalando-o. Você pode usar os processos padrão de desinstalação que podem estar disponíveis como parte do seu dispositivo móvel ou via o mercado de aplicativos móveis ou rede.

Política de Retenção de Dados

O Prestador de Serviço reterá os dados fornecidos pelo usuário enquanto você usar o Aplicativo e por um tempo razoável após isso. Se você desejar que eles excluam os Dados Fornecidos pelo Usuário que você forneceu por meio do Aplicativo, entre em contato pelo e-mail developer@agenciazop.com.br e eles responderão em um tempo razoável.

Crianças

O Prestador de Serviço não utiliza o Aplicativo para solicitar dados ou fazer marketing consciente para crianças menores de 13 anos.

O Aplicativo não se destina a menores de 13 anos. O Prestador de Serviço não coleta intencionalmente informações pessoalmente identificáveis de crianças menores de 13 anos. No caso de o Prestador de Serviço descobrir que uma criança menor de 13 anos forneceu informações pessoais, elas serão imediatamente excluídas de seus servidores. Se você for pai ou responsável e souber que seu filho forneceu informações pessoais, entre em contato com o Prestador de Serviço (developer@agenciazop.com.br) para que possam tomar as medidas necessárias.

Segurança

O Prestador de Serviço se preocupa em proteger a confidencialidade de suas informações. O Prestador de Serviço fornece salvaguardas físicas, eletrônicas e processuais para proteger as informações que processa e mantém.

Alterações

Esta Política de Privacidade pode ser atualizada de tempos em tempos por qualquer motivo. O Prestador de Serviço notificará você sobre quaisquer alterações na Política de Privacidade atualizando esta página com a nova Política de Privacidade. Você é aconselhado a consultar esta Política de Privacidade regularmente para quaisquer alterações, pois o uso contínuo é considerado aprovação de todas as alterações.

Esta política de privacidade é efetiva a partir de 24 de abril de 2024.

Seu Consentimento

Ao usar o Aplicativo, você consente com o processamento de suas informações conforme estabelecido nesta Política de Privacidade agora e conforme alterado por nós.

Contate-nos

Se você tiver quaisquer perguntas sobre privacidade enquanto usa o Aplicativo, ou tiver dúvidas sobre as práticas, entre em contato com o Prestador de Serviço via e-mail em developer@agenciazop.com.br.`
    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
            <ScreenTitle title="Privacidade" />
            <Text style={{ textAlign: "justify" }}>{privacy}</Text>
        </ScrollView>
    )
}

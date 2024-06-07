import React from "react"
import { ScrollView, View } from "react-native"
import { Text } from "react-native-paper"
import { ScreenTitle } from "../../../components/ScreenTItle"

interface TermsScreenProps {}

export const TermsScreen: React.FC<TermsScreenProps> = ({}) => {
    const terms = `
    Esses termos e condições se aplicam ao aplicativo Loucas & Lisas (por meio deste referido como "Aplicativo") para dispositivos móveis, criado pela Agência BOZ (por meio deste referida como "Prestador de Serviço") como um serviço gratuito.
    
    Ao baixar ou utilizar o Aplicativo, você concorda automaticamente com os seguintes termos. É fortemente recomendado que você leia e compreenda estes termos antes de usar o Aplicativo. A cópia não autorizada, modificação do Aplicativo, qualquer parte do Aplicativo ou nossas marcas registradas é estritamente proibida. Quaisquer tentativas de extrair o código-fonte do Aplicativo, traduzir o Aplicativo para outros idiomas ou criar versões derivadas não são permitidas. Todas as marcas registradas, direitos autorais, direitos de banco de dados e outros direitos de propriedade intelectual relacionados ao Aplicativo permanecem de propriedade do Prestador de Serviço.
    
    O Prestador de Serviço está comprometido em garantir que o Aplicativo seja o mais benéfico e eficiente possível. Como tal, eles reservam o direito de modificar o Aplicativo ou cobrar por seus serviços a qualquer momento e por qualquer motivo. O Prestador de Serviço garante que quaisquer cobranças pelo Aplicativo ou seus serviços serão claramente comunicadas a você.
    
    O Aplicativo armazena e processa dados pessoais que você forneceu ao Prestador de Serviço para fornecer o Serviço. É sua responsabilidade manter a segurança do seu telefone e o acesso ao Aplicativo. O Prestador de Serviço aconselha fortemente contra fazer jailbreak ou root no seu telefone, o que envolve remover restrições e limitações de software impostas pelo sistema operacional oficial do seu dispositivo. Tais ações podem expor seu telefone a malware, vírus, programas maliciosos, comprometer os recursos de segurança do seu telefone e podem resultar no funcionamento incorreto ou na inoperância total do Aplicativo.
    
    Por favor, note que o Aplicativo utiliza serviços de terceiros que possuem seus próprios Termos e Condições. Abaixo estão os links para os Termos e Condições dos provedores de serviços de terceiros utilizados pelo Aplicativo:
    
    - Expo
    
    Esteja ciente de que o Prestador de Serviço não assume responsabilidade por certos aspectos. Algumas funções do Aplicativo requerem uma conexão ativa à internet, que pode ser Wi-Fi ou fornecida pelo seu provedor de rede móvel. O Prestador de Serviço não pode ser responsabilizado se o Aplicativo não funcionar em plena capacidade devido à falta de acesso ao Wi-Fi ou se você tiver esgotado sua franquia de dados.
    
    Se você estiver usando o aplicativo fora de uma área de Wi-Fi, esteja ciente de que os termos do seu provedor de rede móvel ainda se aplicam. Consequentemente, você pode incorrer em cobranças do seu provedor móvel pelo uso de dados durante a conexão ao aplicativo, ou outras cobranças de terceiros. Ao usar o aplicativo, você aceita a responsabilidade por tais cobranças, incluindo cobranças de dados em roaming se você usar o aplicativo fora do seu território de origem (ou seja, região ou país) sem desativar o roaming de dados. Se você não é o pagador da conta pelo dispositivo em que está usando o aplicativo, assume-se que você obteve permissão do pagador da conta.
    
    Da mesma forma, o Prestador de Serviço nem sempre pode assumir responsabilidade pelo seu uso do aplicativo. Por exemplo, é sua responsabilidade garantir que seu dispositivo permaneça carregado. Se seu dispositivo ficar sem bateria e você não conseguir acessar o Serviço, o Prestador de Serviço não pode ser responsabilizado.
    
    Em termos de responsabilidade do Prestador de Serviço pelo seu uso do aplicativo, é importante notar que, embora eles se esforcem para garantir que esteja atualizado e preciso o tempo todo, eles dependem de terceiros para fornecer informações para que possam disponibilizá-las para você. O Prestador de Serviço não aceita responsabilidade por qualquer perda, direta ou indireta, que você possa experimentar como resultado de confiar inteiramente nessa funcionalidade do aplicativo.
    
    O Prestador de Serviço pode desejar atualizar o aplicativo em algum momento. O aplicativo está atualmente disponível conforme os requisitos para o sistema operacional (e para quaisquer sistemas adicionais que decidam estender a disponibilidade do aplicativo) possam mudar, e você precisará baixar as atualizações se quiser continuar usando o aplicativo. O Prestador de Serviço não garante que sempre atualizará o aplicativo para que seja relevante para você e/ou compatível com a versão do sistema operacional instalado no seu dispositivo. No entanto, você concorda em sempre aceitar as atualizações do aplicativo quando oferecidas a você. O Prestador de Serviço também pode desejar cessar a oferta do aplicativo e pode encerrar seu uso a qualquer momento, sem aviso prévio. A menos que informem o contrário, após qualquer rescisão, (a) os direitos e licenças concedidos a você nestes termos terminarão; (b) você deve parar de usar o aplicativo e, se necessário, excluí-lo do seu dispositivo.
    
    Alterações a Estes Termos e Condições
    
    O Prestador de Serviço pode periodicamente atualizar seus Termos e Condições. Portanto, você é aconselhado a revisar esta página regularmente para quaisquer mudanças. O Prestador de Serviço notificará você sobre quaisquer mudanças, publicando os novos Termos e Condições nesta página.
    
    Esses termos e condições são efetivos a partir de 24 de abril de 2024.
    
    Contate-nos
    
    Se você tiver quaisquer perguntas ou sugestões sobre os Termos e Condições, por favor, não hesite em contatar o Prestador de Serviço pelo email developer@agenciazop.com.br.`
    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
            <ScreenTitle title="Termos" />
            <Text style={{ textAlign: "justify" }}>{terms}</Text>
        </ScrollView>
    )
}

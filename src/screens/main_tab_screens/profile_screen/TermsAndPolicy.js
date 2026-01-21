import React from 'react';
import { StyleSheet, View, ScrollView, Text, Linking } from 'react-native';
import ComponentWrapper from '../../../components/ComponentWrapper';


const TermsAndPolicy = () => {

    const data = [
        {
            title: 'Information We Collect',
            text: `Account Information: Email address, login credentials.Usage Data: AI interactions, prompt data, chat logs, feature usage.Device Data: Device type, IP address, OS version (for analytics & security).Payment Information: Processed securely via App Store / Google Play; Reho app does not store payment data directly.`,
            id: 1
        },
        {
            title: 'How We Use Your Data',
            text: `To provide personalized AI guidance and HR news content.To improve the performance and relevance of AI Personas.To track usage for feature optimization and safety monitoring.To comply with legal, regulatory, or audit obligations`,
            id: 2
        },
        {
            title: 'AI Model Use',
            text: `Your prompts and chat data may be processed by third-party AI models (eg., OpenAI) subject to their privacy and security policies.We apply additional filtering, logging, and safety monitoring to protect against AI hallucinations or inappropriate outputs.`,
            id: 3
        },
        {
            title: 'Data Sharing',
            text: `We do not sell or share your personal data with advertisers.Limited data may be shared with infrastructure providers necessary for AI processing (e.g., OpenAI, Firebase, Stripe, Google)`,
            id: 4
        },
        {
            title: 'Data Control',
            text: `Under data protection law you have the right to ask us for a copy of the information we hold about you, and to have any inaccuracies corrected or removed. You may also ask us to delete all personal data held by us or any controller or processor with which we have shared your data as well as request that we ease to process any of your contact data. To do this, please either contact us in writing or email. Contact us on \nEmail: clientsupport@rehowealth.co.uk\nAddress: Reho Wealth Group Ltd, Acorn Business Center, Unit C Aldow enterprise park, Manchester, M12 6AE`,
            id: 5
        },
        {
            title: 'Security',
            text: `We implement appropriate administrative, technical, and physical safeguards to protect your personal information from unauthorized access or disclosure.`,
            id: 6
        },
        {
            title: 'GDPR / CCPA Compliance (if applicable)',
            text: `Rehoboth Wealth Group Ltd is registered with the infromation Commissioner in the UK as a *data Controller*, the registration reference number is ZB807386. Full details of the registration can be accessed on the ICO data controller register here - `,
            link:true,
            id: 7
        },

        {
            title: 'Contact',
            text: `If you have any privacy concerns, contact us at clientsupport@rehowealth.co.uk`,
            id: 8
        },


    ]


    return (
    <ComponentWrapper bg_color='bg-[#5055ba]' title='Terms and Privacy Policy'  >
       <ScrollView showsVerticalScrollIndicator={false} className="flex-1">

            {data.map((item)=> {

                return <View key={item.id}>
                    <Text className="font-archivo-semi-bold text-xl">
                        {item.id}. <Text>{item.title}</Text>
                    </Text>
                    <Text className="my-2 text-gray-900 font-inter-regular text-small">
                        {item.text} 
                        {item?.link && <Text onPress={() => Linking.openURL("https://ico.org.uk/about-the-ico/what-we-do/register-of-data-controllers")} className="text-black font-archivo-semi-bold underline"> ICO Data Controller website</Text>}
                    </Text>
                </View>


            })}

       </ScrollView>
    </ComponentWrapper>
    );
}

const styles = StyleSheet.create({})

export default TermsAndPolicy;

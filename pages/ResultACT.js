import React from 'react'
import { View, SafeAreaView } from 'react-native';
import ZoneCard from '../components/ZoneCard';

function ResultACT({ route, navigation }) {
    const { score } = route.params;
    console.log(score)
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {score >= 0 && score <= 15 ?
                <ZoneCard
                    score={score}
                    scoreColor='#FF0000'
                    // imageSource={require("../assets/green-score.png")}
                    titleText='VERY POORLY CONTROLLED ASTHMA'
                    subTitleText='Take Charge of Your Asthma!'
                    textContent='A total score of less than 16 on the Asthma Control Test indicates poorly controlled asthma. Work with your healthcare provider to develop a management plan and take an active role in managing your asthma to achieve better asthma control and enjoy a better quality of life.'
                    buttonLabel='Back to home'
                    onPress={() => navigation.reset({
                        index: 0,
                        routes: [{ name: 'Asthsist'}],
                    })}

                    backgroundColor='#D9FDDC'
                />
                : score > 15 && score <= 20 ?
                    <ZoneCard
                        score={score}
                        scoreColor='#FFC100'
                        // imageSource={require("../assets/yellow-score.png")}
                        titleText='POORLY CONTROLLED ASTHMA'
                        subTitleText={`Don't Let Asthma Hold You Back!`}
                        textContent='A total score of 16-19 on the Asthma Control Test indicates room for improvement in your asthma control. Work with your healthcare provider to develop a plan to improve your score and breathe easier.'
                        buttonLabel='Back to home'
                        onPress={() => navigation.reset({
                            index: 0,
                            routes: [{ name: 'Asthsist'}],
                        })}
                        backgroundColor='#F8F0D6'
                    />
                    : score > 20 && score <= 25 ?
                        <ZoneCard
                            score={score}
                            scoreColor='#00CD00'
                            // imageSource={require("../assets/red-score.png")}
                            titleText='WELL-CONTROLLED ASTHMA'
                            subTitleText='Congratulations on Achieving Well-Controlled Asthma!'
                            textContent={`A total score of 20-25 on the Asthma Control Test means you have well-controlled asthma. Keep up the good work and continue to communicate with your healthcare provider for optimal management.`}
                            buttonLabel='Back to home'
                            onPress={() => navigation.reset({
                                index: 0,
                                routes: [{ name: 'Asthsist'}],
                            })}
                            backgroundColor='#FCC3C3'
                        />
                        : null}
        </SafeAreaView>
    )
}

export default ResultACT
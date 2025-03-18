import { StackScreenProps } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

type RootStackParamList = {
    Home: undefined;
    Login: undefined; 
};

type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>OdontoFast.</Text>
            <Image 
                source={require('../assets/images/fastinho.png')}  // Caminho correto relativo à HomeScreen.tsx
                style={styles.image}
            />
            <Text style={styles.subHeader}>Seu amigo bucal!</Text>
            <Text style={styles.description}>
                Entre com sua carteirinha do convênio para usufruir de toda nossa assistência odontológica online, do jeito fast!
            </Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>  {/* Mudando para Login */}
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f0f0',  // Cor de fundo fixa
    },
    header: {
        position: 'absolute',
        top: 123,  // Posição Y: 123
        fontFamily: 'Nunito_700Bold',
        fontSize: 36,
        color: '#45B3CB',
        textAlign: 'center',
        marginBottom: 10,
    },
    image: {
        width: 248,
        height: 246,
        marginBottom: 20,
    },
    subHeader: {
        fontFamily: 'Nunito_700Bold',
        fontSize: 18,
        color: '#000',
        textAlign: 'center',
        marginBottom: 20,
    },
    description: {
        fontFamily: 'Nunito_400Regular',
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#45B3CB',
        width: 315,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonText: {
        fontFamily: 'Nunito_700Bold',
        fontSize: 18,
        color: '#fff',
    },
});

export default HomeScreen;

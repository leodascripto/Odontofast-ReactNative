import React, { useState } from "react";
import {
    StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Animated
} from "react-native";

interface Notification {
    id: string;
    title: string;
    message: string;
    icon: string;
    action?: () => void;
}

const NotificacoesScreen: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: "1",
            title: "📅 Lembrete de Consulta",
            message: "Você tem uma consulta com Dr. Felipe Amador no dia 20/03/2025 às 14:30.",
            icon: "📅",
        },
        {
            id: "2",
            title: "🎉 Promoção Especial",
            message: "Parabéns! Você ganhou um desconto de 15% na sua próxima limpeza. Aproveite!",
            icon: "🎉",
        },
        {
            id: "3",
            title: "📩 Nova Mensagem",
            message: 'Dra. Sara Gabrielle enviou uma mensagem: "Léo, como está se sentindo após o último procedimento?"',
            icon: "📩",
        }
    ]);

    const removeNotification = (id: string) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
    };

    const renderItem = ({ item }: { item: Notification }) => {
        const fadeAnim = new Animated.Value(0);

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        return (
            <Animated.View style={[styles.notification, { opacity: fadeAnim }]}>
                <TouchableOpacity
                    onPress={() => removeNotification(item.id)}
                    style={styles.closeButton}
                >
                    <Text style={styles.closeText}>✖</Text>
                </TouchableOpacity>
                <Text style={styles.title}>{item.icon} {item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/notificacoesPage/notificacoespageicon.png')} style={styles.icon} />
            <Text style={styles.header}>Notificações.</Text>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
        padding: 20,
        paddingTop: 60,
    },
    header: {
        fontFamily: "Nunito_700Bold",
        fontSize: 28,
        color: "#45B3CB",
        textAlign: "center",
        marginBottom: 80,
    },
    icon: {
        position: "absolute",
        left: 20,
        top: 20,
        width: 40,
        height: 40,
    },
    notification: {
        backgroundColor: "#FFF",
        borderRadius: 15,
        padding: 20,
        marginBottom: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5, // Sombra para Android
        position: "relative",
    },
    title: {
        fontFamily: "Nunito_700Bold",
        fontSize: 16,
        color: "#000",
        marginBottom: 10,
    },
    message: {
        fontFamily: "Nunito_400Regular",
        fontSize: 14,
        color: "#555",
    },
    closeButton: {
        position: "absolute",
        top: 5,
        right: 10,
        padding: 5,
    },
    closeText: {
        fontSize: 18,
        color: "#999",
    },
});

export default NotificacoesScreen;

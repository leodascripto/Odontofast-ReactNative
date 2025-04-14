import React, { useState } from "react";
import {
    StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Animated
} from "react-native";
import Header from "../components/Header";

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
            title: "Lembrete de Consulta",
            message: "Você tem uma consulta com Dr. Felipe Amador no dia 20/03/2025 às 14:30.",
            icon: "📅",
        },
        {
            id: "2",
            title: "Promoção Especial",
            message: "Parabéns! Você ganhou um desconto de 15% na sua próxima limpeza. Aproveite!",
            icon: "🎉",
        },
        {
            id: "3",
            title: "Nova Mensagem",
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
                
                {/* Separando o ícone e o título em componentes Text independentes */}
                <View style={styles.titleContainer}>
                    <Text style={styles.iconText}>{item.icon}</Text>
                    <Text style={styles.title}>{item.title}</Text>
                </View>
                
                <Text style={styles.message}>{item.message}</Text>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            <Header 
                title="Notificações" 
                iconSource={require('../assets/images/notificacoesPage/notificacoespageicon.png')} 
            />
            
            {notifications.length > 0 ? (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Não há notificações no momento</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8F8F8",
    },
    listContainer: {
        padding: 20,
        paddingTop: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    emptyText: {
        fontFamily: "Nunito_400Regular",
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
    notification: {
        backgroundColor: "#FFF",
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5, // Sombra para Android
        position: "relative",
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    iconText: {
        fontSize: 18,
        marginRight: 8,
    },
    title: {
        fontFamily: "Nunito_700Bold",
        fontSize: 16,
        color: "#000",
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
        zIndex: 1,
    },
    closeText: {
        fontSize: 18,
        color: "#999",
    },
});

export default NotificacoesScreen;
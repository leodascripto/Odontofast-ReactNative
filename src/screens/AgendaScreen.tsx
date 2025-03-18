import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

const AgendaScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/agendaPage/agendaPageIcon.png')}
        style={styles.icon}
      />
      <Text style={styles.header}>Agenda.</Text>

      {/* Card de Próxima Avaliação */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Próxima Avaliação: Prótese Dental</Text>
        <Text style={styles.cardText}>Dr. Igor Guilherme</Text>
        <Text style={styles.cardText}>05 Junho de 2025</Text>
        <Text style={styles.cardText}>08:45 PM</Text>
        <Text style={styles.cardReminder}>Não esqueça de escovar os dentes pelo menos 30 minutos antes da consulta!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  header: {
    fontFamily: "Nunito_700Bold",
    fontSize: 36,
    color: "#45B3CB",
    marginTop: 60,
  },
  icon: {
    position: 'absolute',
    left: 45,
    top: 35,
    width: 65,
    height: 65,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    padding: 20,
    marginTop: 30,
    width: '90%',
    elevation: 5, // Sombra para o efeito de card
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  cardText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  cardReminder: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    color: "#ED7389", // Cor para o lembrete
    marginTop: 10,
    fontStyle: 'italic',
  },
});

export default AgendaScreen;

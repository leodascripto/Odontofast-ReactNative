import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

const API_URL = "http://10.0.2.2:5058/api/Usuario/1"; // URL da API para buscar o usuário

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Dashboard: { nome: string };
  FichaOdontoPage: undefined;
  AgendaScreen: undefined;
  ChecklistScreen: undefined;
  NotificacoesScreen: undefined;
};

type DashBoardScreenProps = StackScreenProps<RootStackParamList, "Dashboard">;

const DashboardScreen: React.FC<DashBoardScreenProps> = ({ navigation }) => {
  const [nome, setNome] = useState<string>(""); // Estado para armazenar o nome
  const [loading, setLoading] = useState<boolean>(true); // Estado para indicar carregamento

  // useEffect para fazer a requisição GET quando o componente for montado
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(API_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setNome(data.nomeUsuario); // Atualiza o estado com o nome retornado pela API
        } else {
          console.error("Erro na resposta da API:", response.status);
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    fetchUserData();
  }, []); // Array vazio significa que só executa ao montar o componente

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.header}>Carregando...</Text>
      ) : (
        <Text style={styles.header}>Olá, {nome}!</Text>
      )}

      <View style={styles.buttonsContainer}>
        {/* Linha 1 - Ficha Odonto e Agenda */}
        <TouchableOpacity
          style={[styles.button, styles.blueButton]}
          onPress={() => navigation.navigate("FichaOdontoPage")}
        >
          <Image source={require("../assets/images/fichaicon.png")} style={styles.icon} />
          <Text style={styles.buttonText}>Ficha Odonto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.greenButton]}
          onPress={() => navigation.navigate("AgendaScreen")}
        >
          <Image source={require("../assets/images/agendaicon.png")} style={styles.icon} />
          <Text style={styles.buttonText}>Agenda</Text>
        </TouchableOpacity>

        {/* Linha 2 - Checklist e Notificações */}
        <TouchableOpacity
          style={[styles.button, styles.yellowButton]}
          onPress={() => navigation.navigate("ChecklistScreen")}
        >
          <Image source={require("../assets/images/checklisticon.png")} style={styles.icon} />
          <Text style={styles.buttonText}>Checklist</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.redButton]}
          onPress={() => navigation.navigate("NotificacoesScreen")}
        >
          <Image source={require("../assets/images/notificacoesicon.png")} style={styles.icon} />
          <Text style={styles.buttonText}>Notificações</Text>
        </TouchableOpacity>
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
    textAlign: "center",
    marginBottom: 40,
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    width: 120,
    height: 120,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#f6f6f6",
    textAlign: "center",
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  blueButton: {
    backgroundColor: "#4573CB",
  },
  greenButton: {
    backgroundColor: "#ED7389",
  },
  yellowButton: {
    backgroundColor: "#37B453",
  },
  redButton: {
    backgroundColor: "#E0A955",
  },
});

export default DashboardScreen;
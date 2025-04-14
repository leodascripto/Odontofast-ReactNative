import { StackScreenProps } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Alert 
} from "react-native";
import { RootStackParamList } from "../types/navigation";
import { logout } from "../services/authService";

const API_URL = "http://10.0.2.2:5058/api/Usuario/1"; // URL da API para buscar o usuário

type DashBoardScreenProps = StackScreenProps<RootStackParamList, "Dashboard">;

const DashboardScreen: React.FC<DashBoardScreenProps> = ({ navigation, route }) => {
  const [nome, setNome] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Obter a largura da tela para layout responsivo
  const screenWidth = Dimensions.get('window').width;
  const buttonWidth = screenWidth > 360 ? 150 : 130;

  // useEffect para definir o nome que vem da rota ou fazer a requisição à API
  useEffect(() => {
    if (route.params?.nome) {
      setNome(route.params.nome);
      setLoading(false);
    } else {
      fetchUserData();
    }
  }, [route.params]);

  // Função para buscar dados do usuário da API
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
        setNome(data.nomeUsuario);
      } else {
        console.error("Erro na resposta da API:", response.status);
        // Definir um nome padrão se não conseguir da API
        setNome("Usuário");
      }
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      // Definir um nome padrão se não conseguir da API
      setNome("Usuário");
    } finally {
      setLoading(false);
    }
  };

  // Função para lidar com o logout
  const handleLogout = async () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sair",
          onPress: async () => {
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
              });
            } catch (error) {
              console.error("Erro ao fazer logout:", error);
              Alert.alert("Erro", "Não foi possível fazer logout. Tente novamente.");
            }
          }
        }
      ]
    );
  };

  // Array com informações dos botões do dashboard
  const dashboardButtons = [
    {
      id: 1,
      title: "Ficha Odonto",
      description: "Acesse seu histórico odontológico",
      icon: require("../assets/images/fichaicon.png"),
      bgColor: "#4573CB",
      screen: "FichaOdontoPage"
    },
    {
      id: 2,
      title: "Agenda",
      description: "Gerencie suas consultas",
      icon: require("../assets/images/agendaicon.png"),
      bgColor: "#ED7389",
      screen: "AgendaScreen"
    },
    {
      id: 3,
      title: "Checklist",
      description: "Acompanhe seus cuidados",
      icon: require("../assets/images/checklisticon.png"),
      bgColor: "#37B453",
      screen: "ChecklistScreen"
    },
    {
      id: 4,
      title: "Notificações",
      description: "Fique por dentro de tudo",
      icon: require("../assets/images/notificacoesicon.png"),
      bgColor: "#E0A955",
      screen: "NotificacoesScreen"
    }
  ];

  // Formatação da saudação baseada na hora do dia
  const formatGreeting = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour < 12) {
      return "Bom dia";
    } else if (currentHour < 18) {
      return "Boa tarde";
    } else {
      return "Boa noite";
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* Cabeçalho com saudação */}
        <View style={styles.headerContainer}>
          <View style={styles.greetingContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#45B3CB" />
            ) : (
              <>
                <Text style={styles.greetingText}>{formatGreeting()},</Text>
                <Text style={styles.headerName}>{nome}!</Text>
              </>
            )}
          </View>
          
          <Image 
            source={require("../assets/images/fastinho.png")}
            style={styles.avatarImage}
          />
        </View>

        {/* Cards de acesso rápido */}
        <Text style={styles.sectionTitle}>Acesso Rápido</Text>
        
        <View style={styles.buttonsContainer}>
          {dashboardButtons.map((button) => (
            <TouchableOpacity
              key={button.id}
              style={[
                styles.button, 
                { backgroundColor: button.bgColor, width: buttonWidth }
              ]}
              onPress={() => {
                // Corrigido: Navegação com base no screen definido
                switch (button.screen) {
                  case "FichaOdontoPage":
                    navigation.navigate("FichaOdontoPage");
                    break;
                  case "AgendaScreen":
                    navigation.navigate("AgendaScreen");
                    break;
                  case "ChecklistScreen":
                    navigation.navigate("ChecklistScreen");
                    break;
                  case "NotificacoesScreen":
                    navigation.navigate("NotificacoesScreen");
                    break;
                }
              }}
              accessibilityLabel={`Botão ${button.title}`}
              accessibilityHint={`Toque para acessar ${button.description}`}
            >
              <Image source={button.icon} style={styles.buttonIcon} />
              <Text style={styles.buttonTitle}>{button.title}</Text>
              <Text style={styles.buttonDescription}>{button.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Próxima consulta */}
        <Text style={styles.sectionTitle}>Próxima Consulta</Text>
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <Text style={styles.appointmentTitle}>Consulta Odontológica</Text>
            <Text style={styles.appointmentDate}>05/06/2025</Text>
          </View>
          <View style={styles.appointmentDetails}>
            <Text style={styles.appointmentDoctor}>Dr. Igor Guilherme</Text>
            <Text style={styles.appointmentTime}>⏰ 08:45</Text>
          </View>
          <TouchableOpacity 
            style={styles.appointmentButton}
            onPress={() => navigation.navigate("AgendaScreen")}
          >
            <Text style={styles.appointmentButtonText}>Ver detalhes</Text>
          </TouchableOpacity>
        </View>
        {/* Botão de Logout */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          accessibilityLabel="Sair da conta"
          accessibilityHint="Toque para fazer logout do aplicativo"
        >
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 20,
    paddingTop: 60,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
  },
  greetingContainer: {
    flex: 1,
  },
  greetingText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 18,
    color: "#666",
  },
  headerName: {
    fontFamily: "Nunito_700Bold",
    fontSize: 28,
    color: "#45B3CB",
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 10,
  },
  sectionTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
    color: "#333",
    alignSelf: "flex-start",
    marginBottom: 15,
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  button: {
    height: 130,
    marginBottom: 15,
    padding: 15,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "flex-start",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  buttonTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  buttonDescription: {
    fontFamily: "Nunito_400Regular",
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
  },
  appointmentCard: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  appointmentTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: "#333",
  },
  appointmentDate: {
    fontFamily: "Nunito_400Regular",
    fontSize: 16,
    color: "#45B3CB",
  },
  appointmentDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  appointmentDoctor: {
    fontFamily: "Nunito_400Regular",
    fontSize: 16,
    color: "#666",
  },
  appointmentTime: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#666",
  },
  appointmentButton: {
    backgroundColor: "#45B3CB",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  appointmentButtonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#fff",
  },
  logoutButton: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  logoutButtonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#ED7389",
  },
});

export default DashboardScreen;
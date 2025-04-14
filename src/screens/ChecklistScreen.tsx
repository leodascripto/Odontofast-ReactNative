import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert
} from "react-native";
import Checkbox from "expo-checkbox";
import Header from "../components/Header";
import { API_ENDPOINTS } from "../config/apiConfig";

const ChecklistScreen: React.FC = () => {
  const [checklist, setChecklist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [progress, setProgress] = useState(0);

  // Função para buscar dados da API
  const fetchChecklist = async () => {
    try {
      // Usar URL da configuração centralizada
      const apiUrl = API_ENDPOINTS.checklist;
      console.log("Buscando checklist de:", apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Dados inválidos recebidos da API");
      }
      
      setChecklist(data);

      // Inicializa os estados dos checkboxes
      const initialState: { [key: string]: boolean } = {};
      data.forEach((item: string) => {
        initialState[item] = false;
      });
      setCheckedItems(initialState);
      setProgress(0);
    } catch (error) {
      console.error("Erro ao buscar checklist:", error);
      Alert.alert(
        "Problema de Conexão",
        "Não foi possível carregar o checklist. Verifique sua conexão e tente novamente.",
        [{ text: "OK" }]
      );
      // Usar dados de fallback em caso de falha
      const fallbackItems = [
        "Escovou os dentes",
        "Passou fio dental",
        "Usou enxaguante bucal",
        "Bebeu bastante água"
      ];
      setChecklist(fallbackItems);
      
      const initialState: { [key: string]: boolean } = {};
      fallbackItems.forEach((item) => {
        initialState[item] = false;
      });
      setCheckedItems(initialState);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Atualizar progresso quando os itens marcados mudam
  useEffect(() => {
    if (checklist.length > 0) {
      const checkedCount = Object.values(checkedItems).filter(Boolean).length;
      setProgress(checkedCount / checklist.length);
    }
  }, [checkedItems, checklist]);

  // Buscar checklist da API ao carregar a tela
  useEffect(() => {
    fetchChecklist();
  }, []);

  // Função para atualizar o checklist (pull-to-refresh)
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchChecklist();
  }, []);

  // Função para atualizar o estado dos checkboxes
  const toggleCheckbox = (item: string) => {
    setCheckedItems((prev) => {
      const newState = { ...prev, [item]: !prev[item] };
      return newState;
    });
  };

  // Função para exibir mensagem de incentivo baseada no progresso
  const getMotivationalMessage = () => {
    if (progress === 0) return "Vamos começar os cuidados bucais hoje!";
    if (progress < 0.5) return "Bom começo! Continue cuidando do seu sorriso.";
    if (progress < 1) return "Quase lá! Complete todos os itens para um sorriso perfeito.";
    return "Parabéns! Você completou todos os cuidados hoje.";
  };

  return (
    <View style={styles.container}>
      <Header title="Checklist Diário" iconSource={require("../assets/images/CheckListPage/checklistpageicon.png")} />

      {/* Barra de Progresso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress * 100}%` }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round(progress * 100)}% completo
        </Text>
        <Text style={styles.motivationalText}>{getMotivationalMessage()}</Text>
      </View>

      {/* Loader enquanto carrega */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#45B3CB" />
          <Text style={styles.loadingText}>Carregando seu checklist...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.checklistContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} 
              colors={["#45B3CB"]}
              tintColor="#45B3CB"
            />
          }
        >
          <Text style={styles.sectionTitle}>Tarefas de Hoje</Text>
          
          {checklist.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.checklistItem,
                checkedItems[item] && styles.checklistItemDone
              ]}
              onPress={() => toggleCheckbox(item)}
              activeOpacity={0.8}
              accessibilityLabel={`Item de checklist: ${item}`}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: checkedItems[item] }}
            >
              <Checkbox
                value={checkedItems[item]}
                onValueChange={() => toggleCheckbox(item)}
                style={styles.checkbox}
                color={checkedItems[item] ? "#45B3CB" : undefined}
              />
              <Text 
                style={[
                  styles.checklistText,
                  checkedItems[item] && styles.checklistTextDone
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
          
          {/* Botão para gerar novo checklist */}
          <TouchableOpacity 
            style={styles.newChecklistButton}
            onPress={onRefresh}
            disabled={refreshing}
            accessibilityLabel="Gerar novo checklist"
            accessibilityHint="Toque para gerar uma nova lista de tarefas"
          >
            <Text style={styles.newChecklistButtonText}>
              {refreshing ? "Atualizando..." : "Gerar Novo Checklist"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Imagem final */}
      <Image 
        source={require("../assets/images/fastinho.png")} 
        style={styles.image}
        accessibilityLabel="Mascote do OdontoFast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  scrollView: {
    flex: 1,
  },
  progressContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    marginBottom: 10,
  },
  progressFill: {
    height: 10,
    backgroundColor: "#45B3CB",
    borderRadius: 10,
  },
  progressText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  motivationalText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  loadingText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 16,
    color: "#666",
    marginTop: 15,
  },
  sectionTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 18,
    color: "#333",
    marginVertical: 20,
  },
  checklistContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  checklistItemDone: {
    backgroundColor: "#E8F5F8",
    borderLeftColor: "#45B3CB",
    borderLeftWidth: 5,
  },
  checkbox: {
    marginRight: 15,
    borderRadius: 4,
    width: 24,
    height: 24,
  },
  checklistText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  checklistTextDone: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  newChecklistButton: {
    backgroundColor: "#45B3CB",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  newChecklistButtonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#fff",
  },
  image: {
    width: 130,
    height: 130,
    position: "absolute",
    bottom: -10,
    right: -10,
    opacity: 0.85,
  },
});

export default ChecklistScreen;
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator } from "react-native";
import Checkbox from "expo-checkbox";

const ChecklistScreen: React.FC = () => {
  const [checklist, setChecklist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  // Função para buscar dados da API
  const fetchChecklist = async () => {
    try {
      const response = await fetch("http://192.168.1.11:5000/checklist");
      const data = await response.json();
      setChecklist(data);

      // Inicializa os estados dos checkboxes como "false"
      const initialState: { [key: string]: boolean } = {};
      data.forEach((item: string) => {
        initialState[item] = false;
      });
      setCheckedItems(initialState);
    } catch (error) {
      console.error("Erro ao buscar checklist:", error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar checklist da API ao carregar a tela
  useEffect(() => {
    fetchChecklist();
  }, []);

  return (
    <View style={styles.container}>
      {/* Ícone e título */}
      <View style={styles.headerContainer}>
        <Image source={require("../assets/images/CheckListPage/checklistpageicon.png")} style={styles.icon} />
        <Text style={styles.header}>Checklist.</Text>
      </View>

      {/* Loader enquanto carrega */}
      {loading ? (
        <ActivityIndicator size="large" color="#45B3CB" />
      ) : (
        <ScrollView style={styles.checklistContainer}>
          {checklist.map((item, index) => (
            <View key={index} style={styles.checklistItem}>
              <Checkbox
                value={checkedItems[item]}
                onValueChange={() => setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }))}
                style={styles.checkbox}
                color={checkedItems[item] ? "black" : undefined}
              />
              <Text style={styles.checklistText}>{item}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Imagem final */}
      <Image source={require("../assets/images/fastinho.png")} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 40,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
    justifyContent: "center",
  },
  icon: {
    width: 65,
    height: 65,
    position: "absolute",
    left: 0,
  },
  header: {
    fontFamily: "Nunito_700Bold",
    fontSize: 36,
    color: "#45B3CB",
  },
  checklistContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  checkbox: {
    marginRight: 10,
  },
  checklistText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 18,
    color: "#333",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 100,
  },
});

export default ChecklistScreen;

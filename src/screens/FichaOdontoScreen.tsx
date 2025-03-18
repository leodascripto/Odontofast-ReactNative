import React from "react";
import { StyleSheet, Text, View, Image } from "react-native"; // Corrigido: Adicionado o import de Image

const FichaOdontoScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/fichaOdontoPage/fichaodontopageicon.png')} // Certifique-se que o caminho da imagem esteja correto
        style={styles.icon}
      />
      <Text style={styles.header}>Ficha Odontológica</Text>

      {/* Balão 1 - Extração Dentária */}
      <View style={styles.bubble}>
        <Text style={[styles.bubbleText, styles.bubbleTitle]}>
          Extração dentária
        </Text>
        <Text style={styles.bubbleText}>
          Efetuamos uma extração com o Dr. Pablo Marçal no dia (18/09/2023) às 15:45.
        </Text>
      </View>

      {/* Balão 2 - Restauração */}
      <View style={styles.bubble}>
        <Text style={[styles.bubbleText, styles.bubbleTitle]}>
          Restauração
        </Text>
        <Text style={styles.bubbleText}>
          Restauração bucal devido à dentes cariados. Também foi executado uma limpeza total. Dr. Andreas Kisser (25/08/2024)
        </Text>
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
    marginTop: 10, 
  },
  icon: {
    position: 'absolute',
    left: 35,  
    top: 35, 
    width: 55,  
    height: 50, 
    marginBottom: 2, 
  },
  bubble: {
    backgroundColor: "#ECE6F0",
    borderRadius: 15,
    padding: 15,
    marginTop: 50,
    width: '80%',
    alignItems: "flex-start",
  },
  bubbleText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    color: "#333",
  },
  bubbleTitle: {
    fontWeight: "bold", 
    marginBottom: 15,
  },
});

export default FichaOdontoScreen;

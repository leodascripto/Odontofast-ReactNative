import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  iconSource?: any;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showBackButton = true, 
  iconSource 
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          accessibilityLabel="Botão voltar"
          accessibilityHint="Toque para voltar à tela anterior"
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      )}
      
      {iconSource && (
        <Image source={iconSource} style={styles.icon} />
      )}
      
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    paddingBottom: 20,
    width: "100%",
    backgroundColor: "#f0f0f0",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 15,
    top: 50,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: "#45B3CB",
    fontFamily: "Nunito_700Bold",
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    fontFamily: "Nunito_700Bold",
    fontSize: 24,
    color: "#45B3CB",
  },
});

export default Header;
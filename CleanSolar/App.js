import { useEffect, useState } from 'react';
import { StyleSheet, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./src/componentes/SplashScreens";
import Login from "./src/componentes/Login";
import Cadastro from "./src/componentes/Cadastro";
import Home from "./src/telas/Home";
import DrawerRoutes from './src/navigation/DrawerRoutes';

// Cria o navegador em pilha (Stack Navigator)
const Stack = createNativeStackNavigator();

export default function App() {
  // Estado para controlar a exibição da tela de carregamento (SplashScreen)
  const [loading, setLoading] = useState(true);
  // Estado para armazenar se existe um usuário autenticado
  const [estaLogado, setEstaLogado] = useState(false);

  useEffect(() => {
    // Função assíncrona que verifica se o usuário possui uma sessão salva
    async function checarSessao() {
      try {
        let userId = null;

        // Verifica a plataforma para usar o armazenamento correto (Web x Mobile)
        if (Platform.OS === 'web') {
          userId = localStorage.getItem('user_id');
        } else {
          userId = await SecureStore.getItemAsync('user_id');
        }

        // Se encontrou o ID salvo, define a flag como verdadeira
        if (userId) {
          setEstaLogado(true);
        }
      } catch (erro) {
        console.log("Erro ao ler dados da sessão:", erro);
      } finally {
        // Remove a SplashScreen assim que terminar a verificação
        setLoading(false);
      }
    }

    checarSessao();
  }, []);

  // Exibe a SplashScreen enquanto verifica o estado da sessão
  if (loading) {
    return <SplashScreen />;
  }

  return (
    // Container do React Navigation que gerencia o estado da navegação
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={estaLogado ? "Drawer" : "Login"} 
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Drawer" component={DrawerRoutes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
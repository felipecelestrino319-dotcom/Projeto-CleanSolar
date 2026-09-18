// Importação de hooks do React para controle de estado e ciclo de vida
import React, { useState, useEffect } from 'react';

// Importação de componentes e utilitários visuais do React Native
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, ActivityIndicator, ImageBackground, Image } from 'react-native';

// Importação do pacote de ícones do Expo
import { Ionicons } from '@expo/vector-icons';

// Importação do módulo de localização geográfica do Expo
import * as Location from 'expo-location';

// Importação da instância pré-configurada do Axios para chamadas à API
import api from '../Api/api';

export default function CadastroScreen({ navigation }) {
  // Estados para capturar os dados digitados e gerenciar a interface
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [localizacao, setLocalizacao] = useState('Localização não obtida');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);

  // Executa a busca de localização assim que o componente é montado na tela
  useEffect(() => {
    obterLocalizacaoSilenciosa();
  }, []);

  // Obtém o GPS em segundo plano sem mostrar na tela
  async function obterLocalizacaoSilenciosa() {
    try {
      // Solicita permissão de acesso à localização no dispositivo
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      // Obtém as coordenadas geográficas (latitude e longitude)
      const location = await Location.getCurrentPositionAsync({});

      // Converte as coordenadas geográficas em um endereço legível
      const [endereco] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Se o endereço for retornado, formata a string e atualiza o estado
      if (endereco) {
        const rua = endereco.street || endereco.name || 'Rua não identificada';
        const cidade = endereco.subregion || endereco.city || 'Cidade não identificada';
        const estado = endereco.region || '';
        
        const textoEndereco = `${rua}, ${cidade} - ${estado}`.trim();
        setLocalizacao(textoEndereco);
      }
    } catch (e) {
      console.log('Erro ao capturar GPS em segundo plano:', e);
    }
  }

  // Função para processar a tentativa de cadastro do novo usuário
  async function handleCadastro() {
    // Validação de campos vazios
    if (!email.trim() || !senha.trim()) {
      return Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
    }

    setCarregando(true);

    try {
      // Envia os dados com a localização obtida no useEffect
      const resposta = await api.post('/usuarios/cadastro', {
        email: email.trim(),
        senha: senha.trim(),
        localizacao,
      });

      // Exibe mensagem de confirmação e redireciona para a tela de Login
      Alert.alert('Sucesso', resposta.data.mensagem || 'Conta criada com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error) {
      // Trata possíveis erros retornados pelo servidor
      const mensagemErro =
        error.response?.data?.mensagem || 'Não foi possível cadastrar no momento.';
      Alert.alert('Erro no Cadastro', mensagemErro);
    } finally {
      setCarregando(false);
    }
  }

  return (
    // Imagem de fundo cobrindo toda a tela
    <ImageBackground
      source={require("../../assets/fundo.png")}
      style={styles.fundo}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Logotipo principal */}
        <Image
          source={require("../../assets/logo_projeto1.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.titulo}>Criar Conta</Text>

        {/* Campo de entrada para o e-mail */}
        <TextInput
          style={styles.input}
          placeholder='Digite o e-mail:'
          placeholderTextColor='#0A3057'
          onChangeText={setEmail}
          value={email}
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
        />

        {/* Container do campo de senha com ícone para alternar visibilidade */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputSenha}
            placeholder="Digite sua senha:"
            placeholderTextColor='#0A3057'
            onChangeText={setSenha}
            value={senha}
            secureTextEntry={!mostrarSenha}
          />

          <Ionicons
            style={styles.icone}
            name={mostrarSenha ? "eye-off" : "eye"}
            size={24}
            color='#0A3057'
            onPress={() => setMostrarSenha(!mostrarSenha)}
          />
        </View>

        {/* Botão para submeter o cadastro */}
        <TouchableOpacity
          style={[styles.botao, carregando && styles.botaoDesabilitado]}
          onPress={handleCadastro}
          disabled={carregando}
          activeOpacity={0.7}
        >
          {carregando ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.textoBotao}>Cadastrar</Text>
          )}
        </TouchableOpacity>

        {/* Botão de navegação para retornar à tela de login */}
        <TouchableOpacity
          style={styles.btnVoltar}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.textoVoltar}>Já tem uma conta? Faça login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

// Objeto de estilos visual da tela de cadastro
const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    padding: 15,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  logo: {
    width: 220,
    height: 220,
    alignSelf: "center",
    marginBottom: 10,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#000000",
  },
  inputContainer: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  inputSenha: {
    flex: 1,
    fontSize: 16,
    padding: 0,
    color: "#000000",
  },
  icone: {
    marginLeft: 3,
  },
  botao: {
    width: "100%",
    height: 50,
    backgroundColor: '#0A3057',
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  textoBotao: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnVoltar: {
    marginTop: 15,
    alignItems: 'center',
  },
  textoVoltar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
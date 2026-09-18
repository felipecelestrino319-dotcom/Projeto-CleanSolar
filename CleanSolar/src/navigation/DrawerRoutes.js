// Importa a função para criar a navegação por menu lateral (Drawer)
import { createDrawerNavigator } from "@react-navigation/drawer";

// Importa as telas que farão parte do menu lateral
import Home from "../telas/Home";
import Limpeza from "../telas/Limpeza";
import Monitoramento from "../telas/Monitoramento";
import Historico from "../telas/Historico";
import Perfil from "../telas/Perfil";

// Instância do criador do menu lateral (Drawer Navigator)
const Drawer = createDrawerNavigator();

export default function DrawerRoutes() {
  return (
    // Componente principal de navegação Drawer que agrupa as opções de tela
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0F5E2E", // Cor de fundo do cabeçalho superior (verde)
        },
        headerTintColor: "#FFF",      // Cor do texto e dos ícones no cabeçalho (branco)
        drawerActiveTintColor: "#1C5C91", // Cor do texto/item ativo no menu lateral (azul)
      }}
    >
      {/* Telas que aparecerão no menu lateral */}
      <Drawer.Screen name="🏠 Início" component={Home} />
      <Drawer.Screen name="🧹 Limpeza" component={Limpeza} />
      <Drawer.Screen name="📊 Monitoramento" component={Monitoramento} />
      <Drawer.Screen name="📈 Histórico" component={Historico} />
      <Drawer.Screen name="👤 Perfil" component={Perfil} />
    </Drawer.Navigator>
  );
}
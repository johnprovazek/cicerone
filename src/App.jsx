import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import CiceronePage from "./pages/CiceronePage.jsx";

export default function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <CiceronePage />
    </ChakraProvider>
  );
}

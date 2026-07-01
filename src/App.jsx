import { ThemeProvider } from "./pages/ThemeContext";
import Homepage from "./pages/Homepage";

export default function App() {
  return (
    <ThemeProvider>
      <Homepage />
    </ThemeProvider>
  );
}
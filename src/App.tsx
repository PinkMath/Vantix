import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { ThemeContext, useThemeState } from "@/hooks/useTheme";

function AppInner() {
  const themeValue = useThemeState();
  return (
    <ThemeContext.Provider value={themeValue}>
      <AppRoutes />
    </ThemeContext.Provider>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={__BASE_PATH__}>
        <AppInner />
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;

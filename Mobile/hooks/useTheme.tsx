import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ColorScheme {
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  success: string;
  warning: string;
  danger: string;
  shadow: string;
  gradients: {
    background: [string, string];
    surface: [string, string];
    primary: [string, string];
    success: [string, string];
    warning: [string, string];
    danger: [string, string];
    muted: [string, string];
    empty: [string, string];
  };
  backgrounds: {
    input: string;
    editInput: string;
  };
  statusBarStyle: "light-content" | "dark-content";
}

const lightColors: ColorScheme = {
  bg: "#F6F7FB",
  surface: "#FFFFFF",
  text: "#1A1A1A",
  textMuted: "#6B7280",
  border: "#E5E7EB",
  primary: "#4F46E5",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  shadow: "#000000",
  gradients: {
    background: ["#F6F7FB", "#EEF0F6"],
    surface: ["#FFFFFF", "#F9FAFB"],
    primary: ["#4F46E5", "#4338CA"],
    success: ["#10B981", "#059669"],
    warning: ["#F59E0B", "#D97706"],
    danger: ["#EF4444", "#DC2626"],
    muted: ["#9CA3AF", "#6B7280"],
    empty: ["#F3F4F6", "#E5E7EB"],
  },
  backgrounds: {
    input: "#FFFFFF",
    editInput: "#F9FAFB",
  },
  statusBarStyle: "dark-content",
};

const darkColors: ColorScheme = {
  bg: "#0B1020",
  surface: "#151B2D",
  text: "#F8FAFC",
  textMuted: "#9CA3AF",
  border: "#1F2937",
  primary: "#6366F1",
  success: "#34D399",
  warning: "#FBBF24",
  danger: "#F87171",
  shadow: "#000000",
  gradients: {
    background: ["#0B1020", "#151B2D"],
    surface: ["#151B2D", "#1F2937"],
    primary: ["#6366F1", "#4F46E5"],
    success: ["#34D399", "#10B981"],
    warning: ["#FBBF24", "#F59E0B"],
    danger: ["#F87171", "#EF4444"],
    muted: ["#374151", "#4B5563"],
    empty: ["#1F2937", "#374151"],
  },
  backgrounds: {
    input: "#1F2937",
    editInput: "#0B1020",
  },
  statusBarStyle: "light-content",
};

type ThemeContextType = {
  isDark: boolean;
  setIsDark: Dispatch<SetStateAction<boolean>>;
  colors: ColorScheme;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("darkMode").then((value) => {
      if (value) setIsDark(JSON.parse(value));
    });
  }, []);

  const colors = isDark ? darkColors : lightColors;
  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

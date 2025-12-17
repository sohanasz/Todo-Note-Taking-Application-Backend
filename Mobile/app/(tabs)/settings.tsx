import { View, Text, Switch } from "react-native";
import React from "react";
import useTheme from "@/hooks/useTheme";
import { createSettingsStyles } from "@/assets/styles/settings";
import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "@/components/SafeScreen";

const Settings = () => {
  const { isDark, setIsDark, colors } = useTheme();
  const styles = createSettingsStyles(colors);

  return (
    <SafeScreen style={styles.container}>
      <Text style={styles.sectionTitle}>Settings</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.labelRow}>
            <Ionicons
              name={isDark ? "moon" : "sunny"}
              size={20}
              color={colors.primary}
            />
            <Text style={styles.label}>Dark Mode</Text>
          </View>

          <Switch
            value={isDark}
            onValueChange={setIsDark}
            trackColor={{
              false: colors.border,
              true: colors.primary,
            }}
            thumbColor={colors.surface}
            ios_backgroundColor={colors.border}
          />
        </View>

        <Text style={styles.helperText}>
          {isDark ? "Dark mode is enabled" : "Light mode is enabled"}
        </Text>
      </View>
    </SafeScreen>
  );
};

export default Settings;

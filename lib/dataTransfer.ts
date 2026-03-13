import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";
import { useAppStore } from "./store";

export async function exportData() {
  try {
    const state = useAppStore.getState();
    const exportData = {
      projects: state.projects,
      tasks: state.tasks,
      habits: state.habits,
      exportedAt: new Date().toISOString(),
      version: 1,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const fileName = `BuildTime_Backup_${
      new Date().toISOString().split("T")[0]
    }.json`;
    
    // @ts-ignore
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    // @ts-ignore
    await FileSystem.writeAsStringAsync(fileUri, jsonString, {
      // @ts-ignore
      encoding: FileSystem.EncodingType.UTF8,
    });

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "application/json",
        dialogTitle: "Export BuildTime Data",
      });
    } else {
      Alert.alert(
        "Export successful",
        `Data saved locally to ${fileUri}. Sharing is not available on this device.`,
      );
    }
  } catch (error) {
    console.error("Export failed:", error);
    Alert.alert("Export Error", "Failed to export data.");
  }
}

export async function importData() {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/json",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];
    // @ts-ignore
    const fileContents = await FileSystem.readAsStringAsync(file.uri, {
      // @ts-ignore
      encoding: FileSystem.EncodingType.UTF8,
    });

    const parsedData = JSON.parse(fileContents);

    if (!parsedData.projects || !parsedData.tasks || !parsedData.habits) {
      throw new Error("Invalid backup file format.");
    }

    const state = useAppStore.getState();
    state.setProjects(parsedData.projects);
    state.setTasks(parsedData.tasks);
    state.setHabits(parsedData.habits);

    Alert.alert("Import Successful", "Your data has been restored.");
  } catch (error) {
    console.error("Import failed:", error);
    Alert.alert(
      "Import Error",
      "Failed to read or parse the backup file. Ensure it is a valid JSON backup.",
    );
  }
}

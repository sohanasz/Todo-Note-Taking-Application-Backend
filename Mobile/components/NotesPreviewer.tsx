import { useNote } from "@/hooks/useNote";
import { TextInput, Text, ScrollView } from "react-native";
import SafeScreen from "./SafeScreen";
import Markdown from "react-native-markdown-display";
import useTheme from "@/hooks/useTheme";
import { createNotesPreviewStyles } from "@/assets/styles/notesPreviewer";

function markdownParser(document = []) {
  if (document.length < 1) {
    return "";
  }

  let documentMarkdownString = "";

  document.forEach((block) => {
    documentMarkdownString += blockDistinguisher(block);
  });

  return documentMarkdownString;
}

function blockDistinguisher(block) {
  let string = "";
  switch (block.blockType) {
    case "heading":
      string = `# ${block.text}\n\n`;
      return string;

    case "paragraph":
      string = `${block.text}\n\n`;
      return string;

    case "bulletList":
      block.text.forEach((item, index) => {
        string += `- ${item.text}${
          index === block.text.length - 1 ? "\n\n" : "\n"
        }`;
      });
      return string;

    case "numericList":
      block.text.forEach((item, index) => {
        string += `${item.id}. ${item.text}${
          index === block.text.length - 1 ? "\n\n" : "\n"
        }`;
      });
      return string;

    default:
      return "";
  }
}

export function NotesPreviewer() {
  const { note } = useNote();
  const { colors } = useTheme();
  const markdownStyles = createNotesPreviewStyles(colors);
  const parsed = markdownParser();

  return (
    <SafeScreen style={{ backgroundColor: colors.bg, flex: 1 }} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16 }}
      >
        <Markdown style={markdownStyles}>{parsed}</Markdown>
      </ScrollView>
    </SafeScreen>
  );
}

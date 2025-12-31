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
  const parsed = markdownParser([
    {
      id: 1,
      blockType: "heading",
      text: "My Document Title",
      meta: {},
      isFocused: false,
      textInputHeight: 100,
    },
    {
      id: 2,
      blockType: "paragraph",
      text: "This is the first paragraph of the document.",
      meta: {},
      isFocused: false,
      textInputHeight: 100,
    },
    {
      id: 3,
      blockType: "bulletList",
      text: [
        { id: 1, text: "First bullet point", textInputHeight: 25 },
        { id: 2, text: "Second bullet point", textInputHeight: 25 },
      ],
      meta: {},
      isFocused: false,
      textInputHeight: 100,
      currentBulletPointId: null,
    },
    {
      id: 4,
      blockType: "numericList",
      text: [
        { id: 1, text: "First numbered item", textInputHeight: 25 },
        { id: 2, text: "Second numbered item", textInputHeight: 25 },
      ],
      meta: {},
      isFocused: false,
      textInputHeight: 100,
      currentBulletPointId: null,
    },
    {
      id: 5,
      blockType: "heading",
      text: "My Document Title",
      meta: {},
      isFocused: false,
      textInputHeight: 100,
    },
    {
      id: 6,
      blockType: "heading",
      text: "My Document Title",
      meta: {},
      isFocused: false,
      textInputHeight: 100,
    },
    {
      id: 7,
      blockType: "heading",
      text: "My Document Title",
      meta: {},
      isFocused: false,
      textInputHeight: 100,
    },
    {
      id: 8,
      blockType: "heading",
      text: "My Document Title",
      meta: {},
      isFocused: false,
      textInputHeight: 100,
    },
    {
      id: 9,
      blockType: "heading",
      text: "My Document Title",
      meta: {},
      isFocused: false,
      textInputHeight: 100,
    },
    {
      id: 10,
      blockType: "heading",
      text: "My Document Title",
      meta: {},
      isFocused: false,
      textInputHeight: 100,
    },
    {
      id: 11,
      blockType: "heading",
      text: "My Document Title",
      meta: {},
      isFocused: false,
      textInputHeight: 100,
    },
    {
      id: 12,
      blockType: "heading",
      text: "My Document Title",
      meta: {},
      isFocused: false,
      textInputHeight: 100,
    },
    {
      id: 13,
      blockType: "heading",
      text: "My Document Title",
      meta: {},
      isFocused: false,
      textInputHeight: 100,
    },
    {
      id: 14,
      blockType: "heading",
      text: "My Document Title",
      meta: {},
      isFocused: false,
      textInputHeight: 100,
    },
    {
      id: 15,
      blockType: "heading",
      text: "My Document Title",
      meta: {},
      isFocused: false,
      textInputHeight: 100,
    },
  ]);

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

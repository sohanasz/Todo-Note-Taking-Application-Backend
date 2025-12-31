import { useNote } from "@/hooks/useNote";
import { TextInput, Text } from "react-native";
import SafeScreen from "./SafeScreen";

function markdownParser(document = []) {
  if (document.length < 1) {
    return;
  }

  const markdown = document.map((block) => {
    return blockDistinguisher(block);
  });
  return markdown;
}

function blockDistinguisher(block) {
  switch (block.blockType) {
    case "heading":
      return `# ${block.text}`;

    case "paragraph":
      return block.text;

    case "bulletList":
      return block.text.map((item) => `- ${item.text}`);

    case "numericList":
      return block.text.map((item, index) => `${index + 1}. ${item.text}`);

    default:
      return "";
  }
}

export function NotesPreviewer() {
  const { note } = useNote();
  const parsed = markdownParser(note);
  console.log(parsed);

  return (
    <SafeScreen style={{}}>
      {/* <TextInput value={parsed}></TextInput> */}
      <Text>{parsed}</Text>
    </SafeScreen>
  );
}

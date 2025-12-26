import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import useTheme from "@/hooks/useTheme";
import useProject from "@/hooks/useProject";
import SafeScreen from "@/components/SafeScreen";
import { api } from "@/lib/api";
import {
  createCreateNoteStyles,
  determineBlockStyle,
} from "@/assets/styles/createNote";
import { Ionicons } from "@expo/vector-icons";
import { useNote } from "@/hooks/useNote";
import { Heading, Paragraph } from "@/lib/classes/Block";

type Block = {
  id: number | null;
  blockType: string;
  text: string;
  meta: {};
  isFocused: boolean;
  textInputHeight: number;
};

const CreateNote = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { project } = useProject();
  const styles = createCreateNoteStyles(colors);
  const { note, setNote } = useNote();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [currentBlockCreationType, setCurrentBlockCreationType] =
    useState("heading");
  const [blocksList, setBlocksList] = useState<Block[]>([]);
  const [blockId, setBlockId] = useState<number>(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentBlockToEdit, setCurrentBlockToEdit] = useState({});
  const [writableTextInputHeight, setWritableTextInputHeight] = useState(10);

  const handlePreview = () => {
    setNote({ title, content });
    router.push({
      pathname: "/previewNote",
      params: { title, content },
    });
  };

  const handleSave = async () => {
    if (!project?._id || !content.trim()) {
      Alert.alert(
        "Notes did not save!",
        "Please select a project before saving...."
      );
      return;
    }

    try {
      setIsSaving(true);
      setNote({ title, content });
      await api.post(`/projects/${project._id}/notes`, {
        title,
        content,
      });
      router.back();
    } catch (err) {
      console.error("Failed to create note", err);
    } finally {
      setIsSaving(false);
    }
  };

  const createBlock = () => {
    let block: Block;

    switch (currentBlockCreationType) {
      case "heading":
        block = new Heading();
        break;
      case "paragraph":
        block = new Paragraph();
        break;
    }

    block["id"] = blockId + 1;

    setBlockId(blockId + 1);

    setBlocksList((blocksList) => {
      return [...blocksList, block];
    });

    console.log(block, blocksList);
  };

  console.log("selected type", currentBlockCreationType);

  const renderBlock = ({ item }) => {
    return (
      <View>
        {item === currentBlockToEdit ? (
          <TextInput
            defaultValue={item.text}
            scrollEnabled={false}
            onChangeText={(text) => {
              item.text = text;
            }}
            style={[
              determineBlockStyle(item.blockType, colors),
              {
                height: item.textInputHeight,
                borderColor: "gray",
                borderWidth: 2,
                borderRadius: 16,
                padding: 10,
                overflow: "hidden",
              },
            ]}
            onContentSizeChange={(e) => {
              const newHeight = Math.max(
                item.textInputHeight,
                e.nativeEvent.contentSize.height
              );
              if (newHeight !== item.textInputHeight) {
                console.log("Height Change");
                item.textInputHeight = newHeight;
                setWritableTextInputHeight(newHeight);
              }
            }}
            multiline={true}
            // numberOfLines={1}
            placeholder={`Enter your ${item.blockType}`}
          />
        ) : (
          <Text
            onPress={() => setCurrentBlockToEdit(item)}
            style={[determineBlockStyle(item.blockType, colors)]}
          >
            {item.text}
          </Text>
        )}
      </View>
    );
  };

  const handleDeleteBlock = () => {
    const updatedBlocksList = blocksList.filter((block) => {
      return block !== currentBlockToEdit;
    });

    setBlocksList(updatedBlocksList);
  };

  if (true) {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <SafeScreen style={styles.container}>
          {/* Blocks List */}
          <FlatList
            data={blocksList}
            keyExtractor={(item) => String(item.id)}
            numColumns={1}
            showsVerticalScrollIndicator={true}
            renderItem={renderBlock}
            keyboardShouldPersistTaps="handled"
          />

          {/* Overlay to close dropdown on outside tap */}
          {isDropdownOpen && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setIsDropdownOpen(false)}
              style={styles.dropdownOverlay}
            />
          )}

          {/* Floating Menu */}
          <View style={styles.editorMenuWrapper}>
            <View
              style={[styles.editorMenu, { backgroundColor: colors.surface }]}
            >
              {/* Add Block */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={createBlock}
                style={[
                  styles.menuIconBtn,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Ionicons name="add" size={22} color={colors.surface} />
              </TouchableOpacity>

              {/* Block Type Selector */}
              <View style={styles.blockSelector}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setIsDropdownOpen((p) => !p)}
                  style={[
                    styles.selectorTrigger,
                    { backgroundColor: colors.backgrounds.input },
                  ]}
                >
                  <Text style={[styles.selectorText, { color: colors.text }]}>
                    {currentBlockCreationType === "heading"
                      ? "Heading"
                      : "Paragraph"}
                  </Text>
                  <Ionicons
                    name={isDropdownOpen ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>

                {isDropdownOpen && (
                  <View
                    style={[
                      styles.dropdownMenu,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        shadowColor: colors.shadow,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCurrentBlockCreationType("heading");
                        setIsDropdownOpen(false);
                      }}
                    >
                      <Ionicons
                        name="text-outline"
                        size={16}
                        color={colors.primary}
                      />
                      <Text
                        style={[
                          styles.dropdownItemText,
                          { color: colors.text },
                        ]}
                      >
                        Heading
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCurrentBlockCreationType("paragraph");
                        setIsDropdownOpen(false);
                      }}
                    >
                      <Ionicons
                        name="document-text-outline"
                        size={16}
                        color={colors.primary}
                      />
                      <Text
                        style={[
                          styles.dropdownItemText,
                          { color: colors.text },
                        ]}
                      >
                        Paragraph
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleDeleteBlock}
                style={[styles.menuIconBtn, { backgroundColor: colors.danger }]}
              >
                <Ionicons name="trash" size={20} color={colors.surface} />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleSave}
                style={[
                  styles.menuIconBtn,
                  {
                    backgroundColor: colors.backgrounds.input,
                    borderWidth: 1,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons name="cloud" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </SafeScreen>
      </KeyboardAvoidingView>
    );
  }

  return (
    <SafeScreen style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Note</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePreview}
          style={styles.previewBtn}
        >
          <Ionicons name="eye-outline" size={18} color={colors.primary} />
          <Text style={styles.previewText}>Preview</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        placeholderTextColor={colors.textMuted}
        style={styles.titleInput}
        selectionColor={colors.primary}
      />

      {/* Content */}
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Write your note in Markdown..."
        placeholderTextColor={colors.textMuted}
        style={styles.editor}
        multiline
        textAlignVertical="top"
        selectionColor={colors.primary}
      />

      {/* Save */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleSave}
        disabled={isSaving}
        style={[styles.saveBtn, isSaving && styles.disabled]}
      >
        <Text style={styles.saveText}>
          {isSaving ? "Saving..." : "Save Note"}
        </Text>
      </TouchableOpacity>
    </SafeScreen>
  );
};

export default CreateNote;

import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNotes } from '../context/NotesContext';
import { useAppTheme } from '../theme/theme';

export default function NoteEditorScreen() {
  const { theme, isTablet } = useAppTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { addNote, updateNote, getNoteById } = useNotes();

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // If editing existing note, loading it
  useEffect(() => {
    if (params.id) {
      const existing = getNoteById(params.id);
      if (existing) {
        setTitle(existing.title);
        setBody(existing.body);
      }
    }
  }, [params.id, getNoteById]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
        },
        headerImage: {
          height: isTablet ? 220 : 160,
          justifyContent: 'flex-end',
          paddingHorizontal: theme.spacing.m,
          paddingBottom: theme.spacing.s,
          borderBottomWidth: theme.borders.width,
          borderBottomColor: theme.colors.border,
        },
        headerOverlay: {
          backgroundColor: theme.colors.accent,
          paddingHorizontal: theme.spacing.s,
          paddingVertical: theme.spacing.xs,
          alignSelf: 'flex-start',
          borderWidth: theme.borders.width,
          borderColor: theme.colors.border,
        },
        headerTitle: {
          ...theme.typography.h2,
          color: theme.colors.text,
        },
        titleInput: {
          ...theme.typography.h2,
          color: theme.colors.text,
          borderBottomWidth: theme.borders.width,
          borderBottomColor: theme.colors.border,
          paddingHorizontal: theme.spacing.m,
          paddingVertical: theme.spacing.s,
          backgroundColor: theme.colors.surface,
          marginHorizontal: theme.spacing.m,
          marginTop: theme.spacing.m,
          ...theme.shadow,
        },
        bodyInput: {
          ...theme.typography.bodyLarge,
          color: theme.colors.text,
          backgroundColor: theme.colors.surface,
          borderWidth: theme.borders.width,
          borderColor: theme.colors.border,
          marginHorizontal: theme.spacing.m,
          marginTop: theme.spacing.s,
          padding: theme.spacing.s,
          flex: 1,
          textAlignVertical: 'top',
          ...theme.shadow,
        },
        buttonRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: theme.spacing.m,
          marginBottom: theme.spacing.xl,
          gap: theme.spacing.s,
        },
      }),
    [theme, isTablet]
  );

  const baseButton = useMemo(
    () =>
      StyleSheet.create({
        default: {
          flex: 1,
          paddingVertical: theme.spacing.s,
          borderWidth: theme.borders.width,
          borderColor: theme.colors.border,
          alignItems: 'center',
          justifyContent: 'center',
          ...theme.shadow,
        },
      }),
    [theme]
  );

  const saveButton = useMemo(
    () =>
      StyleSheet.compose(baseButton.default, {
        backgroundColor: theme.colors.accent,
      }),
    [baseButton.default, theme.colors.accent]
  );

  const backButton = useMemo(
    () =>
      StyleSheet.compose(baseButton.default, {
        backgroundColor: theme.colors.surface,
      }),
    [baseButton.default, theme.colors.surface]
  );

  const getPressedButton = (baseStyle: any) =>
    StyleSheet.flatten([
      baseStyle,
      {
        shadowOffset: { width: 1, height: 1 },
        transform: [{ translateX: 3 }, { translateY: 3 }],
        borderColor: theme.colors.accent,
      },
    ]);

  const handleSave = () => {
    if (params.id) {
      updateNote(params.id, title, body);
    } else {
      addNote(title, body);
    }
    router.back();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ImageBackground
          source={require("../assets/images/neo-background.jpg")}
          style={styles.headerImage}
          imageStyle={{ opacity: 0.9 }}
        >
          <View style={styles.headerOverlay}>
            <Text style={styles.headerTitle}>EDITOR</Text>
          </View>
        </ImageBackground>

        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          placeholderTextColor={theme.colors.placeholder}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.bodyInput}
          placeholder="Start typing raw thoughts..."
          placeholderTextColor={theme.colors.placeholder}
          multiline
          value={body}
          onChangeText={setBody}
          scrollEnabled={false}
        />

        <View style={styles.buttonRow}>
          <Pressable
            style={({ pressed }) =>
              pressed ? getPressedButton(backButton) : backButton
            }
            onPress={handleBack}
          >
            <Text style={[theme.typography.button, { color: theme.colors.text }]}>
              BACK
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) =>
              pressed ? getPressedButton(saveButton) : saveButton
            }
            onPress={handleSave}
          >
            <Text style={[theme.typography.button, { color: theme.colors.text }]}>
              SAVE
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
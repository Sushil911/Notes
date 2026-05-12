import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Note, useNotes } from '../context/NotesContext';
import { useAppTheme } from '../theme/theme';

export default function NotesListScreen() {
  const { theme, isTablet, themeMode, setThemeMode } = useAppTheme();
  const { notes } = useNotes(); 
  const router = useRouter();
  const [search, setSearch] = useState('');

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.colors.background,
          paddingHorizontal: theme.spacing.m,
          paddingTop: theme.spacing.xl,
        },
        header: {
          ...theme.typography.h1,
          color: theme.colors.text,
          marginBottom: theme.spacing.m,
          borderBottomWidth: 4,
          borderBottomColor: theme.colors.accent,
          paddingBottom: theme.spacing.xs,
        },
        toggleRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: theme.spacing.m,
        },
        toggleLabel: {
          ...theme.typography.tiny,
          color: theme.colors.text,
        },
        search: {
          ...theme.typography.body,
          color: theme.colors.text,
          backgroundColor: theme.colors.surface,
          borderWidth: theme.borders.width,
          borderColor: theme.colors.border,
          padding: theme.spacing.s,
          marginBottom: theme.spacing.m,
          ...theme.shadow,
        },
        card: {
          backgroundColor: theme.colors.surface,
          borderWidth: theme.borders.width,
          borderColor: theme.colors.border,
          padding: theme.spacing.s,
          marginBottom: theme.spacing.s,
          ...theme.shadow,
        },
        cardTitle: {
          ...theme.typography.h2,
          color: theme.colors.text,
          marginBottom: theme.spacing.xs,
        },
        cardSnippet: {
          ...theme.typography.body,
          color: theme.colors.textSecondary,
          marginBottom: theme.spacing.xs,
        },
        cardDate: {
          ...theme.typography.small,
          color: theme.colors.textSecondary,
        },
      }),
    [theme, isTablet]
  );

  // Filter notes based on search
  const filteredNotes = useMemo(() => {
    if (!search.trim()) return notes;
    const q = search.toLowerCase();
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
    );
  }, [notes, search]);

  const NoteCard = ({ item }: { item: Note }) => {
    const cardBase = styles.card;

    const pressedStyle = useMemo(
      () =>
        StyleSheet.flatten([
          cardBase,
          {
            shadowOffset: { width: 1, height: 1 },
            transform: [{ translateX: 3 }, { translateY: 3 }],
            borderColor: theme.colors.accent,
          },
        ]),
      [cardBase, theme.colors.accent]
    );

    return (
      <Pressable
        style={({ pressed }) => (pressed ? pressedStyle : cardBase)}
        onPress={() =>
          router.push({ pathname: '/editor', params: { id: item.id } })
        }
      >
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSnippet} numberOfLines={2}>
          {item.body}
        </Text>
        <Text style={styles.cardDate}>{item.date}</Text>
      </Pressable>
    );
  };

  // Toggle Logic
  const toggleTheme = () => {
    if (themeMode === 'system') setThemeMode('light');
    else if (themeMode === 'light') setThemeMode('dark');
    else setThemeMode('system');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>✎ NOTES</Text>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>
          {themeMode === 'system'
            ? 'System'
            : themeMode === 'dark'
            ? 'Dark Mode'
            : 'Light Mode'}
        </Text>
        <Switch
          value={theme.isDark}
          onValueChange={toggleTheme}
          trackColor={{
            false: theme.colors.placeholder,
            true: theme.colors.accent,
          }}
          thumbColor={theme.colors.surface}
        />
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search notes..."
        placeholderTextColor={theme.colors.placeholder}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteCard item={item} />}
        numColumns={isTablet ? 2 : 1}
        key={isTablet ? 'tablet' : 'phone'}
      />

      <Pressable
        style={({ pressed }) => [
          {
            position: 'absolute',
            bottom: theme.spacing.l,
            right: theme.spacing.l,
            backgroundColor: theme.colors.accent,
            width: 64,
            height: 64,
            borderWidth: theme.borders.width,
            borderColor: theme.colors.border,
            alignItems: 'center',
            justifyContent: 'center',
          },
          theme.shadow,
          pressed && {
            shadowOffset: { width: 1, height: 1 },
            transform: [{ translateX: 3 }, { translateY: 3 }],
          },
        ]}
        onPress={() => router.push('/editor')} // no id → new note
      >
        <Text style={[theme.typography.h1, { color: theme.colors.text }]}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}
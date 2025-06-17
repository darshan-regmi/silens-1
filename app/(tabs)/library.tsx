import { Platform } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Search, Book, Trash2, Share } from 'lucide-react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { getNotesFromNotion, deleteNoteInNotion, type PoemNote } from '@/utils/storage';
import NoteCard from '@/components/NoteCard';

export default function LibraryScreen() {
  const [notes, setNotes] = useState<PoemNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<PoemNote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadNotes = async () => {
    try {
      const savedNotes = await getNotesFromNotion();
      setNotes(savedNotes);
      setFilteredNotes(savedNotes);
    } catch (error) {
      console.error('Failed to load notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  }, [searchQuery, notes]);

  const handleDeleteNote = (noteId: string) => {
    Alert.alert(
      'Delete Poem',
      'Are you sure you want to delete this poem? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNoteInNotion(noteId);
              await loadNotes();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete the poem.');
            }
          },
        },
      ]
    );
  };

  const handleViewPoem = (note: PoemNote) => {
    router.push({
      pathname: '/poem/[id]',
      params: {
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      },
    });
  };

  const renderNote = ({ item }: { item: PoemNote }) => (
    <NoteCard
      note={item}
      onDelete={() => handleDeleteNote(item.id)}
      onPress={() => handleViewPoem(item)}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your poems...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Book size={24} color="#8B5A3C" strokeWidth={1.5} />
          <Text style={styles.headerTitle}>Library</Text>
        </View>
        <Text style={styles.noteCount}>
          {filteredNotes.length} poem{filteredNotes.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#A0A0A0" strokeWidth={1.5} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search your poems..."
          placeholderTextColor="#A0A0A0"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Book size={48} color="#C0C0C0" strokeWidth={1} />
          <Text style={styles.emptyTitle}>
            {searchQuery ? 'No poems found' : 'No poems yet'}
          </Text>
          <Text style={styles.emptyDescription}>
            {searchQuery
              ? 'Try adjusting your search terms'
              : 'Start writing your first poem in the Write tab'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotes}
          renderItem={renderNote}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'LibreBaskerville-Regular',
    color: '#A0A0A0',
  },
  header: {
    marginTop: Platform.select({
      android: 16,
      ios: 0,
    }),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E2D5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'LibreBaskerville-Bold',
    color: '#8B5A3C',
    marginLeft: 12,
  },
  noteCount: {
    fontSize: 14,
    fontFamily: 'LibreBaskerville-Regular',
    color: '#A0A0A0',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8E2D5',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'LibreBaskerville-Regular',
    color: '#2D2D2D',
    marginLeft: 12,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'LibreBaskerville-Bold',
    color: '#8B5A3C',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    fontFamily: 'LibreBaskerville-Regular',
    color: '#A0A0A0',
    textAlign: 'center',
    lineHeight: 24,
  },
});

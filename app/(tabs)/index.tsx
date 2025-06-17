import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Save, FileText } from 'lucide-react-native';
import { createNoteInNotion } from '@/utils/storage';

export default function WriteScreen() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const words =
      content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
    setWordCount(words);
    setCharCount(content.length);
    setHasUnsavedChanges(title.trim() !== '' || content.trim() !== '');
  }, [title, content]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Empty Note', 'Please add some content before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const noteTitle = title.trim() || 'Untitled Poem';
      await createNoteInNotion({
        title: noteTitle,
        content: content.trim(),
        status: 'writing',
      });

      Alert.alert('Saved', 'Your poem has been saved to the library.', [
        {
          text: 'Continue Writing',
          style: 'default',
        },
        {
          text: 'New Poem',
          onPress: () => {
            setTitle('');
            setContent('');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save your poem. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <FileText size={24} color="#8B5A3C" strokeWidth={1.5} />
            <Text style={styles.headerTitle}>New Poem</Text>
          </View>
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Save size={20} color="#FFFFFF" strokeWidth={1.5} />
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Writing Area */}
        <View style={styles.writingArea}>
          <TextInput
            style={styles.titleInput}
            placeholder="Title your poem..."
            placeholderTextColor="#A0A0A0"
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />

          <TextInput
            style={styles.contentInput}
            placeholder="Begin writing your poem..."
            placeholderTextColor="#A0A0A0"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            scrollEnabled
          />
        </View>

        {/* Footer Stats */}
        <View style={styles.footer}>
          <Text style={styles.stats}>
            {wordCount} words • {charCount} characters
          </Text>
          {hasUnsavedChanges && (
            <View style={styles.unsavedIndicator}>
              <View style={styles.unsavedDot} />
              <Text style={styles.unsavedText}>Unsaved changes</Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F0',
  },
  keyboardContainer: {
    flex: 1,
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
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5A3C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontFamily: 'LibreBaskerville-Regular',
    fontSize: 14,
    marginLeft: 6,
  },
  writingArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  titleInput: {
    fontSize: 24,
    fontFamily: 'LibreBaskerville-Bold',
    color: '#2D2D2D',
    marginBottom: 20,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E2D5',
  },
  contentInput: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'LibreBaskerville-Regular',
    color: '#2D2D2D',
    lineHeight: 28,
    paddingVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8E2D5',
  },
  stats: {
    fontSize: 12,
    fontFamily: 'LibreBaskerville-Regular',
    color: '#A0A0A0',
  },
  unsavedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unsavedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6B6B',
    marginRight: 6,
  },
  unsavedText: {
    fontSize: 12,
    fontFamily: 'LibreBaskerville-Regular',
    color: '#FF6B6B',
  },
});

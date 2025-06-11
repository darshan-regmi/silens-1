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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Save, X } from 'lucide-react-native';
import { createNoteInNotion, type PoemNote } from '@/utils/storage';

export default function EditPoemScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const [title, setTitle] = useState(params.title as string || '');
  const [content, setContent] = useState(params.content as string || '');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const originalTitle = params.title as string || '';
  const originalContent = params.content as string || '';

  useEffect(() => {
    const words = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
    setWordCount(words);
    setCharCount(content.length);
    
    // Check if there are unsaved changes
    const titleChanged = title.trim() !== originalTitle.trim();
    const contentChanged = content.trim() !== originalContent.trim();
    setHasUnsavedChanges(titleChanged || contentChanged);
  }, [title, content, originalTitle, originalContent]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Empty Poem', 'Please add some content before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const updatedPoem: PoemNote = {
        id: params.id as string,
        title: title.trim() || 'Untitled Poem',
        content: content.trim(),
        status: 'writing',
        createdAt: params.createdAt as string,
        updatedAt: new Date().toISOString(),
      };

      await createNoteInNotion(updatedPoem);

      Alert.alert('Saved', 'Your poem has been updated successfully.', [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save your poem. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Discard Changes',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          {
            text: 'Keep Editing',
            style: 'cancel',
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <X size={24} color="#8B5A3C" strokeWidth={1.5} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Edit Poem</Text>
          
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}>
            <Save size={20} color="#FFFFFF" strokeWidth={1.5} />
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Editing Area */}
        <View style={styles.editingArea}>
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
            placeholder="Write your poem..."
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E2D5',
  },
  cancelButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'LibreBaskerville-Bold',
    color: '#8B5A3C',
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
  editingArea: {
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
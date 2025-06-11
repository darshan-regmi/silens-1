import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { MoreVertical, Trash2, Share2, Edit3 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { type PoemNote } from '@/utils/storage';

interface NoteCardProps {
  note: PoemNote;
  onDelete: () => void;
  onPress?: () => void;
}

export default function NoteCard({ note, onDelete, onPress }: NoteCardProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getPreviewText = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + '...';
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${note.title}\n\n${note.content}`,
        title: note.title,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the poem.');
    }
  };

  const handleEdit = () => {
    router.push({
      pathname: '/edit/[id]',
      params: {
        id: note.id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      }
    });
  };

  const showActionSheet = () => {
    Alert.alert(
      note.title,
      'Choose an action',
      [
        {
          text: 'Edit',
          onPress: handleEdit,
        },
        {
          text: 'Share',
          onPress: handleShare,
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: onDelete,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {note.title}
        </Text>
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={showActionSheet}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MoreVertical size={20} color="#A0A0A0" strokeWidth={1.5} />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.content} numberOfLines={4}>
        {getPreviewText(note.content)}
      </Text>
      
      <View style={styles.footer}>
        <Text style={styles.date}>{formatDate(note.createdAt)}</Text>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleEdit}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Edit3 size={16} color="#8B5A3C" strokeWidth={1.5} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleShare}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Share2 size={16} color="#8B5A3C" strokeWidth={1.5} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={onDelete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Trash2 size={16} color="#FF6B6B" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8E2D5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'LibreBaskerville-Bold',
    color: '#2D2D2D',
    lineHeight: 24,
    marginRight: 12,
  },
  menuButton: {
    padding: 4,
  },
  content: {
    fontSize: 16,
    fontFamily: 'LibreBaskerville-Regular',
    color: '#5D5D5D',
    lineHeight: 24,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    fontFamily: 'LibreBaskerville-Regular',
    color: '#000000FF',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 8,
  },
});
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Share2, BookOpen, Calendar, Clock, Edit3 } from 'lucide-react-native';
import { type PoemNote } from '@/utils/storage';

const { width: screenWidth } = Dimensions.get('window');

export default function PoemDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [isFavorited, setIsFavorited] = useState(false);

  const poem: PoemNote = {
    id: params.id as string,
    title: params.title as string,
    content: params.content as string,
    status: params.status as 'writing' | 'not published' | 'Published',
    createdAt: params.createdAt as string,
    updatedAt: params.updatedAt as string,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getWordCount = (text: string) => {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  };

  const getLineCount = (text: string) => {
    return text.split('\n').length;
  };

  const getReadingTime = (wordCount: number) => {
    // Average reading speed is 200-250 words per minute
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes === 1 ? '1 min read' : `${minutes} min read`;
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${poem.title}\n\n${poem.content}`,
        title: poem.title,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the poem.');
    }
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Here you would typically save the favorite status to storage
  };

  const handleEdit = () => {
    router.push({
      pathname: '/edit/[id]',
      params: {
        id: poem.id,
        title: poem.title,
        content: poem.content,
        createdAt: poem.createdAt,
        updatedAt: poem.updatedAt,
      }
    });
  };

  const wordCount = getWordCount(poem.content);
  const lineCount = getLineCount(poem.content);
  const readingTime = getReadingTime(wordCount);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={24} color="#8B5A3C" strokeWidth={1.5} />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleEdit}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Edit3 size={24} color="#8B5A3C" strokeWidth={1.5} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleShare}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Share2 size={24} color="#8B5A3C" strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Poem Title */}
        <Text style={styles.title}>{poem.title}</Text>

        {/* Metadata */}
        <View style={styles.metadata}>
          <View style={styles.metadataRow}>
            <Calendar size={16} color="#A0A0A0" strokeWidth={1.5} />
            <Text style={styles.metadataText}>{formatDate(poem.createdAt)}</Text>
          </View>
          
          <View style={styles.metadataRow}>
            <Clock size={16} color="#A0A0A0" strokeWidth={1.5} />
            <Text style={styles.metadataText}>{formatTime(poem.createdAt)}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <BookOpen size={18} color="#8B5A3C" strokeWidth={1.5} />
            <Text style={styles.statLabel}>Words</Text>
            <Text style={styles.statValue}>{wordCount}</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>¶</Text>
            <Text style={styles.statLabel}>Lines</Text>
            <Text style={styles.statValue}>{lineCount}</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Clock size={18} color="#8B5A3C" strokeWidth={1.5} />
            <Text style={styles.statLabel}>Reading</Text>
            <Text style={styles.statValue}>{readingTime}</Text>
          </View>
        </View>

        {/* Poem Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.content}>{poem.content}</Text>
        </View>

        {/* Footer Info */}
        {poem.updatedAt !== poem.createdAt && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Last edited on {formatDate(poem.updatedAt)} at {formatTime(poem.updatedAt)}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F0',
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
  backButton: {
    padding: 4,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontFamily: 'LibreBaskerville-Bold',
    color: '#2D2D2D',
    lineHeight: 40,
    marginBottom: 24,
    textAlign: 'center',
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 32,
  },
  metadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metadataText: {
    fontSize: 14,
    fontFamily: 'LibreBaskerville-Regular',
    color: '#A0A0A0',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#E8E2D5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    fontSize: 18,
    color: '#8B5A3C',
    fontFamily: 'LibreBaskerville-Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'LibreBaskerville-Regular',
    color: '#A0A0A0',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'LibreBaskerville-Bold',
    color: '#2D2D2D',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E8E2D5',
    marginHorizontal: 16,
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E8E2D5',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    fontSize: 18,
    fontFamily: 'LibreBaskerville-Regular',
    color: '#2D2D2D',
    lineHeight: 32,
    textAlign: 'left',
  },
  footer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E2D5',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'LibreBaskerville-Regular',
    color: '#A0A0A0',
    textAlign: 'center',
  },
});
import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles } from '@/styles/cart/ordernote';

interface OrderNoteProps {
  note: string;
  onNoteChange: (note: string) => void;
}

export default function OrderNote({ note, onNoteChange }: OrderNoteProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Order Note (Optional)</Text>
      
      <View style={styles.noteContainer}>
        <TextInput
          style={styles.noteInput}
          placeholder="Add special instructions for your order..."
          placeholderTextColor="#999"
          value={note}
          onChangeText={onNoteChange}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={500}
        />
        
        <View style={styles.characterCount}>
          <Text style={styles.characterCountText}>
            {note.length}/500
          </Text>
        </View>
      </View>
    </View>
  );
}
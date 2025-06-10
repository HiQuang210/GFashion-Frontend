import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { styles } from '@/styles/cart/cartitem';

type RemoveConfirmationModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading: boolean;
};

const RemoveConfirmationModal: React.FC<RemoveConfirmationModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  isLoading,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Remove Item</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to remove this item from your cart?
          </Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onCancel}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.removeButton]}
              onPress={onConfirm}
              disabled={isLoading}
            >
              <Text style={styles.removeButtonText}>
                {isLoading ? 'Removing...' : 'Remove'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(RemoveConfirmationModal);

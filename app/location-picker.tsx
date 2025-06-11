import React, { useState, useCallback, useMemo } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import BackButton from '@/components/BackButton';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/useToast';
import { UserAPI } from '@/api/services/UserService';
import { styles } from "@/styles/locationpicker";
import { Address } from '@/types/address';

export default function LocationPicker() {
  const router = useRouter();
  const { userInfo } = useAuth();
  const { user: userData, refetch: refetchUser, isLoading: isUserLoading, isError } = useUser(userInfo?._id);
  const { showSuccessToast, showErrorToast } = useToast();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);

  // Refresh user data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (userInfo?._id) {
        refetchUser();
      }
    }, [userInfo?._id, refetchUser])
  );

  const addresses = useMemo(() => {
    const addressSource = userData?.data?.address;
    
    if (!addressSource || !Array.isArray(addressSource)) {
      return [];
    }

    return addressSource.map((addr: any) => ({
      recipient: addr.recipient || '',
      phone: addr.phone || '',
      location: addr.location || '',
    })) as Address[];
  }, [userData?.data?.address]);

  const isLoading = isUserLoading || !userInfo;

  const handleAddAddress = useCallback(() => {
    router.push('/address-form');
  }, [router]);

  const handleSelectAddress = useCallback((address: Address) => {
    router.push({
      pathname: '/checkout',
      params: {
        selectedAddress: JSON.stringify(address)
      }
    });
  }, [router]);

  const handleEditAddress = useCallback((index: number) => {
    const addressToEdit = addresses[index];
    router.push({
      pathname: '/address-form',
      params: {
        editMode: 'true',
        editIndex: index.toString(),
        addressData: JSON.stringify(addressToEdit)
      }
    });
  }, [addresses, router]);

  const handleDeleteConfirmation = useCallback((index: number) => {
    if (deleteConfirmIndex === index) {
      handleDeleteAddress(index);
      setDeleteConfirmIndex(null);
    } else {
      setDeleteConfirmIndex(index);
      showErrorToast('Confirm Delete', 'Tap delete button again to confirm');
      
      setTimeout(() => {
        setDeleteConfirmIndex(null);
      }, 3000);
    }
  }, [deleteConfirmIndex, showErrorToast]);

  const handleDeleteAddress = useCallback(async (index: number) => {
    if (!userInfo?._id) {
      showErrorToast('Error', 'User information not available');
      return;
    }

    try {
      setIsUpdating(true);
      const updatedAddresses = addresses.filter((_, i) => i !== index);
      
      await UserAPI.updateUser(userInfo._id, { address: updatedAddresses } as any);
      
      // Refetch user data to get updated addresses
      await refetchUser();
      
      showSuccessToast('Success', 'Address deleted successfully');
    } catch (error) {
      console.error('Error deleting address:', error);
      showErrorToast('Error', 'Failed to delete address');
    } finally {
      setIsUpdating(false);
      setDeleteConfirmIndex(null);
    }
  }, [addresses, userInfo?._id, refetchUser, showSuccessToast, showErrorToast]);

  const renderAddressItem = useCallback(({ item, index }: { item: Address; index: number }) => {
    const isConfirmingDelete = deleteConfirmIndex === index;
    
    return (
      <TouchableOpacity
        style={styles.addressItem}
        onPress={() => handleSelectAddress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.addressContent}>
          <View style={styles.addressDetails}>
            <Text style={styles.recipientName}>{item.recipient}</Text>
            <Text style={styles.phoneNumber}>{item.phone}</Text>
            <Text style={styles.locationText} numberOfLines={2}>
              {item.location}
            </Text>
          </View>
          <View style={styles.addressActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleEditAddress(index)}
            >
              <Ionicons name="pencil" size={16} color="#704F38" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                isConfirmingDelete && { backgroundColor: '#ffebee' }
              ]}
              onPress={() => handleDeleteConfirmation(index)}
              disabled={isUpdating}
            >
              <Ionicons 
                name="trash-outline" 
                size={16} 
                color={isConfirmingDelete ? "#d32f2f" : "#dc3545"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [deleteConfirmIndex, handleSelectAddress, handleEditAddress, handleDeleteConfirmation, isUpdating]);

  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Ionicons name="location-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Please pick a delivery address</Text>
      <Text style={styles.emptySubtext}>
        Add your first delivery address to continue
      </Text>
    </View>
  ), []);

  const renderErrorState = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Ionicons name="alert-circle-outline" size={64} color="#ff6b6b" />
      <Text style={styles.emptyText}>Failed to load addresses</Text>
      <Text style={styles.emptySubtext}>
        Please check your connection and try again
      </Text>
      <TouchableOpacity
        style={[styles.addButton, { marginTop: 16, backgroundColor: '#ff6b6b' }]}
        onPress={() => refetchUser()}
        activeOpacity={0.8}
      >
        <Ionicons name="refresh" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  ), [refetchUser]);

  const renderLoadingState = useCallback(() => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#704F38" />
      <Text style={styles.loadingText}>Loading addresses...</Text>
    </View>
  ), []);

  const keyExtractor = useCallback((item: Address, index: number) => 
    `${item.recipient}-${item.phone}-${index}`, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.title}>Choose Delivery Address</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {isLoading ? (
          renderLoadingState()
        ) : isError ? (
          renderErrorState()
        ) : addresses.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={addresses}
            renderItem={renderAddressItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.addressList}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={false}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
        )}

        <TouchableOpacity
          style={[
            styles.addButton,
            isUpdating && { opacity: 0.6 }
          ]}
          onPress={handleAddAddress}
          activeOpacity={0.8}
          disabled={isUpdating}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add Delivery Address</Text>
        </TouchableOpacity>
      </View>

      {isUpdating && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#704F38" />
        </View>
      )}
    </SafeAreaView>
  );
}
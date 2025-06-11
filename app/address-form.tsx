import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import BackButton from '@/components/BackButton';
import LocationPicker from '@/components/LocationPicker';
import {
  fetchProvinces,
  fetchDistrictsByProvince,
  fetchWardsByDistrict,
} from '@/utils/data-province';
import { useAuth } from '@/hooks/useAuth';
import { UserAPI } from '@/api/services/UserService';
import { useToast } from '@/hooks/useToast';
import { addressStyles } from '@/styles/address';
import { Province, District, Ward } from '@/types/address';

export default function AddAddress() {
  const router = useRouter();
  const { userInfo, refreshUserData } = useAuth();
  const { showSuccessToast, showErrorToast } = useToast();
  
  // Form states
  const [recipient, setRecipient] = useState('');
  const [phone, setPhone] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [location, setLocation] = useState('');
  
  // Location picker states
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  // Load provinces on component mount
  useEffect(() => {
    loadProvinces();
  }, []);

  // Update location string when selections change
  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      let locationString = '';
      if (houseNumber.trim()) {
        locationString = `${houseNumber.trim()}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`;
      } else {
        locationString = `${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`;
      }
      setLocation(locationString);
    }
  }, [selectedProvince, selectedDistrict, selectedWard, houseNumber]);

  const loadProvinces = async () => {
    try {
      setIsLoadingProvinces(true);
      const data = await fetchProvinces();
      setProvinces(data);
    } catch (error) {
      console.error('Error loading provinces:', error);
      showErrorToast('Error', 'Failed to load provinces');
    } finally {
      setIsLoadingProvinces(false);
    }
  };

  const loadDistricts = async (provinceCode: number) => {
    try {
      setIsLoadingDistricts(true);
      const data = await fetchDistrictsByProvince(provinceCode);
      setDistricts(data.districts || []);
    } catch (error) {
      console.error('Error loading districts:', error);
      showErrorToast('Error', 'Failed to load districts');
    } finally {
      setIsLoadingDistricts(false);
    }
  };

  const loadWards = async (districtCode: number) => {
    try {
      setIsLoadingWards(true);
      const data = await fetchWardsByDistrict(districtCode);
      setWards(data.wards || []);
    } catch (error) {
      console.error('Error loading wards:', error);
      showErrorToast('Error', 'Failed to load wards');
    } finally {
      setIsLoadingWards(false);
    }
  };

  const handleProvinceSelect = (province: Province) => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setDistricts([]);
    setWards([]);
    loadDistricts(province.code);
  };

  const handleDistrictSelect = (district: District) => {
    setSelectedDistrict(district);
    setSelectedWard(null);
    setWards([]);
    loadWards(district.code);
  };

  const handleWardSelect = (ward: Ward) => {
    setSelectedWard(ward);
  };

  const validateForm = () => {
    if (!recipient.trim()) {
      showErrorToast('Validation Error', 'Please enter recipient name');
      return false;
    }
    if (!phone.trim()) {
      showErrorToast('Validation Error', 'Please enter phone number');
      return false;
    }
    if (phone.length < 10) {
      showErrorToast('Validation Error', 'Please enter a valid phone number');
      return false;
    }
    if (!selectedProvince || !selectedDistrict || !selectedWard) {
      showErrorToast('Validation Error', 'Please select complete location (Province, District, Ward)');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setIsSaving(true);
      
      const newAddress = {
        recipient: recipient.trim(),
        phone: phone.trim(),
        location: location.trim(),
      };

      const currentAddresses = userInfo?.address || [];
      const updatedAddresses = [...currentAddresses, newAddress];

      if (userInfo?._id) {
        // Create update data with address field
        const updateData = {
          address: updatedAddresses
        };

        await UserAPI.updateUser(userInfo._id, updateData as any);
        
        await refreshUserData();
        
        showSuccessToast('Success', 'Address saved successfully');
        setTimeout(() => {
          router.back();
        }, 1500);
      } else {
        showErrorToast('Error', 'User information not available');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      showErrorToast('Error', 'Failed to save address. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getLocationDisplayText = () => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      return `${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`;
    }
    return 'Select province, district, and ward';
  };

  return (
    <SafeAreaView style={addressStyles.container}>
      <View style={addressStyles.header}>
        <BackButton />
        <Text style={addressStyles.title}>Add Delivery Address</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={addressStyles.content} showsVerticalScrollIndicator={false}>
        <View style={addressStyles.formContainer}>
          {/* Recipient Field */}
          <View style={addressStyles.fieldContainer}>
            <Text style={addressStyles.label}>Recipient Name *</Text>
            <TextInput
              style={addressStyles.textInput}
              value={recipient}
              onChangeText={setRecipient}
              placeholder="Enter recipient name"
              placeholderTextColor="#999"
            />
          </View>

          {/* Phone Field */}
          <View style={addressStyles.fieldContainer}>
            <Text style={addressStyles.label}>Phone Number *</Text>
            <TextInput
              style={addressStyles.textInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>

          {/* House Number Field */}
          <View style={addressStyles.fieldContainer}>
            <Text style={addressStyles.label}>House Number / Street Address</Text>
            <TextInput
              style={addressStyles.textInput}
              value={houseNumber}
              onChangeText={setHouseNumber}
              placeholder="Enter house number, street name, etc."
              placeholderTextColor="#999"
              multiline={true}
              numberOfLines={2}
            />
          </View>

          {/* Location Field */}
          <View style={addressStyles.fieldContainer}>
            <Text style={addressStyles.label}>Location *</Text>
            <TouchableOpacity
              style={addressStyles.locationInput}
              onPress={() => setShowLocationPicker(true)}
            >
              <Text style={
                (selectedProvince && selectedDistrict && selectedWard) 
                  ? addressStyles.locationText 
                  : addressStyles.placeholderText
              }>
                {getLocationDisplayText()}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Complete Address Preview */}
          {location && (
            <View style={addressStyles.fieldContainer}>
              <Text style={addressStyles.label}>Complete Address</Text>
              <View style={[addressStyles.locationInput, { backgroundColor: '#f8f9fa' }]}>
                <Text style={addressStyles.locationText}>{location}</Text>
              </View>
            </View>
          )}

          {/* Save Button */}
          <TouchableOpacity
            style={[addressStyles.saveButton, isSaving && addressStyles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={addressStyles.saveButtonText}>Save Address</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Location Picker Modal */}
      <LocationPicker
        visible={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        provinces={provinces}
        districts={districts}
        wards={wards}
        selectedProvince={selectedProvince}
        selectedDistrict={selectedDistrict}
        selectedWard={selectedWard}
        onProvinceSelect={handleProvinceSelect}
        onDistrictSelect={handleDistrictSelect}
        onWardSelect={handleWardSelect}
        isLoadingProvinces={isLoadingProvinces}
        isLoadingDistricts={isLoadingDistricts}
        isLoadingWards={isLoadingWards}
      />
    </SafeAreaView>
  );
}
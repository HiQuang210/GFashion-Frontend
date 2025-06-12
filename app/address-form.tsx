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
import { useRouter, useLocalSearchParams } from 'expo-router';
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
import { Province, District, Ward, Address } from '@/types/address';

export default function AddAddress() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userInfo, refreshUserData } = useAuth();
  const { showSuccessToast, showErrorToast } = useToast();
  
  // Check if we're in edit mode
  const isEditMode = params.editMode === 'true';
  const editIndex = params.editIndex ? parseInt(params.editIndex as string) : null;
  const editAddressData = params.addressData ? JSON.parse(params.addressData as string) as Address : null;
  
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
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false);

  // Load provinces on component mount
  useEffect(() => {
    loadProvinces();
  }, []);

  // Pre-fill form data if in edit mode
  useEffect(() => {
    if (isEditMode && editAddressData && !isInitialDataLoaded) {
      setRecipient(editAddressData.recipient);
      setPhone(editAddressData.phone);
      parseLocationForEdit(editAddressData.location);
      setIsInitialDataLoaded(true);
    }
  }, [isEditMode, editAddressData, isInitialDataLoaded]);

  useEffect(() => {
    const shouldUpdateLocation = isEditMode ? isInitialDataLoaded : true;
    
    if (selectedProvince && selectedDistrict && selectedWard && shouldUpdateLocation) {
      const locationParts = [selectedWard.name, selectedDistrict.name, selectedProvince.name];
      if (houseNumber.trim()) {
        locationParts.unshift(houseNumber.trim());
      }
      setLocation(locationParts.join(', '));
    }
  }, [selectedProvince, selectedDistrict, selectedWard, houseNumber, isInitialDataLoaded, isEditMode]);

  const parseLocationForEdit = async (locationString: string) => {
    const parts = locationString.split(', ');
    
    if (parts.length >= 3) {
      const [provinceName, districtName, wardName] = [
        parts[parts.length - 1],
        parts[parts.length - 2], 
        parts[parts.length - 3]
      ];
      
      if (parts.length === 4) {
        setHouseNumber(parts[0]);
      }
      
      setLocation(locationString);
      
      setTimeout(() => matchLocationComponents(provinceName, districtName, wardName), 1000);
    }
  };

  const matchLocationComponents = async (provinceName: string, districtName: string, wardName: string) => {
    try {
      if (provinces.length === 0) {
        setTimeout(() => matchLocationComponents(provinceName, districtName, wardName), 500);
        return;
      }

      const matchedProvince = provinces.find(p => p.name === provinceName);
      if (!matchedProvince) return;

      setSelectedProvince(matchedProvince);
      
      const districtsData = await fetchDistrictsByProvince(matchedProvince.code);
      const districtsList = districtsData.districts || [];
      setDistricts(districtsList);
      
      const matchedDistrict = districtsList.find((d: District) => d.name === districtName);
      if (!matchedDistrict) return;

      setSelectedDistrict(matchedDistrict);
      
      const wardsData = await fetchWardsByDistrict(matchedDistrict.code);
      const wardsList = wardsData.wards || [];
      setWards(wardsList);
      
      const matchedWard = wardsList.find((w: Ward) => w.name === wardName);
      if (matchedWard) {
        setSelectedWard(matchedWard);
      }
    } catch (error) {
      console.error('Error matching location components:', error);
    }
  };

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

  const validateForm = () => {
    const validations = [
      { condition: !recipient.trim(), message: 'Please enter recipient name' },
      { condition: !phone.trim(), message: 'Please enter phone number' },
      { condition: phone.length < 10, message: 'Please enter a valid phone number' },
      { condition: !selectedProvince || !selectedDistrict || !selectedWard, 
        message: 'Please select complete location (Province, District, Ward)' },
      { condition: !location.trim(), message: 'Location is required' } // Added this validation
    ];

    for (const { condition, message } of validations) {
      if (condition) {
        showErrorToast('Validation Error', message);
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm() || !userInfo?._id) return;

    try {
      setIsSaving(true);
      
      const addressData = {
        recipient: recipient.trim(),
        phone: phone.trim(),
        location: location.trim(),
      };

      const currentAddresses = userInfo?.address || [];
      let updatedAddresses;

      if (isEditMode && editIndex !== null) {
        updatedAddresses = [...currentAddresses];
        updatedAddresses[editIndex] = addressData;
      } else {
        updatedAddresses = [...currentAddresses, addressData];
      }

      await UserAPI.updateUser(userInfo._id, { address: updatedAddresses } as any);
      await refreshUserData();
      
      const successMessage = isEditMode ? 'Address updated successfully' : 'Address saved successfully';
      showSuccessToast('Success', successMessage);
      
      setTimeout(() => router.back(), 1500);
    } catch (error) {
      console.error('Error saving address:', error);
      const errorMessage = isEditMode ? 'Failed to update address. Please try again.' : 'Failed to save address. Please try again.';
      showErrorToast('Error', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const getLocationDisplayText = () => {
    return selectedProvince && selectedDistrict && selectedWard
      ? `${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`
      : 'Select province, district, and ward';
  };

  return (
    <SafeAreaView style={addressStyles.container}>
      <View style={addressStyles.header}>
        <BackButton />
        <Text style={addressStyles.title}>
          {isEditMode ? 'Edit Delivery Address' : 'Add Delivery Address'}
        </Text>
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
              <Text style={addressStyles.saveButtonText}>
                {isEditMode ? 'Update Address' : 'Save Address'}
              </Text>
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
        onWardSelect={setSelectedWard}
        isLoadingProvinces={isLoadingProvinces}
        isLoadingDistricts={isLoadingDistricts}
        isLoadingWards={isLoadingWards}
      />
    </SafeAreaView>
  );
}
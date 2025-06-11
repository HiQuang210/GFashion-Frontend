import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addressStyles } from '@/styles/address';

// Define the types for the component props
interface Province {
  code: number;
  name: string;
}

interface District {
  code: number;
  name: string;
}

interface Ward {
  code: number;
  name: string;
}

interface LocationPickerProps {
  visible: boolean;
  onClose: () => void;
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  selectedProvince: Province | null;
  selectedDistrict: District | null;
  selectedWard: Ward | null;
  onProvinceSelect: (province: Province) => void;
  onDistrictSelect: (district: District) => void;
  onWardSelect: (ward: Ward) => void;
  isLoadingProvinces: boolean;
  isLoadingDistricts: boolean;
  isLoadingWards: boolean;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  visible,
  onClose,
  provinces,
  districts,
  wards,
  selectedProvince,
  selectedDistrict,
  selectedWard,
  onProvinceSelect,
  onDistrictSelect,
  onWardSelect,
  isLoadingProvinces,
  isLoadingDistricts,
  isLoadingWards,
}) => {
  const renderProvinceItem = ({ item }: { item: Province }) => (
    <TouchableOpacity
      style={[
        addressStyles.listItem,
        selectedProvince?.code === item.code && addressStyles.selectedItem,
      ]}
      onPress={() => onProvinceSelect(item)}
    >
      <Text
        style={[
          addressStyles.listItemText,
          selectedProvince?.code === item.code && addressStyles.selectedItemText,
        ]}
      >
        {item.name}
      </Text>
      {selectedProvince?.code === item.code && (
        <Ionicons name="checkmark" size={20} color="#704F38" />
      )}
    </TouchableOpacity>
  );

  const renderDistrictItem = ({ item }: { item: District }) => (
    <TouchableOpacity
      style={[
        addressStyles.listItem,
        selectedDistrict?.code === item.code && addressStyles.selectedItem,
      ]}
      onPress={() => onDistrictSelect(item)}
    >
      <Text
        style={[
          addressStyles.listItemText,
          selectedDistrict?.code === item.code && addressStyles.selectedItemText,
        ]}
      >
        {item.name}
      </Text>
      {selectedDistrict?.code === item.code && (
        <Ionicons name="checkmark" size={20} color="#704F38" />
      )}
    </TouchableOpacity>
  );

  const renderWardItem = ({ item }: { item: Ward }) => (
    <TouchableOpacity
      style={[
        addressStyles.listItem,
        selectedWard?.code === item.code && addressStyles.selectedItem,
      ]}
      onPress={() => {
        onWardSelect(item);
        onClose(); // Close modal after selecting ward
      }}
    >
      <Text
        style={[
          addressStyles.listItemText,
          selectedWard?.code === item.code && addressStyles.selectedItemText,
        ]}
      >
        {item.name}
      </Text>
      {selectedWard?.code === item.code && (
        <Ionicons name="checkmark" size={20} color="#704F38" />
      )}
    </TouchableOpacity>
  );

  const renderLoadingState = (text: string) => (
    <View style={addressStyles.loadingContainer}>
      <ActivityIndicator size="large" color="#704F38" />
      <Text style={addressStyles.loadingText}>{text}</Text>
    </View>
  );

  const renderEmptyState = (text: string) => (
    <View style={addressStyles.emptyContainer}>
      <Text style={addressStyles.emptyText}>{text}</Text>
    </View>
  );

  const getCurrentStep = () => {
    if (!selectedProvince) return 'province';
    if (!selectedDistrict) return 'district';
    return 'ward';
  };

  const getStepTitle = () => {
    const step = getCurrentStep();
    switch (step) {
      case 'province':
        return 'Select Province';
      case 'district':
        return 'Select District';
      case 'ward':
        return 'Select Ward';
      default:
        return 'Select Location';
    }
  };

  const getStepData = () => {
    const step = getCurrentStep();
    switch (step) {
      case 'province':
        return {
          data: provinces,
          renderItem: renderProvinceItem,
          loading: isLoadingProvinces,
          emptyText: 'No provinces available',
        };
      case 'district':
        return {
          data: districts,
          renderItem: renderDistrictItem,
          loading: isLoadingDistricts,
          emptyText: 'No districts available',
        };
      case 'ward':
        return {
          data: wards,
          renderItem: renderWardItem,
          loading: isLoadingWards,
          emptyText: 'No wards available',
        };
      default:
        return {
          data: [],
          renderItem: () => null,
          loading: false,
          emptyText: '',
        };
    }
  };

  const canGoBack = () => {
    const step = getCurrentStep();
    return step === 'district' || step === 'ward';
  };

  const handleGoBack = () => {
    const step = getCurrentStep();
    if (step === 'district') {
      onProvinceSelect(null as any); // Reset to province selection
    } else if (step === 'ward') {
      onDistrictSelect(null as any); // Reset to district selection
    }
  };

  const stepData = getStepData();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={addressStyles.container}>
        {/* Header */}
        <View style={addressStyles.header}>
          {canGoBack() && (
            <TouchableOpacity onPress={handleGoBack} style={addressStyles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
          )}
          <Text style={addressStyles.modalTitle}>{getStepTitle()}</Text>
          <TouchableOpacity onPress={onClose} style={addressStyles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Breadcrumb */}
        <View style={addressStyles.breadcrumb}>
          {selectedProvince && (
            <Text style={addressStyles.breadcrumbText}>{selectedProvince.name}</Text>
          )}
          {selectedDistrict && (
            <>
              <Text style={addressStyles.breadcrumbSeparator}> › </Text>
              <Text style={addressStyles.breadcrumbText}>{selectedDistrict.name}</Text>
            </>
          )}
          {selectedWard && (
            <>
              <Text style={addressStyles.breadcrumbSeparator}> › </Text>
              <Text style={addressStyles.breadcrumbText}>{selectedWard.name}</Text>
            </>
          )}
        </View>

        {/* Content */}
        <View style={addressStyles.content}>
          {stepData.loading ? (
            renderLoadingState(`Loading ${getCurrentStep()}s...`)
          ) : stepData.data.length > 0 ? (
            <FlatList
              data={stepData.data}
              renderItem={stepData.renderItem}
              keyExtractor={(item: any) => item.code.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={addressStyles.listContainer}
            />
          ) : (
            renderEmptyState(stepData.emptyText)
          )}
        </View>
      </View>
    </Modal>
  );
};

export default LocationPicker;
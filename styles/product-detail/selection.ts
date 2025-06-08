import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  selectionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  selectedColorText: {
    color: '#704F38',
    fontWeight: '400',
  },
  selectedSizeText: {
    color: '#704F38',
    fontWeight: '400',
  },
  
  // Color Selection Styles
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOptionContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  colorButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  colorButtonSelected: {
    borderColor: '#704F38',
  },
  colorButtonDisabled: {
    opacity: 0.5,
  },
  whiteBorder: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  soldOutOverlay: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 2,
  },
  
  // Size Selection Styles
  sizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sizeOptionContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  sizeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 4,
  },
  sizeButtonActive: {
    backgroundColor: '#704F38',
    borderColor: '#704F38',
  },
  sizeButtonDisabled: {
    backgroundColor: '#F0F0F0',
    borderColor: '#E0E0E0',
    opacity: 0.5,
  },
  sizeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  sizeTextActive: {
    color: '#FFFFFF',
  },
  sizeTextDisabled: {
    color: '#CCCCCC',
  },
  
  // Stock Text Styles
  stockText: {
    fontSize: 10,
    color: '#666666',
    textAlign: 'center',
  },
  stockTextEmpty: {
    color: '#FF4444',
  },
});
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // Fixed swipe container styles
  swipeContainer: {
    position: 'relative',
    marginVertical: 8,
    marginHorizontal: 0,
    overflow: 'hidden', // Add this to clip the delete area
  },
  
  deleteArea: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 80,
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0, // Changed from 1 to 0 - should be behind the main item
  },
  
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },

  // Updated container styles
  container: {
    backgroundColor: '#fff',
    borderRadius: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    zIndex: 1, // Add this to ensure it's above the delete area
    position: 'relative', // Add this for z-index to work properly
  },
  
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingHorizontal: 20,
    gap: 12,
    minHeight: 120,
  },
  
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  
  productImage: {
    width: '100%',
    height: '100%',
  },
  
  productDetails: {
    flex: 1,
    gap: 6,
  },
  
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    lineHeight: 20,
  },
  
  productVariant: {
    fontSize: 12,
    color: '#797979',
  },
  
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#704F38',
  },
  
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  decrementButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  
  incrementButton: {
    backgroundColor: '#704F38',
  },
  
  disabledButton: {
    opacity: 0.5,
  },
  
  decrementButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  
  incrementButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },
  
  quantityText: {
    fontSize: 16,
    fontWeight: '500',
    minWidth: 20,
    textAlign: 'center',
  },
  
  errorContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 0, 
    marginVertical: 8,
    padding: 20,
    borderRadius: 0,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  
  errorText: {
    fontSize: 14,
    color: '#999',
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  
  modalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  
  removeButton: {
    backgroundColor: '#dc3545',
  },
  
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  
  removeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
  },
  
  loadingText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  
  swipeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    backgroundColor: 'transparent',
  },
});
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: '#888888',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginVertical: 2,
  },
  stockText: {
    fontSize: 12,
    color: '#666666',
  },
  outOfStockMessage: {
    color: "#ff3b30",
    textAlign: "left",   
    fontWeight: "500",
    fontSize: 14,        
    lineHeight: 18,
  },
  addToCartButton: {
    backgroundColor: '#704F38',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  addToCartButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  addToCartTextDisabled: {
    color: '#888888',
  },
});
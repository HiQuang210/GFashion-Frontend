import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  productInfo: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  productType: {
    fontSize: 16,
    color: '#888888',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#888888',
    marginLeft: 4,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  producerText: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 12,
  },
  materialText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  soldText: {
    fontSize: 14,
    color: '#888888',
  },
  detailsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 8,
  },
  readMoreText: {
    fontSize: 14,
    color: '#704F38',
    fontWeight: '500',
  },
  typeAndRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nameAndSoldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  descriptionLabel: {
    marginTop: 8,
    marginBottom: 4,
  },
});
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mainImageContainer: {
    height: 400,
    backgroundColor: '#F5F5F5',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailSection: {
    paddingVertical: 16,
  },
  thumbnailList: {
    paddingHorizontal: 16,
  },
  thumbnailContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  activeThumbnail: {
    borderColor: '#704F38',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  moreImagesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
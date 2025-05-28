import { StyleSheet } from "react-native";

export const productDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    position: "relative",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Inter",
    color: "#704F38",
  },
  errorText: {
    fontSize: 18,
    fontFamily: "Inter",
    color: "#d32f2f",
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: 14,
    fontFamily: "Inter",
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  headerContainer: {
    position: "absolute",
    zIndex: 10,
    top: 40,
    width: "100%",
  },
  imageContainer: {
    borderBottomWidth: 1,
    borderColor: "#ededed",
    height: 401,
  },
  carouselImage: {
    width: "100%",
    height: 400,
  },
  contentContainer: {
    marginTop: 20,
    marginHorizontal: 10,
  },
  productInfoSection: {
    marginBottom: 10,
  },
  priceRatingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: {
    fontSize: 30,
    fontFamily: "Inter",
    fontWeight: "500",
    color: "#704F38",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    // This will use the imported text.gray_text style
  },
  productName: {
    marginTop: 5,
    fontSize: 19,
    fontFamily: "Inter",
  },
  detailsSection: {
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: "Inter",
    marginBottom: 7,
  },
  materialText: {
    fontFamily: "Inter",
    color: "#797979",
  },
  descriptionText: {
    fontFamily: "Inter",
    color: "#797979",
  },
  divider: {
    width: "100%",
    borderWidth: 0.75,
    borderColor: "#ededed",
  },
  selectionSection: {
    marginTop: 10,
  },
  sizeSection: {
    marginBottom: 15,
  },
  colorSection: {
    marginTop: 15,
  },
  optionsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  sizeButton: {
    width: 40,
    borderWidth: 1,
    borderColor: "#ededed",
    borderRadius: 10,
  },
  sizeButtonActive: {
    backgroundColor: "#704F38",
  },
  sizeText: {
    textAlign: "center",
    paddingVertical: 7,
  },
  sizeTextActive: {
    color: "#FFF",
  },
  sizeTextDisabled: {
    color: "#ccc",
  },
  colorButton: {
    width: 35,
    height: 35,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  colorButtonSelected: {
    width: 20,
    height: 20,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
});
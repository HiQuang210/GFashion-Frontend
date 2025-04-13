export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const translateColor = (color: string): string => {
  const colorMap: Record<string, string> = {
    đỏ: "red",
    xanh: "green",
    "xanh dương": "blue",
    "xanh lá": "green",
    vàng: "yellow",
    đen: "black",
    trắng: "white",
    xám: "gray",
    hồng: "pink",
    cam: "orange",
    tím: "purple",
    nâu: "brown",
  };

  const normalized = color.toLowerCase().trim();
  return colorMap[normalized] || color;
};

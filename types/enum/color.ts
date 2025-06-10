export enum ProductColors {
  // Basic Colors
  RED = '#FF0000',
  BLUE = '#0000FF',
  GREEN = '#008000',
  YELLOW = '#FFFF00',
  ORANGE = '#FFA500',
  PURPLE = '#800080',
  PINK = '#FFC0CB',
  BROWN = '#A52A2A',
  BLACK = '#000000',
  WHITE = '#FFFFFF',
  GRAY = '#808080',
  GREY = '#808080',

  // Extended Basic Colors
  NAVY = '#000080',
  MAROON = '#800000',
  OLIVE = '#808000',
  LIME = '#00FF00',
  AQUA = '#00FFFF',
  TEAL = '#008080',
  SILVER = '#C0C0C0',
  GOLD = '#FFD700',

  // Light Colors
  LIGHT_BLUE = '#ADD8E6',
  LIGHT_GREEN = '#90EE90',
  LIGHT_PINK = '#FFB6C1',
  LIGHT_GRAY = '#D3D3D3',
  LIGHT_GREY = '#D3D3D3',
  LIGHT_YELLOW = '#FFFFE0',
  LIGHT_PURPLE = '#DDA0DD',
  LIGHT_ORANGE = '#FFE4B5',
  LIGHT_BROWN = '#CD853F',
  LIGHT_RED = '#FF6B6B',

  // Dark Colors
  DARK_BLUE = '#00008B',
  DARK_GREEN = '#006400',
  DARK_RED = '#8B0000',
  DARK_ORANGE = '#FF8C00',
  DARK_PURPLE = '#4B0082',
  DARK_GRAY = '#696969',
  DARK_GREY = '#696969',
  DARK_BROWN = '#654321',
  DARK_PINK = '#C71585',
  DARK_YELLOW = '#B8860B',

  // Neutral & Earth Tones
  BEIGE = '#F5F5DC',
  TAN = '#D2B48C',
  KHAKI = '#F0E68C',
  CREAM = '#F5F5DC',
  IVORY = '#FFFFF0',
  PEARL = '#F8F8FF',
  WHEAT = '#F5DEB3',
  LINEN = '#FAF0E6',
  SNOW = '#FFFAFA',
  OFF_WHITE = '#FAF0E6',
  EGGSHELL = '#F0EAD6',
  VANILLA = '#F3E5AB',
  SAND = '#C2B280',
  MUSHROOM = '#C7B377',

  // Vibrant Colors
  CORAL = '#FF7F50',
  SALMON = '#FA8072',
  CRIMSON = '#DC143C',
  MAGENTA = '#FF00FF',
  VIOLET = '#EE82EE',
  INDIGO = '#4B0082',
  TURQUOISE = '#40E0D0',
  CYAN = '#00FFFF',
  MINT = '#98FB98',
  LAVENDER = '#E6E6FA',
  PLUM = '#DDA0DD',

  // Metallic Colors
  COPPER = '#B87333',
  BRONZE = '#CD7F32',
  BRASS = '#B5A642',
  PEWTER = '#96A8A1',
  PLATINUM = '#E5E4E2',
  CHROME = '#C0C0C0',
  TITANIUM = '#878681',

  // Wood & Natural Tones
  CHOCOLATE = '#D2691E',
  SIENNA = '#A0522D',
  SADDLE = '#8B4513',
  RUST = '#B7410E',
  MAHOGANY = '#C04000',
  WALNUT = '#773F1A',
  OAK = '#806517',
  PINE = '#01796F',
  CEDAR = '#A0522D',
  BAMBOO = '#E3C565',

  // Fashion Colors
  ROSE_GOLD = '#E8B4B8',
  BLUSH = '#DE5D83',
  MAUVE = '#E0B0FF',
  TAUPE = '#483C32',
  SAGE = '#9CAF88',
  SEAFOAM = '#71EEB8',
  DUSTY_ROSE = '#DCAE96',
  CHAMPAGNE = '#F7E7CE',
  BURGUNDY = '#800020',
  WINE = '#722F37',
  FOREST = '#355E3B',
  SLATE = '#708090',
  CHARCOAL = '#36454F',
  STONE = '#8D8680',

  // Modern Colors
  MINT_GREEN = '#98FB98',
  POWDER_BLUE = '#B0E0E6',
  PEACH = '#FFCBA4',
  APRICOT = '#FBCEB1',
  LILAC = '#B19CD9',
  PERIWINKLE = '#CCCCFF',
  CERULEAN = '#007BA7',
  VERMILLION = '#E34234',
  CHARTREUSE = '#7FFF00',
  FUCHSIA = '#FF00FF',

  // Pastel Colors
  PASTEL_PINK = '#FFD1DC',
  PASTEL_BLUE = '#AEC6CF',
  PASTEL_GREEN = '#77DD77',
  PASTEL_YELLOW = '#FDFD96',
  PASTEL_PURPLE = '#B39EB5',
  PASTEL_ORANGE = '#FFB347',

  // Jewel Tones
  EMERALD = '#50C878',
  SAPPHIRE = '#0F52BA',
  RUBY = '#E0115F',
  TOPAZ = '#FFC87C',
  AMETHYST = '#9966CC',
  GARNET = '#733635',
  OPAL = '#A8C3BC',
  JADE = '#00A86B',
}

// Color mapping function that handles various text formats
export const getColorFromString = (colorName: string): string => {
  if (!colorName) return ProductColors.BROWN; // Default fallback


  const normalizedColor = colorName
    .toLowerCase()
    .replace(/[\s\-_]+/g, '')
    .trim();

  const colorMap: { [key: string]: string } = {};

  Object.entries(ProductColors).forEach(([key, value]) => {
    const normalizedKey = key.toLowerCase().replace(/_/g, '');
    colorMap[normalizedKey] = value;
  });

  const additionalMappings: { [key: string]: string } = {
    'lightbrown': ProductColors.LIGHT_BROWN,
    'darkbrown': ProductColors.DARK_BROWN,
    'lightblue': ProductColors.LIGHT_BLUE,
    'darkblue': ProductColors.DARK_BLUE,
    'lightgreen': ProductColors.LIGHT_GREEN,
    'darkgreen': ProductColors.DARK_GREEN,
    'lightpink': ProductColors.LIGHT_PINK,
    'darkpink': ProductColors.DARK_PINK,
    'lightgray': ProductColors.LIGHT_GRAY,
    'darkgray': ProductColors.DARK_GRAY,
    'lightgrey': ProductColors.LIGHT_GREY,
    'darkgrey': ProductColors.DARK_GREY,
    
    'nude': ProductColors.BEIGE,
    'camel': ProductColors.TAN,
    'cognac': ProductColors.SADDLE,
    'espresso': ProductColors.DARK_BROWN,
    'mocha': ProductColors.CHOCOLATE,
    'latte': ProductColors.CREAM,
    'cappuccino': ProductColors.TAN,
    'caramel': ProductColors.COPPER,
    'honey': ProductColors.GOLD,
    'mustard': ProductColors.DARK_YELLOW,
    'olive green': ProductColors.OLIVE,
    'olivegreen': ProductColors.OLIVE,
    'forest green': ProductColors.FOREST,
    'forestgreen': ProductColors.FOREST,
    'navy blue': ProductColors.NAVY,
    'navyblue': ProductColors.NAVY,
    'royal blue': ProductColors.BLUE,
    'royalblue': ProductColors.BLUE,
    'sky blue': ProductColors.LIGHT_BLUE,
    'skyblue': ProductColors.LIGHT_BLUE,
    'baby blue': ProductColors.POWDER_BLUE,
    'babyblue': ProductColors.POWDER_BLUE,
    'hot pink': ProductColors.PINK,
    'hotpink': ProductColors.PINK,
    'baby pink': ProductColors.PASTEL_PINK,
    'babypink': ProductColors.PASTEL_PINK,
    'rose': ProductColors.DUSTY_ROSE,
    'rosegold': ProductColors.ROSE_GOLD,
    
    'denim': ProductColors.BLUE,
    'indigo': ProductColors.INDIGO,
    'stonewash': ProductColors.LIGHT_BLUE,
    'stonewashed': ProductColors.LIGHT_BLUE,
    
    'offwhite': ProductColors.OFF_WHITE,
    'eggshell': ProductColors.EGGSHELL,
    'mintgreen': ProductColors.MINT_GREEN,
    'seafoamgreen': ProductColors.SEAFOAM,
    'powderblue': ProductColors.POWDER_BLUE,
    'dustyrose': ProductColors.DUSTY_ROSE,
  };

  if (colorMap[normalizedColor]) {
    return colorMap[normalizedColor];
  }

  if (additionalMappings[normalizedColor]) {
    return additionalMappings[normalizedColor];
  }

  for (const [key, value] of Object.entries(colorMap)) {
    if (normalizedColor.includes(key) || key.includes(normalizedColor)) {
      return value;
    }
  }

  return ProductColors.BROWN;
};

export const getColorNameFromHex = (hexValue: string): string => {
  const entry = Object.entries(ProductColors).find(([_, value]) => value === hexValue);
  return entry ? entry[0].replace(/_/g, ' ').toLowerCase() : 'unknown';
};

export const isLightColor = (hexColor: string): boolean => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128;
};
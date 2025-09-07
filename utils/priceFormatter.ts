/**
 * Formats price in Turkish Lira (TRY)
 * @param amountKurus - Price in kuruş (1 TL = 100 kuruş)
 * @returns Formatted price string with TRY symbol
 */
export const formatPrice = (amountKurus: number): string => {
  // Convert kuruş to TL (divide by 100)
  const amountTL = amountKurus / 100;
  
  // Format with Turkish locale
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amountTL);
};

/**
 * Converts TL to kuruş
 * @param amountTL - Price in Turkish Lira
 * @returns Price in kuruş
 */
export const tlToKurus = (amountTL: number): number => {
  return Math.round(amountTL * 100);
};

/**
 * Converts kuruş to TL
 * @param amountKurus - Price in kuruş
 * @returns Price in Turkish Lira
 */
export const kurusToTL = (amountKurus: number): number => {
  return amountKurus / 100;
};

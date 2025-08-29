  // Format currency in Brazilian format by manually placing commas and periods
  export const formatCurrency = (value: number) => {
    // Convert to string and remove any existing dots
    let valueStr = value.toString().replace('.', '');
    
    // If the string is too short, pad with zeros at the beginning
    if (valueStr.length < 3) {
      valueStr = valueStr.padStart(3, '0');
    }
    
    // Get the last two digits for cents
    const cents = valueStr.slice(-2);
    
    // Get the rest of the digits (excluding cents)
    let intPart = valueStr.slice(0, -2);
    
    // Add thousand separators (periods)
    if (intPart.length > 3) {
      // Start from the end and work backwards adding periods every 3 digits
      let formattedIntPart = '';
      for (let i = intPart.length - 1, count = 0; i >= 0; i--, count++) {
        if (count > 0 && count % 3 === 0) {
          formattedIntPart = '.' + formattedIntPart;
        }
        formattedIntPart = intPart[i] + formattedIntPart;
      }
      intPart = formattedIntPart;
    }
    
    // Combine with comma for decimal separator
    return `${intPart},${cents}`;
  };
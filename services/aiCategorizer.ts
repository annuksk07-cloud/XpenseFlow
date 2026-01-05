// A simple, lightweight AI engine for expense categorization based on keywords.

const categoryKeywords: Record<string, string[]> = {
  Food: [
    'food', 'restaurant', 'cafe', 'coffee', 'starbucks', 'mcdonalds', 'groceries', 
    'lunch', 'dinner', 'breakfast', 'pizza', 'sushi', 'taco', 'delivery', 'bakery', 
    'supermarket', 'kroger', 'whole foods', 'doordash', 'uber eats', 'grubhub',
    'instacart', 'chipotle'
  ],
  Transport: [
    'transport', 'uber', 'lyft', 'taxi', 'cab', 'bus', 'train', 'metro', 'subway',
    'gas', 'fuel', 'petrol', 'parking', 'flight', 'airline', 'scooter', 'lime',
    'bird', 'amtrak', 'shell', 'chevron', 'exxon', 'mobil', 'bp', 'sunoco'
  ],
  Shopping: [
    'shopping', 'amazon', 'walmart', 'target', 'costco', 'best buy', 'clothes',
    'shoes', 'electronics', 'mall', 'online store', 'fashion', 'apparel', 'ikea',
    'home depot', 'etsy', 'ebay', 'apple', 'microsoft store'
  ],
  Bills: [
    'bills', 'rent', 'mortgage', 'electricity', 'water', 'internet', 'phone', 
    'utility', 'insurance', 'loan', 'credit card', 'verizon', 'at&t', 'comcast',
    'xfinity', 'spectrum', 'geico', 'progressive', 'state farm'
  ],
  Entertainment: [
    'entertainment', 'movie', 'cinema', 'concert', 'netflix', 'spotify', 'hulu',
    'disney+', 'tickets', 'game', 'bar', 'club', 'event', 'streaming', 'youtube premium'
  ],
  Health: [
    'health', 'pharmacy', 'doctor', 'dentist', 'hospital', 'medicine', 'gym',
    'fitness', 'cvs', 'walgreens', 'healthcare', 'rite aid'
  ],
  Salary: [
    'salary', 'paycheck', 'bonus', 'income', 'deposit', 'direct deposit'
  ],
  Investment: [
    'investment', 'stocks', 'crypto', 'coinbase', 'robinhood', 'shares', 'etf'
  ],
};

export const classifyExpense = (title: string): string => {
  const lowerCaseTitle = title.toLowerCase();
  for (const category in categoryKeywords) {
    for (const keyword of categoryKeywords[category]) {
      if (lowerCaseTitle.includes(keyword)) {
        return category;
      }
    }
  }
  return 'General'; // Default category
};
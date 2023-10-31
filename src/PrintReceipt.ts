import {loadAllItems, loadPromotions} from './Dependencies'


export type Tag = {
  barcode: string;
  quantity: number;
}

export type Quantity = {
  value: number;
  quantifier: string;
}

export type ReceiptItem = {
  name: string;
  quantity: Quantity;
  unitPrice: number;
  subtotal: number;
  discountedPrice?: number;
}

export function parseTags(tags: string[]): Tag[] {
  const initialTags = parseQuantity(tags);
  return initialTags.reduce((accumulatedTags: Tag[], currentTag: Tag) => {
    const existingTag = accumulatedTags.find(tag => tag.barcode === currentTag.barcode);
    if (existingTag) {
      existingTag.quantity += currentTag.quantity;
    } else {
      accumulatedTags.push(currentTag);
    }
    return accumulatedTags;
  }, []);
}

export function parseQuantity(tags: string[]): Tag[]  {
  return tags.map(tag => {
    const [barcode, quantity] = tag.split('-');
    return {
      barcode: barcode,
      quantity: quantity ? parseFloat(quantity) : 1
    };
});
}




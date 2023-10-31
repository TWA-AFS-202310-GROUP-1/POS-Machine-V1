import {loadAllItems, loadPromotions} from './Dependencies'

export interface Quantity{
  value: number;
  quantifier: string
}

export interface ReceiptItem{
  name: string;
  quantity: Quantity;
  unitPrice: number;
  subtotal: number;
  discountedPrice: number
}

export interface Tag{
  barcode: string;
  quantity: number
}

export class MultiplicationTable {

  public printReceipt(tags: string[]): string {
  //   return `***<store earning no money>Receipt ***
  // Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
  // Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
  // Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
  // ----------------------
  // Total：58.50(yuan)
  // Discounted prices：7.50(yuan)
  // **********************`




  }



  private parseTags(tags: string[]): Tag[] {
    const barcodeMap: Map<string, number> = new Map();
  
    for (const tag of tags) {
      const [barcode, quantityStr] = tag.split('-');
      const quantity = parseInt(quantityStr) || 1;
      const count = barcodeMap.get(barcode) || 0;
      barcodeMap.set(barcode, count + quantity);
    }
  
    const tagList: Tag[] = [];
  
    barcodeMap.forEach((quantity, barcode) => {
      const tag: Tag = { barcode, quantity };
      tagList.push(tag);
    });
  
    return tagList;
  }

  private parseQuantity(tag: string): number {
    const delimiter = '-';
    const parts = tag.split(delimiter);
  
    if (parts.length !== 2) {
      throw new Error('Invalid format');
    }
  
    const numberString = parts[1];
    const number = Number(numberString);
  
    if (isNaN(number)) {
      throw new Error('Invalid number');
    }
  
    return number;
  }
  
  private generateReceiptItems(tags: Tag[]): ReceiptItem[]{
    const receiptlist: ReceiptItem[] = [];
    const items = loadAllItems();
    const promotions = loadPromotions();
    for (const tag of tags) {
      const tagBarcode = tag.barcode;
      const item = items.find((item) => item.barcode === tagBarcode);
      const promotion =promotions.find((promotion) => tagBarcode in promotion.barcodes);
      const tagquantifier = promotion?.type;
      const tagName = item?.name

      const receiptitem: ReceiptItem{
        name: tagName,
        quantity: {
          value: tag.number,
          quantifier: tagQuantifier
        }
        unitPrice: number;
        subtotal: number;
        discountedPrice: number
      }

    }

  }

  private calculateDiscountedSubtotal(quantity: number, price: number, promotionType: string|undefined): number{
    if(promotionType == 'BUY_TWO_GET_ONE_FREE'){
      const DiscountedNumber = Math.floor(quantity / 3);
      const DiscountedSubtotal = DiscountedNumber * price;
      return DiscountedSubtotal
    }else return 0
  }

  

}
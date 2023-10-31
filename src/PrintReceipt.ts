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
  discountedPrice: number;
}

export function parseTags(tags: string[]): Tag[] {
  const initialTags = parseQuantity(tags)
  return initialTags.reduce((accumulatedTags: Tag[], currentTag: Tag) => {
    const existingTag = accumulatedTags.find(tag => tag.barcode === currentTag.barcode)
    if (existingTag) {
      existingTag.quantity += currentTag.quantity
    } else {
      accumulatedTags.push(currentTag)
    }
    return accumulatedTags
  }, [])
}

export function parseQuantity(tags: string[]): Tag[]  {
  return tags.map(tag => {
    const [barcode, quantity] = tag.split('-')
    return {
      barcode: barcode,
      quantity: quantity ? parseFloat(quantity) : 1
    }
  })
}

export function generateReceiptItems(parsedTags: Tag[]): ReceiptItem[] {
  const allItems = loadAllItems()
  const promotions = loadPromotions()

  return parsedTags.map(tag => {
    const item = allItems.find(i => i.barcode === tag.barcode)
    if (!item) throw new Error('Item not found')

    const promo = promotions.find(p => p.barcodes.includes(tag.barcode))
    let discountedPrice = 0
    let subtotal = tag.quantity * item.price

    if (promo?.type === 'BUY_TWO_GET_ONE_FREE') {
      discountedPrice = Math.floor(tag.quantity / 3) * item.price
      subtotal -= discountedPrice
    }

    return {
      name: item.name,
      quantity: {
        value: tag.quantity,
        quantifier: item.unit
      },
      unitPrice: item.price,
      subtotal: subtotal,
      discountedPrice: discountedPrice
    }
  })
}

export function renderReceipt(receiptItems: ReceiptItem[]): string {
  let receipt = "***<store earning no money>Receipt ***\n"
  let total = 0
  let totalDiscount = 0

  receiptItems.forEach(item => {
    receipt += `Name：${item.name}，Quantity：${item.quantity.value} ${item.quantity.quantifier}，Unit：${item.unitPrice.toFixed(2)}(yuan)，Subtotal：${item.subtotal.toFixed(2)}(yuan)\n`
    total += item.subtotal
    totalDiscount += item.discountedPrice
  })

  receipt += "----------------------\n"
  receipt += `Total：${total.toFixed(2)}(yuan)\n`
  receipt += `Discounted prices：${totalDiscount.toFixed(2)}(yuan)\n`
  receipt += "**********************"

  return receipt
}





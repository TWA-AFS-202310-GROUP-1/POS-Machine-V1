import {loadAllItems, loadPromotions} from './Dependencies'
interface Quantity {
  value:number;
  quantifier:string;
}
interface ReceiptItem {
  name:string;
  quantity:Quantity;
  unitPrice:number;
  subtotal:number;
  discountedPrice:number;
}
interface Tag {
  barcode:string;
  quantity:number;
}
export function printReceipt(tags: string[]): string {
  const parsedTags:Tag[] = parseTags(tags)
  const itemBarcodeList:any[] = loadAllItems()
  const barcodeList:string[] = itemBarcodeList.map(x=>x.barcode)

  for(const tag of tags){
    if(!checkIfItemVaild(barcodeList,tag)){
      return 'Invalid'
    }
  }

  const receiptItems:ReceiptItem[] = generateReceiptItems(parsedTags)
  return formatReceipt(receiptItems)
}
export function parseTags(tags: string[]): Tag[] {
  const parsedTags: Tag[] = []

  for (const tag of tags) {
    const parts = tag.split('-')
    const barcode = parts[0]
    const existingTag = parsedTags.find((t) => t.barcode === barcode)
    if (existingTag) {
      existingTag.quantity += parts[1] ? parseFloat(parts[1]) : 1
    } else {
      const quantity = parts[1] ? parseFloat(parts[1]) : 1
      parsedTags.push({ barcode, quantity })
    }

  }
  return parsedTags
}

function checkIfItemVaild(barcodeList:string[],tag:string):boolean{
  const parts = tag.split('-')
  const barcode = parts[0]
  return barcodeList.includes(barcode)
}

export function generateReceiptItems(parsedTags:Tag[]):ReceiptItem[]{
  const itemData = loadAllItems()
  const discountItemList:string[]= loadPromotions()[0].barcodes
  const barcodePromotionList:string[] = discountItemList

  const itemMap: Map<string, any> = new Map()
  itemData.forEach((item) => {
    itemMap.set(item.barcode, item)
  })

  const receiptItems: ReceiptItem[] = []

  for (const parsedTag of parsedTags) {
    const itemInfo = itemMap.get(parsedTag.barcode)
    if (itemInfo) {
      const discountItem = checkIfItemPromotion(barcodePromotionList, parsedTag.barcode) ? Math.floor(parsedTag.quantity / 3) : 0
      const discountedPrice = discountItem * itemInfo.price
      const quantity = {
        value: parsedTag.quantity,
        quantifier: itemInfo.unit + 's',
      }

      receiptItems.push({
        name: itemInfo.name,
        quantity: quantity,
        unitPrice: itemInfo.price,
        subtotal: parsedTag.quantity * itemInfo.price - discountedPrice,
        discountedPrice: discountedPrice, // 初始化为 0，稍后可以根据促销信息更新
      })
    }
  }
  return receiptItems
}

function checkIfItemPromotion(promotionBarcodes: string[], tag: string): boolean {
  const barcode = tag.split('-')[0]
  return promotionBarcodes.includes(barcode)
}

function formatReceipt(receiptItems: ReceiptItem[]): string {
  let total = 0
  let discountedTotal = 0
  let receiptText = '***<store earning no money>Receipt ***\n'

  for (const item of receiptItems) {
    receiptText += `Name: ${item.name}, Quantity: ${item.quantity.value} ${item.quantity.quantifier}, Unit: ${item.unitPrice.toFixed(2)}(yuan), Subtotal: ${(item.subtotal).toFixed(2)}(yuan)\n`
    total += item.subtotal
    discountedTotal += item.discountedPrice
  }

  receiptText += '----------------------\n'
  receiptText += `Total: ${(total).toFixed(2)}(yuan)\n`
  receiptText += `Discounted prices: ${(discountedTotal).toFixed(2)}(yuan)\n`
  receiptText += '**********************'

  return receiptText
}

import {loadAllItems, loadPromotions} from './Dependencies'

interface Quantity {
  value: number;
  quantifier: string;
}

interface ReceiptItem {
  name: string;
  quantity: Quantity;
  unitPrice: number;
  subtotal: number;
  discountedPrice: number;
}

interface Tag{
  barcode: string;
  quantity: number;
}

export function printReceipt(tags: string[]): string {
  const parsedTags = parseTags(tags)
  const aggregateRes = aggregateTags(parsedTags)
  const receiptItems = generateReceiptItems(aggregateRes)
  if(receiptItems === null){
    return ''
  }

  const printRes = renderReceipt(receiptItems)
  return printRes
}

function parseTags(tags: string[]): Tag[] {
  const tagList: Tag[] = []
  tags.map((item) => {
    const barcode = item.split('-')[0]
    const quantity = item.split('-')[1]
    tagList.push({
      barcode: barcode,
      quantity: quantity ? Number(quantity) : 1
    })
  })
  return tagList
}

function aggregateTags(tags: Tag[]): Tag[]{
  const tagsMap: Map<string, number>= new Map<string, number>()
  const parseTags: Tag[] = []
  for(const tag of tags){
    if(tagsMap.has(tag.barcode)){
      tagsMap.set(tag.barcode, tagsMap.get(tag.barcode)! + tag.quantity)
    }else{
      tagsMap.set(tag.barcode, tag.quantity)
    }
  }
  for (const entry of tagsMap.entries()) {
    parseTags.push({
      barcode: entry[0],
      quantity: entry[1]
    })
  }

  return parseTags
}

function generateReceiptItems(parsedTags: Tag[]): ReceiptItem[] | null{
  const receiptItemList: ReceiptItem[] = []
  const items = loadAllItems()
  const promotion = loadPromotions()[0]
  const barcodeList = Array.from(items, x => x.barcode)
  for(const tag of parsedTags){
    if(barcodeList.indexOf(tag.barcode) === -1){
      return null
    }
    const index = barcodeList.indexOf(tag.barcode)
    const name = items[index].name
    const quantity = parseQuantity(tag.quantity, items[index].unit)
    const unitPrice = (items[index].price)
    let subtotal = 0
    let discountedPrice = 0
    if(promotion.barcodes.indexOf(tag.barcode)){
      subtotal = calculateDiscountedSubtotal(tag.quantity, unitPrice)[0]
      discountedPrice = calculateDiscountedSubtotal(tag.quantity, unitPrice)[1]
    }else{
      subtotal = tag.quantity * unitPrice
      discountedPrice = 0
    }
    receiptItemList.push({
      name: name,
      quantity: quantity,
      unitPrice: unitPrice,
      subtotal: subtotal,
      discountedPrice: discountedPrice
    })
  }

  return receiptItemList
}

function parseQuantity(quantity: number, quantifier: string): Quantity{
  const q: Quantity = {
    value: quantity,
    quantifier: quantifier
  }

  return q
}

function calculateDiscountedSubtotal(quantity: number, unitPrice: number): number[]{
  const numOfFree = Math.floor(Math.floor(quantity) / 3)
  return [(quantity - numOfFree) * unitPrice, numOfFree * unitPrice]
}

function calculateTotal(receiptItems: ReceiptItem[]): number[]{
  let total = 0
  let discountedPrice = 0
  for(const item of receiptItems){
    total += item.subtotal
    discountedPrice += item.discountedPrice
  }

  return [total, discountedPrice]
}

function renderReceipt(receiptItems: ReceiptItem[]): string{
  const header = `***<store earning no money>Receipt ***`
  const footer = `**********************`
  const body = receiptItems.map(item => `Name: ${item.name}, Quantity: ${item.quantity.value} ${item.quantity.quantifier}s, Unit: ${(item.unitPrice).toFixed(2)}(yuan), Subtotal: ${(item.subtotal).toFixed(2)}(yuan)`).join('\n')

  const total = calculateTotal(receiptItems)

  const middle = `----------------------`

  const totalPrint = `Total: ${total[0].toFixed(2)}(yuan)
Discounted prices: ${total[1].toFixed(2)}(yuan)`

  return header +'\n' + body + '\n' + middle + '\n' + totalPrint + '\n' + footer
}

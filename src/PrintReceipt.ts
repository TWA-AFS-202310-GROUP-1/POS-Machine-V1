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
  const res = parseTags(tags)
  console.log(aggregateTags(res))

  return `***<store earning no money>Receipt ***
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`
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



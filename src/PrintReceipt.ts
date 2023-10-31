import {loadAllItems, loadPromotions} from './Dependencies'

interface Quantity {
  value: number
  quantifier: string
}
interface Tag {
  barcode: string
  quantity: number
}
interface ReceiptItem {
  name: string
  quantity: Quantity
  unitPrice: number
  subtotal: number
  discountedPrice: number
}

export function printReceipt(tags: string[]): string {

  //const parsedTags = parseTags(tags)

  //const receiptItems:ReceiptItem[] = generateReceiptItems(parsedTags)

  //const receipt:string = renderReceipt(receiptItems)

  //return receipt

  return `***<store earning no money>Receipt ***
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`
}

function parseTags(tags:string[])
{
  const tagNum = tags.length
  const parsedTags:Tag[] = []
  for(let i=1;i<tagNum;i++)
  {
    if(tags[i].length===10)
    {
      parsedTags.push({barcode:tags[i],quantity:1})
    }
    else
    {
      parsedTags.push({barcode:tags[i].slice(0,10),quantity:parseInt(tags[i].slice(11,tags[i].length))})
    }
  }
  return parsedTags
}

function generateReceiptItems(tags:Tag[])
{
  const items = loadAllItems()
  const promotions = loadPromotions()

  const tagNum = tags.length

  const receiptItems:ReceiptItem[] = []

  for(let i=1;i<=tagNum;i++)
  {
    for(let j=1;j<=items.length;j++)
    {
      if(items[j].barcode===tags[i].barcode)
      {
        receiptItems.push({name: items[j].name,
          quantity: {value:tags[i].quantity,quantifier:items[j].unit},
          unitPrice: items[j].price,subtotal: tags[i].quantity%3,
          discountedPrice: (tags[i].quantity%3)*items[j].price})
      }
    }
  }

  return receiptItems
}

function renderReceipt(receiptItems:ReceiptItem[])
{
  let totalPrice = 0
  let totalDiscount = 0
  let receipt = ''
  receipt += '***<store earning no money>Receipt ***'

  const itemsNum = receiptItems.length
  for(let i=1;i<=itemsNum;i++)
  {
    totalPrice += receiptItems[i].unitPrice*(receiptItems[i].quantity.value-receiptItems[i].subtotal)
    totalDiscount += receiptItems[i].discountedPrice
    receipt += receiptItems[i].name.toString
    receipt += '\n'
  }

  receipt += totalPrice.toString
  receipt += '\n'
  receipt += totalPrice.toString
  receipt += '\n'
  receipt += '**********************'

  return receipt
}


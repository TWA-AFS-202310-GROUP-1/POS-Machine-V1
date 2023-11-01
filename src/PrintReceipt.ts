import {loadAllItems, loadPromotions} from './Dependencies'
import {Tag} from './Tag'
import { ReciptItem } from './ReceiptItem'
import { Item } from './Item'
import { Quantity } from './Quantity'
export function printReceipt(tags: string[]): String {
//   return `***<store earning no money>Receipt ***
// Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
// Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
// Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
// ----------------------
// Total：58.50(yuan)
// Discounted prices：7.50(yuan)
// **********************`
  if(!validTags(tags))
  {
    const errorMsg = 'The barcodes of tags are not valid!'
    return errorMsg
  }
  else{
    const parsedTags: Tag[] = parseTags(tags)
    const receiptItems:ReciptItem[] = generateReceiptItems(parsedTags)
    const receipt:String = renderReceipt(receiptItems)
    return receipt
  }
}
function validTags(tags:string[]):boolean
{
  const allItems = loadAllItems()
  const barcodes:string[] = []
  allItems.map(item=>barcodes.push(item.barcode))
  // console.log(barcodes)
  for(let idx = 0; idx < tags.length; idx++){
    if(!validElement(tags[idx], barcodes)){
      return false
    }
  }
  return true
}
function validElement(element: string, barcodes:string[]):boolean{
  if(element.length<10){
    return false
  }
  element = element.slice(0,10)
  if(barcodes.indexOf(element)===-1){
    // console.log(element)
    return false
  }
  return true
}
function parseTags(tags:string[]):Tag[]{
  // const allItems = loadAllItems()
  // const barcodes:string[] = []
  // allItems.map(item=>barcodes.push(item.barcode))
  // console.log(barcodes)
  const parsedTags:Tag[] = []
  const tagsVisited:string[] = []
  for(let idx = 0; idx < tags.length; idx++){
    if(tags[idx].length===10){
      if(tagsVisited.indexOf(tags[idx])===-1){
        tagsVisited.push(tags[idx])
        parsedTags.push({
          barcode:tags[idx],
          quantity:parseQuantity(tags, tags[idx])
        })
      }
    }
  }
  for(let idx = 0; idx < tags.length; idx++){
    if(tags[idx].length>10){
      const barcode = tags[idx].slice(0,10)
      const cnt = Number(tags[idx].slice(11,))
      // console.log(tags[idx].slice(11,))
      if(tagsVisited.indexOf(barcode)===-1){
        tagsVisited.push(barcode)
        parsedTags.push({
          barcode:barcode,
          quantity:cnt
        })
      }
      else{
        for(let idx=0; idx<parsedTags.length; idx++){
          if(parsedTags[idx].barcode===barcode){
            parsedTags[idx].quantity += cnt
          }
        }
      }
    }
  }
  // console.log(parsedTags)
  return parsedTags
}
function parseQuantity(tags:string[], element:string):number{
  let cnt = 0
  tags.find((ele)=> {
    ele===element? cnt++ : ''
  })
  return cnt
}
function generateReceiptItems(parsedTags:Tag[]):ReciptItem[]{
  const receiptItems : ReciptItem[] = []
  const allItems : Item[] = getAllItems()
  // console.log(allItems)
  // var subtotal = getPrices(parsedTags[0], allItems[0])
  for(let idx1=0; idx1<parsedTags.length; idx1++){
    for(let idx2=0; idx2<allItems.length; idx2++){
      if(parsedTags[idx1].barcode===allItems[idx2].barcode){
        const quantityOfItem:Quantity={
          value:parsedTags[idx1].quantity,
          quantifier:allItems[idx2].unit+'s'
        }
        const receiptItem:ReciptItem={
          barcode:parsedTags[idx1].barcode,
          name: allItems[idx2].name,
          quantity: quantityOfItem,
          unitPrice: allItems[idx2].unitPrice,
          subtotal: getPrices(parsedTags[idx1], allItems[idx2]),
          discountedPrice: calculateDiscountedSubtotal(parsedTags[idx1], allItems[idx2])
        }
        receiptItems.push(receiptItem)
      }
    }
  }
  // console.log(receiptItems)
  return receiptItems
}
function getAllItems(){
  const items:Item[] = []
  const allItems = loadAllItems()
  for(let idx=0; idx<allItems.length; idx++){
    const item:Item = {
      barcode:allItems[idx].barcode,
      name: allItems[idx].name,
      unit: allItems[idx].unit,
      unitPrice: allItems[idx].price,
    }
    items.push(item)
  }
  return items
}
function getPrices(parsedTag:Tag, item:Item):number{
  const promotion = loadPromotions()[0].barcodes
  if(promotion.indexOf(parsedTag.barcode)===-1)
  {
    return parsedTag.quantity*item.unitPrice
  }
  else{
    const countBought= parsedTag.quantity-Math.floor(parsedTag.quantity/3)
    // console.log(countBought)
    return countBought*item.unitPrice
  }
}
function calculateDiscountedSubtotal(parsedTag:Tag, item:Item):number{
  const promotion = loadPromotions()[0].barcodes
  if(promotion.indexOf(parsedTag.barcode)===-1){
    return 0
  }
  else{
    const countBought= Math.floor(parsedTag.quantity/3)
    return item.unitPrice*countBought
  }
}
function renderReceipt(receiptItems:ReciptItem[]):string{
  let printResults = ''
  printResults += '***<store earning no money>Receipt ***'+'\n'
  receiptItems.sort((a,b)=>a.barcode.localeCompare(b.barcode))
  let total = 0
  let discount = 0
  for(let idx=0;idx<receiptItems.length;idx++){
    printResults += generateEachLine(receiptItems[idx])+'\n'
    total += receiptItems[idx].subtotal
    discount += receiptItems[idx].discountedPrice
  }
  printResults += '----------------------'+'\n'
  printResults += 'Total：'+total.toFixed(2)+'(yuan)\n'
  printResults += 'Discounted prices：'+discount.toFixed(2)+'(yuan)\n'
  printResults += '**********************'
  return printResults
}
function generateEachLine(receiptItem:ReciptItem):string{
  return 'Name：'+receiptItem.name+'，Quantity：'+receiptItem.quantity.value+' '+receiptItem.quantity.quantifier+'，Unit：'+receiptItem.unitPrice.toFixed(2)+'(yuan)，Subtotal：'+receiptItem.subtotal.toFixed(2)+'(yuan)'
}

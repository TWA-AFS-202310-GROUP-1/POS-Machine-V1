import {Quantity} from './Quantity.js'
export interface ReciptItem{
    barcode:string
    name: string
    quantity: Quantity
    unitPrice: number
    subtotal: number
    discountedPrice: number
}

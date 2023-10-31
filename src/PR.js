"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.printReceipt = void 0;
var Dependencies_1 = require("./Dependencies");
var RECEIPTITEM = (0, Dependencies_1.loadAllItems)();
var PROMOTION = (0, Dependencies_1.loadPromotions)();
var total = 0;
var savings = 0;
var itemsMap = {};
function printReceipt(tags) {
    if (!isValidTag(tags))
        return "Invalid tag";
    var receiptLines = [];
    processTags(tags);
    var _loop_1 = function (itemBarcode) {
        var _a = itemsMap[itemBarcode], product = _a.product, quantity = _a.quantity;
        var subtotal = product.price * quantity;
        var promo = PROMOTION.find(function (item) { return item.barcodes.includes(product.barcode); });
        // Handle promotions
        if (promo && promo.type === 'BUY_TWO_GET_ONE_FREE') {
            var freeItems = Math.floor(quantity / 3);
            savings += freeItems * product.price;
            subtotal -= freeItems * product.price;
        }
        total += subtotal;
        var unit = '';
        if (quantity > 1)
            unit += (product.unit + 's');
        var line = "Name\uFF1A".concat(product.name, "\uFF0CQuantity\uFF1A").concat(quantity, " ").concat(unit, "\uFF0CUnit\uFF1A").concat(product.price.toFixed(2), "(yuan)\uFF0CSubtotal\uFF1A").concat(subtotal.toFixed(2), "(yuan)");
        receiptLines.push(line);
    };
    for (var itemBarcode in itemsMap) {
        _loop_1(itemBarcode);
    }
    return renderReceipt(receiptLines);
}
exports.printReceipt = printReceipt;
function isValidTag(tags) {
    var _loop_2 = function (tag) {
        var _a = tag.split('-'), barcode = _a[0], quantityStr = _a[1];
        if (!barcode || (quantityStr && isNaN(Number(quantityStr)))) {
            return { value: false };
        }
        if (!RECEIPTITEM.some(function (p) { return p.barcode === barcode; })) {
            return { value: false };
        }
        if (quantityStr && parseFloat(quantityStr) <= 0) {
            return { value: false };
        }
    };
    for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
        var tag = tags_1[_i];
        var state_1 = _loop_2(tag);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return true;
}
function processTags(tags) {
    var _loop_3 = function (tag) {
        var _a = tag.split('-'), itemBarcode = _a[0], quantityStr = _a[1];
        var quantity = quantityStr ? parseFloat(quantityStr) : 1;
        var product = RECEIPTITEM.find(function (p) { return p.barcode === itemBarcode; });
        if (!product)
            return "continue";
        if (itemsMap[product.barcode]) {
            itemsMap[product.barcode].quantity += quantity;
        }
        else {
            itemsMap[product.barcode] = { product: product, quantity: quantity };
        }
    };
    for (var _i = 0, tags_2 = tags; _i < tags_2.length; _i++) {
        var tag = tags_2[_i];
        _loop_3(tag);
    }
}
function renderReceipt(receiptLines) {
    var receiptStr = "***<store earning no money>Receipt ***\n";
    for (var _i = 0, receiptLines_1 = receiptLines; _i < receiptLines_1.length; _i++) {
        var line = receiptLines_1[_i];
        receiptStr += line + "\n";
    }
    receiptStr += "----------------------\n";
    receiptStr += "Total\uFF1A".concat(total.toFixed(2), "(yuan)\n");
    receiptStr += "Discounted prices\uFF1A".concat(savings.toFixed(2), "(yuan)\n");
    receiptStr += "**********************";
    return receiptStr;
}

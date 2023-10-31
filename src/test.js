function countBarcodes(tags) {
    var barcodeMap = new Map();
    for (var _i = 0, tags_1 = tags; _i < tags_1.length; _i++) {
        var tag = tags_1[_i];
        var _a = tag.split('-'), barcode = _a[0], quantityStr = _a[1];
        var quantity = parseInt(quantityStr) || 1;
        var count = barcodeMap.get(barcode) || 0;
        barcodeMap.set(barcode, count + quantity);
    }
    var tagList = [];
    barcodeMap.forEach(function (quantity, barcode) {
        var tag = { barcode: barcode, quantity: quantity };
        tagList.push(tag);
    });
    return tagList;
}
// 使用示例：
var tags = [
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000001',
    'ITEM000003-2',
    'ITEM000005',
    'ITEM000005',
    'ITEM000005'
];
var tagList = countBarcodes(tags);
console.log(tagList);

interface Item {
    barcode: string;
    name: string;
    unit: string;
    price: number;
  }
  
  interface Tag {
    barcode: string;
    quantity: number;
  }
  
  function countBarcodes(tags: string[]): Tag[] {
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
  
  // 使用示例：
  const tags: string[] = [
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
  
  const tagList: Tag[] = countBarcodes(tags);
  console.log(tagList);
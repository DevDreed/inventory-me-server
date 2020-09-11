export interface Product {
  id: string;
  description: string;
  size: string;
  quantity: number;
  percent_markup: number;
  price: number;
  backordered: boolean;
  tags: Tag[];
  created_date: Date;
  updated_date: Date;
  allProducts?: Product[];
}

export interface Item {
  id: string;
  description: string;
  price: number;
  item_type: ItemType;
  created_date: Date;
  updated_date: Date;
}

export interface ItemType {
  id: string;
  description: string;
}

export interface Tag {
  id: string;
  description: string;
}

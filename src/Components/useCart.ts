import { Result } from "@coveo/headless";
import { useState } from "react";

export interface CartItem {
  product: Result;
  quantity: number;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  function findCartItemIndex(product: Result) {
    return items.findIndex(item => item.product.uniqueId === product.uniqueId)
  }

  function addProduct(product: Result) {
    const index = findCartItemIndex(product)
    index === -1 ? addNewItem(product) : incrementItem(product)
  }

  function addNewItem(product: Result) {
    const newItems = [...items, { product, quantity: 1 }]
    setItems(newItems)
  }

  function incrementItem(product: Result) {
    const newItems = items.map(item => {
      const found = item.product.uniqueId === product.uniqueId
      return found ? ({ ...item, quantity: item.quantity + 1 }) : item;
    })

    setItems(newItems)
  }

  function removeProduct(product: Result) {
    const newItems = items.filter(item => item.product.uniqueId !== product.uniqueId)
    setItems(newItems)
  }

  return {
    items,
    addProduct,
    removeProduct
  }
}
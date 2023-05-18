import { Result } from "@coveo/headless";
import { buildStore } from "../common/store";

export interface CartItem {
  product: Result;
  quantity: number;
}

const store = buildStore<CartItem[]>([])

export function useCart() {
  const { set, subscribe } = store;

  function findCartItemIndex(product: Result) {
    return store.value.findIndex(item => item.product.uniqueId === product.uniqueId)
  }

  function addProduct(product: Result) {
    const index = findCartItemIndex(product)
    index === -1 ? addNewItem(product) : incrementItem(product)
  }

  function addNewItem(product: Result) {
    const newItems = [...store.value, { product, quantity: 1 }]
    set(newItems)
  }

  function incrementItem(product: Result) {
    const newItems = store.value.map(item => {
      const found = item.product.uniqueId === product.uniqueId
      return found ? ({ ...item, quantity: item.quantity + 1 }) : item;
    })

    set(newItems)
  }

  function removeProduct(product: Result) {
    const newItems = store.value.filter(item => item.product.uniqueId !== product.uniqueId)
    set(newItems)
  }

  function removeAll() {
    set([])
  }

  return {
    addProduct,
    removeProduct,
    removeAll,
    subscribe,
  }
}
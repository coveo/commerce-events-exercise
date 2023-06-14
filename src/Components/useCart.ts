import { Result } from "@coveo/headless";
import { buildStore } from "../common/store";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export interface CartItem {
  product: Result;
  quantity: number;
}

const store = buildStore<CartState>({ items: [], isOpen: false })

export function useCart() {
  const { set, subscribe } = store;

  function findCartItemIndex(product: Result) {
    return store.value.items.findIndex(item => item.product.uniqueId === product.uniqueId)
  }

  function addProduct(product: Result) {
    const index = findCartItemIndex(product)
    index === -1 ? addNewItem(product) : incrementItem(product)
  }

  function addNewItem(product: Result) {
    const state = store.value
    const newItems = [...state.items, { product, quantity: 1 }]
    set({ ...state, items: newItems })
  }

  function incrementItem(product: Result) {
    const state = store.value
    const newItems = state.items.map(item => {
      const found = item.product.uniqueId === product.uniqueId
      return found ? ({ ...item, quantity: item.quantity + 1 }) : item;
    })

    set({ ...state, items: newItems })
  }

  function removeProduct(product: Result) {
    const state = store.value
    const newItems = state.items.filter(item => item.product.uniqueId !== product.uniqueId)
    set({ ...state, items: newItems })
  }

  function removeAll() {
    const state = store.value
    set({ ...state, items: [] })
  }

  function get() {
    return store.value
  }

  return {
    addProduct,
    removeProduct,
    removeAll,
    subscribe,
    get
  }
}
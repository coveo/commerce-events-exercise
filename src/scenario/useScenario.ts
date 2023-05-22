import { CartItem, useCart } from "../Components/useCart";
import { AnalyticsEvent, useEventStore } from "./useEventStore";

export function useScenario() {
  const { reset: resetEventStore, get: getEvents } = useEventStore()
  const { removeAll: emptyCart, get: getCart } = useCart();

  async function run() {
    resetEventStore()
    emptyCart()
    addItemToCart()

    openCart()
    await sleep(0.5)
    navigateToCheckout()

    pay()
    await sleep(0.5)

    const items = getCart()
    const events = getEvents()

    navigateToHome()
    emptyCart()

    analyze(items, events)
  }

  return {
    run
  }
}

function addItemToCart() {
  clickButton('.add-to-cart-btn')
}

function openCart() {
  clickButton('#cart-btn')
}

async function navigateToCheckout() {
  clickButton('#checkout-btn')
}

function pay() {
  clickButton('.pay-btn')
}

function navigateToHome() {
  clickButton('.home-btn')
}

function clickButton(selector: string) {
  const el = document.querySelector<HTMLButtonElement>(selector)
  el && el.click()
}

function sleep(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function analyze(items: CartItem[], events: AnalyticsEvent[]) {
  const result = checkAddToCartEvent(items[0], events[0], 0)
  console.log(result)
}

interface Report {
  valid: boolean;
  message: string;
}

function checkAddToCartEvent(cartItem: CartItem, event: AnalyticsEvent, index: number) {
  return {
    event: 'addToCart',
    payload: event.payload,
    report: getAddToCartEventReport(cartItem, event, index)
  }
}

function getAddToCartEventReport(cartItem: CartItem, event: AnalyticsEvent, index: number) {
  const prefix = `pr${index + 1}`
  const id = `${prefix}id`
  const category = `${prefix}ca`
  const price = `${prefix}pr`
  const name = `${prefix}nm`
  const quantity = `${prefix}qt`

  return [
    assertPayload(event, 'action', 'add'),
    assertPayload(event, id, cartItem.product.clickUri),
    assertPayload(event, category, cartItem.product.clickUri),
    assertPayload(event, price, cartItem.product.clickUri),
    assertPayload(event, name, cartItem.product.clickUri),
    assertPayload(event, quantity, cartItem.quantity),
  ]
}

function assertPayload(event: AnalyticsEvent, key: string, value: any): Report {
  if (event.payload[key] !== value) {
    const message = `expected ${key} to be "${value}"`
    return { valid: false, message }
  }

  return { valid: true, message: `${key} is correct` }
}

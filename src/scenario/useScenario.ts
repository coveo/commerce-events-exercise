import { CartItem, useCart } from "../Components/useCart";
import { AnalyticsEvent, useEventStore } from "./useEventStore";
import { EventReport, ReportItem, useScoreCardStore } from "./useScoreCard";

export function useScenario() {
  const { reset: resetEventStore, get: getEvents } = useEventStore()
  const { removeAll: emptyCart, get: getCart } = useCart();
  const { set: setScoreCard } = useScoreCardStore()

  async function run() {
    resetEventStore()
    emptyCart()
    addItemToCart()

    openCart()
    await sleep()
    navigateToCheckout()
    await sleep()
    pay()
    await sleep()
    navigateToHome()
    await sleep()

    const items = getCart()
    const events = getEvents()
    emptyCart()

    const scoreCard = analyze(items, events)
    setScoreCard(scoreCard)
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

function sleep(seconds: number = 0.5) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function analyze(items: CartItem[], events: AnalyticsEvent[]) {
  return [
    checkAddToCart(items[0], events[0], 0),
    checkCheckoutPageView(events[1]),
    checkPurchase(events[2], items),
    checkHomePageView(events[3])
  ]
}

function checkAddToCart(cartItem: CartItem, event: AnalyticsEvent, index: number): EventReport {
  return {
    event: 'addToCart',
    payload: event.payload,
    report: getAddToCartEventReport(cartItem, event, index)
  }
}

function getAddToCartEventReport(cartItem: CartItem, event: AnalyticsEvent, index: number) {
  return [
    assertPayload(event, 'action', 'add'),
    ...assertProduct(event, cartItem, index)
  ]
}

function checkCheckoutPageView(event: AnalyticsEvent): EventReport {
  return {
    event: 'checkout pageview',
    payload: event.payload,
    report: [
      assertPayload(event, 'hitType', 'pageview'),
      assertPayload(event, 'page', '/checkout')
    ]
  }
}

function checkHomePageView(event: AnalyticsEvent): EventReport {
  return {
    event: 'home pageview',
    payload: event.payload,
    report: [
      assertPayload(event, 'hitType', 'pageview'),
      assertPayload(event, 'page', '/home')
    ]
  }
}

function checkPurchase(event: AnalyticsEvent, items: CartItem[]): EventReport {
  return {
    event: 'purchase',
    payload: event.payload,
    report: [
      assertPayload(event, 'action', 'purchase'),
      ...items.flatMap((item, i) => assertProduct(event, item, i)),
      assertPayload(event, 'id', '931cbf0c-07b0-4be1-91bb-448b3d82addc-1677170972912'),
      assertPayload(event, 'revenue', sumCart(items)),
    ]
  }
}

function sumCart(items: CartItem[]) {
  return items
    .map(item => {
      const rawPrice = item.product.raw.price
      const price = typeof rawPrice === 'number' ? rawPrice : 0;
      return price * item.quantity
    })
    .reduce((acc, curr) => acc + curr, 0)
}

function assertProduct(event: AnalyticsEvent, cartItem: CartItem, index: number): ReportItem[] {
  const prefix = `pr${index + 1}`
  const id = `${prefix}id`
  const category = `${prefix}ca`
  const price = `${prefix}pr`
  const name = `${prefix}nm`
  const quantity = `${prefix}qt`

  return [
    assertPayload(event, id, cartItem.product.clickUri),
    assertPayload(event, category, cartItem.product.clickUri),
    assertPayload(event, price, cartItem.product.clickUri),
    assertPayload(event, name, cartItem.product.clickUri),
    assertPayload(event, quantity, cartItem.quantity),
  ]
}

function assertPayload(event: AnalyticsEvent, key: string, value: any): ReportItem {
  if (event.payload[key] !== value) {
    const message = `expected ${key} to be "${value}"`
    return { valid: false, message }
  }

  return { valid: true, message: `${key} is correct` }
}

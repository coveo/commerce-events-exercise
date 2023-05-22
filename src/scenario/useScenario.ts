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
    await sleep(0.5)
    navigateToCheckout()

    pay()
    await sleep(0.5)

    navigateToHome()

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

function sleep(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function analyze(items: CartItem[], events: AnalyticsEvent[]) {
  return [
    checkAddToCart(items[0], events[0], 0),
    checkCheckoutPageView(events[1])
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

function checkCheckoutPageView(event: AnalyticsEvent): EventReport {
  return {
    event: 'pageview',
    payload: event.payload,
    report: [
      assertPayload(event, 'hitType', 'pageview'),
      assertPayload(event, 'page', '/checkout')
    ]
  }
}

function assertPayload(event: AnalyticsEvent, key: string, value: any): ReportItem {
  if (event.payload[key] !== value) {
    const message = `expected ${key} to be "${value}"`
    return { valid: false, message }
  }

  return { valid: true, message: `${key} is correct` }
}

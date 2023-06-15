import { CartItem, useCart } from "../Components/useCart";
import { AnalyticsEvent, useEventStore } from "./useEventStore";
import { EventReport, ReportItem, useScoreCardStore } from "./useScoreCard";

export function useScenario() {
  const { reset: resetEventStore, get: getEvents } = useEventStore()
  const { removeAll: emptyCart, get: getCartState } = useCart();
  const { set: setScoreCard } = useScoreCardStore()

  async function run() {
    resetEventStore()
    emptyCart()

    addItemToCart()
    await sleep()
    isCartClosed() && openCart()
    await sleep()
    navigateToCheckout()
    await sleep()
    pay()
    await sleep()
    navigateToHome()
    await sleep()

    const cartState = getCartState()
    const events = getEvents()

    const scoreCard = analyze(cartState.items, events)
    setScoreCard(scoreCard)
  }

  return {
    run
  }
}

function addItemToCart() {
  clickButton('.add-to-cart-btn')
}

function isCartClosed() {
  return !document.querySelector('.cart-list')
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
  const [click, addToCart, checkoutPageView, purchase, searchPageView] = events;

  return [
    checkClick(click, items[0]),
    checkAddToCart(addToCart, items[0], 0),
    checkCheckoutPageView(checkoutPageView),
    checkPurchase(purchase, items),
    checkHomePageView(searchPageView)
  ]
}

type LoggedAnalyticsEvent = AnalyticsEvent | undefined

function checkClick(event: LoggedAnalyticsEvent, cartItem: CartItem): EventReport {
  return {
    event: 'click',
    payload: getPayload(event),
    report: event ? getClickEventReport(cartItem, event) : [],
    missing: !event
  }
}

function getClickEventReport(cartItem: CartItem, event: AnalyticsEvent) {
  return []
}

function checkAddToCart(event: LoggedAnalyticsEvent, cartItem: CartItem, index: number): EventReport {
  return {
    event: 'addToCart',
    payload: getPayload(event),
    report: event ? getAddToCartEventReport(cartItem, event, index) : [],
    missing: !event
  }
}

function getAddToCartEventReport(cartItem: CartItem, event: AnalyticsEvent, index: number) {
  return [
    assertPayload(event, 'action', 'add'),
    ...assertProduct(event, cartItem, index)
  ]
}

function checkCheckoutPageView(event: LoggedAnalyticsEvent): EventReport {
  return {
    event: 'checkout pageview',
    payload: getPayload(event),
    report: event ? [
      assertPayload(event, 'hitType', 'pageview'),
      assertPayload(event, 'page', '/checkout')
    ] : [],
    missing: !event
  }
}

function getPayload(event: LoggedAnalyticsEvent) {
  return event ? event.payload : {}
}

function checkHomePageView(event: LoggedAnalyticsEvent): EventReport {
  return {
    event: 'search pageview',
    payload: getPayload(event),
    report: event ? [
      assertPayload(event, 'hitType', 'pageview'),
      assertPayload(event, 'page', '/search')
    ] : [],
    missing: !event
  }
}

function checkPurchase(event: LoggedAnalyticsEvent, items: CartItem[]): EventReport {
  return {
    event: 'purchase',
    payload: getPayload(event),
    report: event ? [
      assertPayload(event, 'action', 'purchase'),
      ...items.flatMap((item, i) => assertProduct(event, item, i)),
      assertPayload(event, 'id', '931cbf0c-07b0-4be1-91bb-448b3d82addc-1677170972912'),
      assertPayload(event, 'revenue', sumCart(items)),
    ] : [],
    missing: !event
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
    assertPayload(event, id, cartItem.product.raw.ec_productid),
    assertPayload(event, category, cartItem.product.raw.ec_category),
    assertPayload(event, price, cartItem.product.raw.ec_price),
    assertPayload(event, name, cartItem.product.raw.ec_name),
    assertPayload(event, quantity, cartItem.quantity),
  ]
}

function assertPayload(event: AnalyticsEvent, key: string, expected: any): ReportItem {
  const received = event.payload[key]
  return { valid: expected === received, key, expected, received }
}

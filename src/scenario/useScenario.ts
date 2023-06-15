import { CartItem, useCart } from "../Components/useCart";
import { AnalyticsEvent, useEventStore } from "./useEventStore";
import { EventReport, ReportItem, useScoreCardStore } from "./useScoreCard";
import { SearchEngine } from "@coveo/headless";

export interface NullableSearchEngine {
  engine: SearchEngine | null
}

export function useScenario(props: NullableSearchEngine) {
  const { reset: resetEventStore, get: getEvents } = useEventStore()
  const { removeAll: emptyCart, get: getCartState } = useCart();
  const { set: setScoreCard } = useScoreCardStore()

  async function run() {
    resetEventStore()
    emptyCart()

    const searchQueryUid = props.engine!.state.search.response.searchUid

    addItemToCart()
    await sleep()
    isCartClosed() && toggleCart()
    await sleep()
    navigateToCheckout()
    await sleep()
    pay()
    await sleep()
    navigateToHome()
    await sleep()

    const cartState = getCartState()
    const events = getEvents()

    emptyCart()
    toggleCart()

    const scoreCard = analyze(cartState.items, events, searchQueryUid)
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

function toggleCart() {
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

function analyze(items: CartItem[], events: AnalyticsEvent[], searchQueryUid: string) {
  const [click, addToCart, checkoutPageView, purchase, searchPageView] = events;

  return [
    checkClick(click, items[0], searchQueryUid),
    checkAddToCart(addToCart, items[0], 0),
    checkCheckoutPageView(checkoutPageView),
    checkPurchase(purchase, items),
    checkSearchPageView(searchPageView)
  ]
}

type LoggedAnalyticsEvent = AnalyticsEvent | undefined

function checkClick(event: LoggedAnalyticsEvent, cartItem: CartItem, searchQueryUid: string): EventReport {
  return {
    event: 'click',
    payload: getPayload(event),
    report: event ? getClickEventReport(cartItem, event, searchQueryUid) : [],
    missing: !event
  }
}

function getClickEventReport(cartItem: CartItem, event: AnalyticsEvent, searchQueryUid: string) {
  const { product } = cartItem;
  return [
    assertPayload(event, 'actionCause', 'documentOpen'),
    assertPayload(event, 'anonymous', true),
    assertPayload(event, 'documentPosition', 1),
    assertPayload(event, 'documentTitle', product.title),
    assertPayload(event, 'documentUriHash', product.raw.urihash),
    assertPayload(event, 'documentUrl', product.uri),
    assertPayload(event, 'language', 'en'),
    assertPayload(event, 'originLevel1', 'default'),
    assertPayload(event, 'searchQueryUid', searchQueryUid),
    assertPayload(event, 'sourceName', product.raw.source),
    assertPayload(event, 'userAgent', navigator.userAgent),
    assertCustomData(event, 'contentIDKey', 'permanentId'),
    assertCustomData(event, 'contentIDValue', product.raw.permanentid),
    assertCustomData(event, 'context_website', 'Commerce Store')
  ]
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

function checkSearchPageView(event: LoggedAnalyticsEvent): EventReport {
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
  return buildReportItem(key, expected, received)
}

function assertCustomData(event: AnalyticsEvent, key: string, expected: any): ReportItem {
  const received = event.payload['customData'][key]
  return buildReportItem(key, expected, received)
}

function buildReportItem(key: string, expected: string, received: string): ReportItem {
  return { valid: expected === received, key, expected, received: `${received}` }
}

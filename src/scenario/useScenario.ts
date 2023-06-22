import { SearchResponseSuccess } from "@coveo/headless/dist/definitions/api/search/search/search-response";
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

    const searchResponse = props.engine!.state.search.response;

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

    const scoreCard = analyze(cartState.items, events, searchResponse)
    setScoreCard(scoreCard)
  }

  return {
    run
  }
}

function addItemToCart() {
  clickRandomButton('.add-to-cart-btn')
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

function clickRandomButton(selector: string) {
  const elements = document.querySelectorAll<HTMLButtonElement>(selector)
  const index = randomIndex(elements.length)
  const el = elements.item(index)
  el && el.click()
}

function randomIndex(length: number) {
  const random = Math.random() * length
  return Math.floor(random)
}

function clickButton(selector: string) {
  const el = document.querySelector<HTMLButtonElement>(selector)
  el && el.click()
}

function sleep(seconds: number = 0.5) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

function analyze(items: CartItem[], events: AnalyticsEvent[], searchResponse: SearchResponseSuccess) {
  const find = findIncrementally(events)

  const click = find((event) => event.payload.actionCause === 'documentOpen')
  const addToCart = find((event) => event.payload.action === 'add')
  const checkoutPageView = find((event) => event.payload.page === '/checkout')
  const purchase = find((event) => event.payload.action === 'purchase')
  const searchPageView = find((event) => event.payload.page === '/search')

  const [item] = items;
  const itemIndex = 0;

  return [
    checkClick(click, item, searchResponse),
    checkAddToCart(addToCart, item, itemIndex),
    checkCheckoutPageView(checkoutPageView),
    checkPurchase(purchase, items),
    checkSearchPageView(searchPageView)
  ]
}

function findIncrementally<T>(arr: T[]) {
  let maxIndex = 0
  return (condition: (el: T) => boolean) => {
    const index = arr.findIndex((el, i) => i >= maxIndex && condition(el))
    maxIndex = Math.max(maxIndex, index)
    return arr[index]
  }
}

type LoggedAnalyticsEvent = AnalyticsEvent | undefined

function checkClick(event: LoggedAnalyticsEvent, item: CartItem, searchResponse: SearchResponseSuccess): EventReport {
  return {
    event: 'click',
    payload: getPayload(event),
    report: event ? getClickEventReport(item, event, searchResponse) : [],
    missing: !event
  }
}

function getClickEventReport(item: CartItem, event: AnalyticsEvent, searchResponse: SearchResponseSuccess) {
  const { product } = item;
  const { searchUid, results } = searchResponse
  const index = results.findIndex(r => r.uniqueId === product.uniqueId)

  return [
    assertPayload(event, 'actionCause', 'documentOpen'),
    assertPayload(event, 'anonymous', true),
    assertPayload(event, 'documentPosition', index + 1),
    assertPayload(event, 'documentTitle', product.title),
    assertPayload(event, 'documentUriHash', product.raw.urihash),
    assertPayload(event, 'documentUrl', product.uri),
    assertPayload(event, 'language', 'en'),
    assertPayload(event, 'originLevel1', 'default'),
    assertPayload(event, 'searchQueryUid', searchUid),
    assertPayload(event, 'sourceName', product.raw.source),
    assertCustomData(event, 'contentIDKey', 'permanentid'),
    assertCustomData(event, 'contentIDValue', product.raw.permanentid),
    assertWebsite(event),
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
    ...assertProduct(event, cartItem, index),
    assertWebsite(event),
  ]
}

function checkCheckoutPageView(event: LoggedAnalyticsEvent): EventReport {
  return {
    event: 'checkout pageview',
    payload: getPayload(event),
    report: event ? [
      assertPayload(event, 'hitType', 'pageview'),
      assertPayload(event, 'page', '/checkout'),
      assertWebsite(event),
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
      assertPayload(event, 'page', '/search'),
      assertWebsite(event),
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
      assertWebsite(event),
    ] : [],
    missing: !event
  }
}

function sumCart(items: CartItem[]) {
  return items
    .map(item => {
      const rawPrice = item.product.raw.ec_price
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
    assertPayload(event, category, lastElement(cartItem.product.raw.ec_category as string[])),
    assertPayload(event, price, cartItem.product.raw.ec_price),
    assertPayload(event, name, cartItem.product.raw.ec_name),
    assertPayload(event, quantity, cartItem.quantity),
  ]
}

function lastElement<T>(arr: T[]) {
  return arr.slice(-1)[0]
}

function assertPayload(event: AnalyticsEvent, key: string, expected: any): ReportItem {
  const received = event.payload[key]
  return buildReportItem(key, expected, received)
}

function assertWebsite(event: AnalyticsEvent): ReportItem {
  return assertNestedKey(event, 'custom', 'context_website', 'Commerce Store')
}

function assertCustomData(event: AnalyticsEvent, key: string, expected: any): ReportItem {
  return assertNestedKey(event, 'customData', key, expected)
}

function assertNestedKey(event: AnalyticsEvent, prefix: string, key: string, expected: any): ReportItem {
  const received = event.payload[prefix][key]
  return buildReportItem(`${prefix}.${key}`, expected, received)
}

function buildReportItem(key: string, expected: string, received: string): ReportItem {
  return { valid: expected === received, key, expected, received }
}

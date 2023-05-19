import { useCart } from "../Components/useCart";

export function useScenario() {
  const { removeAll: emptyCart } = useCart();

  async function run() {
    emptyCart()
    addItemToCart()

    openCart()
    await sleep(0.5)
    navigateToCheckout()

    pay()
    await sleep(0.5)

    reportResult()
    navigateToHome()
    emptyCart()
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

function reportResult() {

}
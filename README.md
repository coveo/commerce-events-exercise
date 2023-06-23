# Exercise: logging commerce events

This repo contains a simple commerce site to practice implementing commerce events. The application provides a `Run scenario` button which when clicked will run a test scenario (described below) and give you feedback on the implemnted events.

## The scenario

The test scenrio simulates a simple checkout flow. It will:

1. Add a random product to the cart.
2. Navigate to the checkout page.
3. Pay
4. Navigate to the search page.

When the scenario is complete, a modal will show the intercepted events and feedback on the payloads.

## The exercise

The exercise is to implement the following events:

1. A click event emitted when the `Add to cart` button is clicked.
2. An add-to-cart event emitted when the `Add to cart` button is clicked.
3. A page view event emitted when the checkout page is rendered.
4. A purchase event emitted when the `Pay` button on the checkout page is clicked.
5. A page view emitted when the search page is rendered.

Placeholder functions that need to be implemented are included in the code. Search for `logClick`, `logAddToCart`, `logPageView` and `logPurchase`.

Refer to the [documentation here](https://docs.coveo.com/en/3188/coveo-for-commerce/log-commerce-events) for information on how to emit the events and their expected payloads.

To test your implementation, click the `Run scenario` button.

**Note**: the values of some keys in event payloads should meet certain business requirements listed in the following table:

<table>
    <thead>
        <tr>
            <th>Event</th>
            <th>Key</th>
            <th>Value</th>
            <th>Notes</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>all</td>
            <td>customData.context_website</td>
            <td>Commerce Store</td>
        </tr>
        <tr>
            <td>click</td>
            <td>originLevel1</td>
            <td>CommerceStoreSearch</td>
            <td>Handled for you when logging clicks using Headless</td>
        </tr>
        <tr>
            <td>purchase</td>
            <td>id</td>
            <td>931cbf0c-07b0-4be1-91bb-448b3d82addc-1677170972912</td>
            <td>For the exercise, hard-code this value as the transaction id</td>
        </tr>
    </tbody>
</table>

## Scoring

Each implemented event provides a maximum of 2 points.

- 1 point for emitting the event.
- A maximum of 1 point if all keys in the payload are correct. e.g. if only 50% of the payload is valid, 0.5 points will be awarded.

## Setup

Pick one of the following setup options:

### In browser

- Code in the [online sandbox](https://codesandbox.io/p/github/samisayegh/commerce-store/main?file=/README.md).

### Local machine

- Clone the repo
- Install dependencies: `npm i`
- Start the server: `npm start`

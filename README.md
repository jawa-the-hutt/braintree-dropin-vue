# braintree-dropin-vue

Vue component to integrate Braintree Drop-In UI (V3).
https://developers.braintreepayments.com/guides/drop-in/javascript/v3

Inspiration and code adapted from [braintree-dropin-react](https://github.com/kovndr/braintree-dropin-react)

### Features

- Wraps the Braintree Drop-In UI V3

# Props

#### Required

- containerId - Required - The `div` that the drop-in will be initialized in.
- createTransaction - Required - A function passed in that will take the nonce and amount and send it to your server for processing.

#### Optional Props

- options - Braintree web dropin create options [see in DOC](https://braintree.github.io/braintree-web-drop-in/docs/current/module-braintree-web-drop-in.html#.create)
- submitButtonText - Text of the submit button. (defaults to `Pay`)
- submitButtonClasses - CSS class for the submit button (defaults to `btn btn-primary`)
- braintreeDropInWrapperClass - CSS class for the container that wraps everything

#### Functions as Props

- createToken - function passed in that will call your server and create the client token for the payment method.
- onCreate - function passed in that is triggered when Drop-In UI is visible
- onError - function passed in that is triggered when error occured.  This is not required, by highly encouraged to use to allow errors to bubble up the best
- onDestroyStart - function passed in that is triggered before teardown
- onDestroyEnd - function passed in that is triggered after success teardown

# Installation

```
npm install braintree-dropin-vue
```

### Examples

see some examples in `/example`
1.  braintree.vue - Vue SFC that has this component integrated.
2.  braintree.native.vue - Nativescript-Vue SFC that uses `nativescript-braintree`
3.  braintree-model.ts - Shared module/functions between `braintree.vue` and `braintree-native.vue` where we call the server to get a client token and to process the transaction.
4.  server.ts - basic class that has example functions for creating client tokens as well as processing transactions with Braintree's APIs.
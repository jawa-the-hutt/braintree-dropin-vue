<template>
  <div :class="braintreeDropInWrapperClass">
    <div ref="containerId"/>
    <button
      v-on:click="handleSubmit"
      :disabled="isSubmitButtonDisabled"
      :class="submitButtonClasses"
    >{{submitButtonText}}</button>
  </div>
</template>
<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator'
import braintree from 'braintree-web-drop-in';

@Component({
  name: `braintree-dropin-vue`,
})
export default class BraintreeDropInVue extends Vue {

  @Prop({ required: true }) readonly containerId!: string | HTMLElement;
  @Prop({ required: true }) readonly createTransaction!: Function;
  @Prop(Object) readonly options!: object;

  @Prop({ default: 'Pay' }) readonly submitButtonText!: string;
  @Prop({ default: 'btn btn-primary' }) readonly submitButtonClasses!: string;
  @Prop(String) readonly braintreeDropInWrapperClass!: string;

  @Prop(Function) readonly createToken!: Function;
  @Prop(Function) readonly onCreate!: Function;
  @Prop(Function) readonly onError!: Function;
  @Prop(Function) readonly onDestroyStart!: Function;
  @Prop(Function) readonly onDestroyEnd!: Function;


  private dropInInstance: braintree.DropIn = null;
  private isSubmitButtonDisabled: boolean = true;   // When a payment is processed, prevents double clicks

  async mounted() {
    if (this.dropInInstance) return;
    this.setup(await this.createToken());
  }

  beforeDestroy() {
    if (!this.dropInInstance) return;

    this.teardown().catch((err) => {
      if (this.onError) {
        this.onError(err)
      }
    })
  }

  setup(token) {
    const options = {
      ...this.options,
      authorization: token,
      container: this.$refs.containerId
    }

    braintree.create(options, (err, dropinInstance) => {
      if (err) {
        if (this.onError) {
          this.onError(err)
        }
        return
      } else {
        if (this.onCreate) {
          this.onCreate(dropinInstance)
        }
      }

      if (dropinInstance.isPaymentMethodRequestable()) {
        this.isSubmitButtonDisabled = false
      }

      dropinInstance.on('paymentMethodRequestable', (event) => {
        this.isSubmitButtonDisabled = false
      })

      dropinInstance.on('noPaymentMethodRequestable', () => {
        this.isSubmitButtonDisabled = true
      })

      this.dropInInstance = dropinInstance;
    })
  }

  async teardown() {
    if (this.onDestroyStart) {
      await this.onDestroyStart()
    }
    return new Promise((resolve, reject) => {
      this.dropInInstance.teardown(async (err) => {
        if (this.onDestroyEnd) {
          return await this.onDestroyEnd(err)
        }
        if (err) {
          return reject(err)
        } else {
          return resolve()
        }
      })
    })

  }

  async handleSubmit(event) {
    if (this.dropInInstance && !this.isSubmitButtonDisabled) {
      this.isSubmitButtonDisabled = true;
      this.dropInInstance.requestPaymentMethod(async (err, payload) => {
        this.isSubmitButtonDisabled = false;

        if (err) {
          if (this.onError) {
            this.onError(err)
          }
        } else {
          // keep button disabled to prevent doubleclicks
          this.isSubmitButtonDisabled = true
          try {
            await this.createTransaction(payload);
          } catch (err) {
            if (this.onError) {
              this.onError(err)
            }
            // since there is an error, enable button
            this.isSubmitButtonDisabled = false;
          }
        }
      })
    }
  }
}
</script>

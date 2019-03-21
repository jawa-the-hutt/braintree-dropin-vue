<template>
  <Page>
    <GridLayout rows="auto">
      <braintree-dropin-vue
        containerId="braintree-dropin-container"
        :createTransaction="createTransaction"
        :createToken="createToken"
        :options="braintreeOptions"
        :onCreate="onCreate"
        :onDestroyStart="onDestroyStart"
        :onDestroyEnd="onDestroyEnd"
        :onError="onError"
      ></braintree-dropin-vue>
    </GridLayout>
  </Page>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BraintreeDropInVue from '../src/index.vue';
import BraintreeModel from './braintree-model';

@Component({
  name: 'braintree',
  components: {
    'braintree-dropin': BraintreeDropInVue,
  },
})
export default class BraintreeWeb extends Vue {
  private braintreeModel: BraintreeModel = new BraintreeModel();
  private clientId: string = `testClient1`;
  private amount: number = 20.00;
  private braintreeOptions: object = {
    vaultManager: true,
    collectDeviceData: true,
    requestThreeDSecureVerification: false,
  };

  private createToken = async () => {
    console.log('createToken web');
    try {
      return await this.braintreeModel.getToken(this.clientId);
    } catch (err) {
      return err;
    }
  }

  private createTransaction = async (payload) => {
    return await this.braintreeModel.createTransaction(payload.nonce, this.amount).then((response: any) => {
      try {
        console.log('view createTransaction Success');
        console.log(' r - ', response);
        return response.transaction;
      } catch (err) {
        throw err;
      }
    });
  }

  private onCreate = async (instance) => {
    try {
      console.log('onCreate');
    } catch (err) {
      throw err;
    }
  }

  private onDestroyStart = async () => {
    try {
      console.log('onDestroyStart');
    } catch (err) {
      throw err;
    }
  }

  private onDestroyEnd = async () => {
    try {
      console.log('onDestroyEnd');
    } catch (err) {
      throw err;
    }
  }

  private onError = async (error) => {
    try {
      console.log('onError', error);
    } catch (err) {
      throw err;
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>

<template>
  <Page>
    <ActionBar :title="navbarTitle"/>
    <GridLayout rows="auto, auto">
      <Button @tap="startPayment" text="Pay" row="1"/>
    </GridLayout>
  </Page>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Braintree, BrainTreeOptions } from 'nativescript-braintree';
  import BraintreeModel from './braintree-model';

  @Component( {
    name: 'braintree',
  } )
  export default class BraintreeNative extends Vue  {
   private navbarTitle: string = `Braintree.vue`;
    private clientId: string = `testClient1`;
    private amount: number = 10.00;
    private opt: BrainTreeOptions = {
      amount: this.amount.toString(),
      collectDeviceData: true,
      requestThreeDSecureVerification: false,
    };

    private braintree: Braintree = new Braintree();
    private braintreeModel: BraintreeModel = new BraintreeModel();

    private createToken = async () => {
      console.log('createToken native');
      try {
        return await this.braintreeModel.getToken(this.clientId);
      } catch (err) {
        return err;
      }
    }

    private startPayment = async (): Promise<void> => {

      this.braintree.startPayment( await this.createToken(), this.opt );

      this.braintree.on( 'success', async (res) => {
        const output = res.object.get('output');
        console.dir(output);

        await this.createTransaction(output);
      });

      this.braintree.on( 'cancel', (res) => {
        const output = res.object.get('output');
        console.dir(output);
      });

      this.braintree.on( 'error', (res) => {
        const output = res.object.get('output');
        console.dir(output);
      });
    }

    private createTransaction = async (payload) => {
      const amount = this.amount;
      return await this.braintreeModel.createTransaction(payload.nonce, amount).then((response: any) => {
        try {
          console.log(' successful payment - ', response);
          return response.transaction;
        } catch (err) {
          throw err;
        }
      });
    }  
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>

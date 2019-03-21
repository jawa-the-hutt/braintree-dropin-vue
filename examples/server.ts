// tslint:disable:max-line-length

import * as braintree from "braintree"; //this is the node package

export class BraintreeServer {

  private query: any;
  private nonce: string;
  private amount: number;
  private transactionId: string;
  private customerId: string;

  private gateway: braintree.BraintreeGateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "YOUR MERCHANT ID",
    publicKey: "YOUR PUBLIC KEY",
    privateKey: "YOUR PRIVATE KEY"
  });

  private TRANSACTION_SUCCESS_STATUSES: Array<any> = [
    braintree.Transaction.Status.Authorizing,
    braintree.Transaction.Status.Authorized,
    braintree.Transaction.Status.Settled,
    braintree.Transaction.Status.Settling,
    braintree.Transaction.Status.SettlementConfirmed,
    braintree.Transaction.Status.SettlementPending,
    braintree.Transaction.Status.SubmittedForSettlement
  ];

  constructor(query: any, gateway: any) {
    this.query = query;
    this.gateway = gateway;
    this.customerId = (this.query.customerId || (this.query.data && this.query.data.customerId) || (this.query.data.customer && this.query.data.customer.customerId));    
    this.nonce = (this.query.nonce || (this.query.data && this.query.data.nonce) || (this.query.data.transaction && this.query.data.transaction.nonce));
    this.amount = (this.query.amount || (this.query.data && this.query.data.amount) || (this.query.data.transaction && this.query.data.transaction.amount));
    this.transactionId = (this.query.transactionId || (this.query.data && this.query.data.transactionId) || (this.query.data.transaction && this.query.data.transaction.transactionId));
  }

  // wrap almost any function in a Promise
  private async asyncIt(call: any): Promise<any> {
    try {
      return new Promise((resolve, reject) => {
          try {
              call((error, result) => {
                  if (error) {
                      reject(error);
                  }
                  resolve(result);
              });
          } catch (err) {
              reject(err);
          }
      });
    } catch (e) {
        return e;
    }
  }

  private formatErrors = async (errors): Promise<string> => {
    let formattedErrors!: string;

    for (let i in errors) { 
      if (errors.hasOwnProperty(i)) {
        formattedErrors = "Error: " + errors[i].code + ": " + errors[i].message + "\n";
      }
    }
    return formattedErrors;
  }

  private createResultObject = async (transaction: braintree.transaction.result): Promise<object>  => {
    const status: string = transaction.status;

    try {
      if (this.TRANSACTION_SUCCESS_STATUSES.indexOf(status) !== -1) {
        return {
          success: true,
          message: `Your transaction has been successfully processed.`
        };
      } else {
        return {
          success: false,
          message: `Transaction Failed with a status of: ` + status + `.`
        };
      }

    } catch (err) {
      throw err;
    }
  }

  public getClientToken = async () => {
    try {
      if (this.customerId) {
        return await this.asyncIt(cb => this.gateway.clientToken.generate({
          customerId: this.customerId
        }, cb)).then((result: string) => {
          return result;
        });
      } else {
        throw Error("Please pass a clientId on the query string or in the request body")
      }
    } catch (err) {
      return err;
    }
  }

  public createTransaction = async () => {
    console.log("starting createTransaction");
    try {
      if(this.nonce && this.amount) {
        return await this.asyncIt(cb => this.gateway.transaction.sale({
          amount: this.amount,
          paymentMethodNonce: this.nonce,
          options: {
            submitForSettlement: true,
            storeInVaultOnSuccess: true,
          }
        }, cb)).then(async (result: braintree.transaction.result) => {
          if(result.success || result.transaction) {
            this.transactionId = result.transaction.id;
            const transaction: any = await this.findTransaction();
            if (!transaction.result.success) {
              return Error(transaction.result.message);
            } else {
              return transaction;
            }
          } else {
            const transactionErrors: any = result.errors.deepErrors();
            const formattedError: string = await this.formatErrors(transactionErrors);
            return Error(formattedError);
          }
        });
      } else {
        throw Error("Please pass the payment nonce AND amount in the query string or in the request body");
      }
    } catch (err) {
      console.log("createTransaction error ", - err);
      return err;
    }
  }

  public findTransaction = async (): Promise<object> => {
    console.log("starting findTransaction");
    try {
      if(this.transactionId) {
        return await this.asyncIt(cb => this.gateway.transaction.find(this.transactionId, cb)).then(async (transaction: braintree.transaction.result) => {
          const result: object = await this.createResultObject(transaction);
          return { transaction: transaction, result: result };
        });
      } else {
        throw Error("Please pass the payment nonce AND amount in the query string or in the request body");
      }
    } catch (err) {
        throw err;
    }
  }

}




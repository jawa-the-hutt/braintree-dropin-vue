import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';


@Component
export default class BraintreeModel extends Vue  {

  // or alternatively, use something from your Vuex store
  private braintreeBaseURL:  string = ``;  //  your server's URL

  public getToken = async (clientId: string): Promise<string> => {
    return await axios
      .get(this.braintreeBaseURL + `Token/getClientToken?customerId=` + clientId )
        .then((response) => {
          return response.data.clientToken;
        }).catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            // console.log(error.response.data);
            // console.log(error.response.status);
            // console.log(error.response.headers);
            const data = error.response.data;
            throw data;
          } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
          } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
          }
          console.log(error.config);
        });
      }

  public createTransaction = async (nonce: string, amount: number): Promise<string> => {
    return await axios
      .post(this.braintreeBaseURL + `Transaction/createTransaction`, { nonce, amount })
        .then((response) => {
          return response.data;
        }).catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            // console.log(error.response.data);
            // console.log(error.response.status);
            // console.log(error.response.headers);
            const data = error.response.data;
            if (data.message) {
              throw data.message;
            } else {
              throw data;
            }
          } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
          } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
          }
          console.log(error.config);
        });
  }
}

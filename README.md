# pagopa-checkout-be-mock

**Table of contents**
 * [Prerequisites](#prerequisites)
   * [Environment variables](#environment-variables)
 * [Running locally](#running-locally)
   * [Running with docker and docker-compose](#running-with-docker-and-docker-compose)
   * [Running without docker](#running-without-docker)

Mock of backend services used by pagopa Checkout.

## Prerequisites

 * [nodejs](http://nodejs.org)
 * [docker](https://www.docker.com) (optional, recommended)

### Environment variables

This mock uses the following environment variables:

| Name                             | Description                                                                       | Required | Default value |
|----------------------------------|-----------------------------------------------------------------------------------|----------|---------------|
| PAGOPA_FUNCTIONS_CHECKOUT_HOST   | (†) Host of pagoPA functions supporting pagoPA Checkout backend                   | Yes      | N/A           |
| PAGOPA_FUNCTIONS_CHECKOUT_PORT   | (†) Port of pagoPA functions supporting pagoPA Checkout backend                   | Yes      | N/A           |
| ENDPOINT_DELAY                   | Delay time in milliseconds applied to every endpoint                              | No       | 0             |
| CHECK_STATUS_ADDITIONAL_ATTEMPTS | (‡) Additional attempts required when calling `pagopa-proxy` payment status check | No       | 0             |

(†): please refer to [this repo](https://github.com/pagopa/pagopa-functions-checkout)
(‡) Note that the total time to successfully complete a payment status check is `(ACTIVATION_STATUS_ADDITIONAL_ATTEMPTS + 1) * ENDPOINT_DELAY`

You must set up environment variables by creating a `.env` file. You can use the provided example file as such to get default values for these variables:

```shell
$ cp env.example .env
```


## Running locally

You can run the mock either with or without docker-compose.

### Running with docker and docker-compose

Build the package and the docker image with

```shell
$ yarn build && docker-compose build
```

then

```shell
$ docker-compose up
```

in the repo root.

### Running without docker
Build the package with

```shell
$ yarn build
```

then, if for some reason you don't want to run the project with docker, you can just use:

```shell
$ yarn start
```

## Executing error flows

If you invoke the `/checkout/payments/v1/payment-requests/:rptId` endpoint with an RPT id of the format `777777777773020167237496700xx` where `xx` is one of the flow codes below, you can control the failure mode of different handlers called from Checkout frontend during the payment process.

This is currently implemented via a `mockFlow` cookie which is returned from the endpoint with the flow name as the value.

| Flow name                                | Flow code |
|------------------------------------------|-----------|
| OK                                       | 00        |
| FAIL_VERIFY_400                          | 01        |
| FAIL_VERIFY_424_INT_PA_IRRAGGIUNGIBILE   | 02        |
| FAIL_VERIFY_424_PAA_PAGAMENTO_IN_CORSO   | 03        |
| FAIL_VERIFY_424_PPT_SINTASSI_XSD         | 04        |
| FAIL_VERIFY_424_PPT_SYSTEM_ERROR         | 05        |
| FAIL_VERIFY_500                          | 06        |
| FAIL_ACTIVATE_400                        | 07        |
| FAIL_ACTIVATE_424_INT_PA_IRRAGGIUNGIBILE | 08        |
| FAIL_ACTIVATE_424_PAA_PAGAMENTO_IN_CORSO | 09        |
| FAIL_ACTIVATE_424_PPT_SINTASSI_XSD       | 10        |
| FAIL_ACTIVATE_424_PPT_SYSTEM_ERROR       | 11        |
| FAIL_ACTIVATE_500                        | 12        |
| FAIL_PAYMENT_STATUS_400                  | 13        |
| FAIL_PAYMENT_STATUS_404                  | 14        |
| FAIL_PAYMENT_STATUS_424                  | 15        |
| FAIL_PAYMENT_STATUS_500                  | 16        |
| ANSWER_ADD_WALLET_STATUS_201             | 17        |
| FAIL_ADD_WALLET_STATUS_403               | 18        |
| FAIL_ADD_WALLET_STATUS_404               | 19        |
| ANSWER_START_SESSION_STATUS_201          | 20        |
| FAIL_START_SESSION_STATUS_401            | 21        |
| FAIL_START_SESSION_STATUS_403            | 22        |
| FAIL_START_SESSION_STATUS_404            | 23        |
| FAIL_START_SESSION_STATUS_422            | 24        |
| FAIL_START_SESSION_STATUS_500            | 25        |
| FAIL_APPROVE_TERMS_STATUS_404            | 26        |
| FAIL_APPROVE_TERMS_STATUS_422            | 27        |
| FAIL_APPROVE_TERMS_STATUS_500            | 28        |
| ANSWER_PAY_3DS2_STATUS_201               | 29        |
| FAIL_PAY_3DS2_STATUS_401                 | 30        |
| FAIL_PAY_3DS2_STATUS_403                 | 31        |
| FAIL_PAY_3DS2_STATUS_404                 | 32        |
| FAIL_CHECK_STATUS_404                    | 33        |
| FAIL_CHECK_STATUS_422                    | 34        |
| FAIL_CHECK_STATUS_500                    | 35        |

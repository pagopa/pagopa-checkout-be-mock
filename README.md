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

| Flow name                                             | Flow code |
|-------------------------------------------------------|-----------|
| OK                                                    | 00        |
| OK_ENABLE_PERSISTENCE                                 | 01        |
| ANSWER_VERIFY_NO_ENTE_BENEFICIARIO                    | 02        |
| FAIL_VERIFY_400_PPT_STAZIONE_INT_PA_SCONOSCIUTA       | 03        |
| FAIL_VERIFY_404_PPT_DOMINIO_SCONOSCIUTO               | 04        |
| FAIL_VERIFY_409_PPT_PAGAMENTO_IN_CORSO                | 05        |
| FAIL_VERIFY_502_PPT_SINTASSI_XSD                      | 06        |
| FAIL_VERIFY_503_PPT_STAZIONE_INT_PA_ERRORE_RESPONSE   | 07        |
| FAIL_VERIFY_504_PPT_STAZIONE_INT_PA_TIMEOUT           | 08        |
| FAIL_VERIFY_500                                       | 09        |
| FAIL_ACTIVATE_400_PPT_STAZIONE_INT_PA_SCONOSCIUTA     | 10        |
| FAIL_ACTIVATE_404_PPT_DOMINIO_SCONOSCIUTO             | 11        |
| FAIL_ACTIVATE_409_PPT_PAGAMENTO_IN_CORSO              | 12        |
| FAIL_ACTIVATE_502_PPT_SINTASSI_XSD                    | 13        |
| FAIL_ACTIVATE_503_PPT_STAZIONE_INT_PA_ERRORE_RESPONSE | 14        |
| FAIL_ACTIVATE_504_PPT_STAZIONE_INT_PA_TIMEOUT         | 15        |
| FAIL_ACTIVATE_500                                     | 16        |
| FAIL_PAYMENT_STATUS_400                               | 17        |
| FAIL_PAYMENT_STATUS_404                               | 18        |
| FAIL_PAYMENT_STATUS_502                               | 19        |
| FAIL_PAYMENT_STATUS_500                               | 20        |
| ANSWER_ADD_WALLET_STATUS_201                          | 21        |
| FAIL_ADD_WALLET_STATUS_403                            | 22        |
| FAIL_ADD_WALLET_STATUS_404                            | 23        |
| ANSWER_START_SESSION_STATUS_201                       | 24        |
| FAIL_START_SESSION_STATUS_401                         | 25        |
| FAIL_START_SESSION_STATUS_403                         | 26        |
| FAIL_START_SESSION_STATUS_404                         | 27        |
| FAIL_START_SESSION_STATUS_422                         | 28        |
| FAIL_START_SESSION_STATUS_500                         | 29        |
| FAIL_APPROVE_TERMS_STATUS_404                         | 30        |
| FAIL_APPROVE_TERMS_STATUS_422                         | 31        |
| FAIL_APPROVE_TERMS_STATUS_500                         | 32        |
| ANSWER_PAY_3DS2_STATUS_201                            | 33        |
| FAIL_PAY_3DS2_STATUS_401                              | 34        |
| FAIL_PAY_3DS2_STATUS_403                              | 35        |
| FAIL_PAY_3DS2_STATUS_404                              | 36        |
| FAIL_CHECK_STATUS_404                                 | 37        |
| FAIL_CHECK_STATUS_422                                 | 38        |
| FAIL_CHECK_STATUS_500                                 | 39        |
| NODO_TAKEN_IN_CHARGE                                  | 40        |

## XPAY Authorization Error Flow
The XPAY authorization polling endpoint `/request-payments/xpay/:requestId` require a requestId as query param as UUID (YXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX). To enforce the success case the first character must be a `0`. It will returns an error otherwise (404 - Not Found).
To simulate the polling process all requests with a `requestId` that starts with `01` will require two polling attempt to obtain the success case.

| Case                        | Code                                  |
|-----------------------------|---------------------------------------|
| Success                     | 0XXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX  |
| Success (2 retry attempt)   | 01XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX  |
| Not found                   | XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX  |

## Vpos Authorization Error Flow
The Vpos authorization polling endpoint `/request-payments/vpos/:requestId` require a requestId as query param as UUID (YXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX). 

The first two UUID characters are used to simulate one specific flow as follows:

| Case                  | Code                                  | Description                                                                   |
|-----------------------|---------------------------------------|-------------------------------------------------------------------------------|
| DIRECT_AUTH           | 00XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX  | Transaction is authorized on the first call                                   |
| METHOD_AUTH           | 01XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX  | Transaction is authorized after method call                                   |
| CHALLENGE_AUTH        | 02XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX  | Transaction is authorized after challenge call                                |
| METHOD_CHALLENGE_AUTH | 03XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX  | Transaction is authorized after method and challenge call                     |
| DIRECT_DENY           | 04XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX  | Transaction is denied on the first call                                       |
| METHOD_DENY           | 05XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX  | Transaction is denied after method call                                       |
| CHALLENGE_DENY        | 06XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX  | Transaction is denied after challenge call                                    |
| METHOD_CHALLENGE_DENY | 07XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX  | Transaction is denied after a successfull method call and a KO challenge call |
| PAYMENT_NOT_FOUND     | 08XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX  | Transaction will return 404 not found error on each call                      |

Each call return a 404 not found on the first two invocations and then return the expected value for let simulate front end request polling functionality.

Here a brief explanation of the simulated flows:
1) DIRECT_AUTH : payment is authorized on the first step
2) METHOD_AUTH : payment flow is redirect to method phase and then authorized state
3) CHALLENGE_AUTH : payment flow is redirect to challenge phase and then authorized state
4) METHOD_CHALLENGE_AUTH : payment flow is redirect to method phase, then to challenge phase and finally to authorized state
5) DIRECT_DENY : payment authorization is denied on the first step
6) METHOD_DENY : payment authorization is redirect to method phase and then denied state
7) CHALLENGE_DENY : payment authorization is redirect to challenge phase and then denied state
8) METHOD_CHALLENGE_DENY : payment authorization is redirect to method phase, then challenge phase and finally to denied state
9) PAYMENT_NOT_FOUND : each call will return 404 not found error


## Ecommerce activation Error Flow
The ecommerce transaction activation endpoint `/checkout/ecommerce/v1/transactions` require a body with ith a cartload of notices to pay. To enforce the success case the last two characters of the first rptId into list are different from [`11`,`12`,`13`,`15`].
The list of possible flow case:

| Case                                          | RptID                           |
|-----------------------------------------------|---------------------------------|
| FAIL_ACTIVATE_502_PPT_SINTASSI_XSD            | XXXXXXXXXXXXXXXXXXXXXXXXXXX13   |
| FAIL_ACTIVATE_504_PPT_STAZIONE_INT_PA_TIMEOUT | XXXXXXXXXXXXXXXXXXXXXXXXXXX15   |
| FAIL_ACTIVATE_409_PPT_PAGAMENTO_IN_CORSO      | XXXXXXXXXXXXXXXXXXXXXXXXXXX12   |
| FAIL_ACTIVATE_404_PPT_DOMINIO_SCONOSCIUTO     | XXXXXXXXXXXXXXXXXXXXXXXXXXX11   |
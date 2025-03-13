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
| ENDPOINT_DELAY                   | Delay time in milliseconds applied to every endpoint                              | No       | 0             |
| CHECK_STATUS_ADDITIONAL_ATTEMPTS | (‡) Additional attempts required when calling `pagopa-proxy` payment status check | No       | 0             |
| NPG_API_KEY                      | API Key for NPG                                                                   | Yes      | N/A           |
| PSP_API_KEY                      | API Key for psp used during NPG confirm payment method                            | Yes      | N/A           |

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
| FAIL_VERIFY_400_INVALID_INPUT                         | 03        |
| FAIL_VERIFY_404_PPT_STAZIONE_INT_PA_SCONOSCIUTA       | 04        |
| FAIL_VERIFY_409_PPT_PAGAMENTO_IN_CORSO                | 05        |
| FAIL_VERIFY_502_PPT_PSP_SCONOSCIUTO                   | 06        |
| FAIL_VERIFY_404_PAA_PAGAMENTO_SCONOSCIUTO             | 07        |
| FAIL_VERIFY_503_PPT_STAZIONE_INT_PA_TIMEOUT           | 08        |
| FAIL_VERIFY_502_GENERIC_ERROR                         | 09        |
| FAIL_ACTIVATE_400_INVALID_INPUT                       | 10        |
| FAIL_ACTIVATE_404_PPT_STAZIONE_INT_PA_SCONOSCIUTA     | 11        |
| FAIL_ACTIVATE_409_PPT_PAGAMENTO_IN_CORSO              | 12        |
| FAIL_ACTIVATE_502_PPT_PSP_SCONOSCIUTO                 | 13        |
| FAIL_ACTIVATE_404_PAA_PAGAMENTO_SCONOSCIUTO           | 14        |
| FAIL_ACTIVATE_504_PPT_STAZIONE_INT_PA_TIMEOUT         | 15        |
| FAIL_ACTIVATE_502_GENERIC_ERROR                       | 16        |
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
| FAIL_AUTH_REQUEST_TRANSACTION_ID_NOT_FOUND            | 41        |
| FAIL_AUTH_REQUEST_TRANSACTION_ID_ALREADY_PROCESSED    | 42        |
| FAIL_AUTH_REQUEST_TRANSACTION_ID_ALREADY_PROCESSED    | 74        |
| FAIL_ACTIVATE_503_PPT_STAZIONE_INT_PA_ERRORE_RESPONSE | 75        |
| NOT_FOUND_CALCULATE_FEE                               | 76        |
| FAIL_ACTIVATE_502_PPT_WISP_SESSIONE_SCONOSCIUTA       | 77        |

## XPAY Authorization Error Flow
The XPAY authorization polling endpoint `/xpay/authorizations/:paymentAuthorizationId` require a paymentAuthorizationId as query param as UUID (YXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX). To enforce the success case the first character must be a `0`. It will returns an error otherwise (404 - Not Found).
To simulate the polling process all requests with a `paymentAuthorizationId` that starts with `01` will require two polling attempt to obtain the success case.

| Case                        | Code                                  |
|-----------------------------|---------------------------------------|
| Success                     | 0XXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX  |
| Success (2 retry attempt)   | 01XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX  |
| Not found                   | XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX  |

## Vpos Authorization Error Flow
The Vpos authorization polling endpoint `/xpay/authorizations/vpos/:paymentAuthorizationId` require a paymentAuthorizationId as query param as UUID (YXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX). 

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
The ecommerce transaction activation endpoint `/checkout/ecommerce/v1/transactions` require a body with a list of notices to pay. To enforce the success case, the last two characters of the first rptId in the list must be different from [`11`,`12`,`13`,`15`,`75`,`76`]. Also, if the rptId ends in `41` or `42` the success case will be invoked by entering the value of FAIL_AUTH_REQUEST_TRANSACTION_ID_NOT_FOUND or FAIL_AUTH_REQUEST_TRANSACTION_ID_ALREADY_PROCESSED in the mockFlow cookies to simulate the error in auth request. if the rptId ends in `74`the success case will be invoked by entering the value of FAIL_AUTH_REQUEST_5XX.
In the remaining success cases, the cookie will be valued with OK to simulate a positive auth-request case.
To generate transaction ids with prefixes useful for xpay and vpos calls, the suffix of the RPTID must be one of these [`43`,`44`,`45`,`46`,`47`,`48`,`49`,`50`,`51`,`52`,`53`,`54`]
The list of possible flow cases:

| Case                                                          | RptID                         | COOKIE MOCK FLOW                                   | Generated transactionId              |
|---------------------------------------------------------------|-------------------------------|----------------------------------------------------|--------------------------------------|
| FAIL_ACTIVATE_502_PPT_SINTASSI_XSD                            | XXXXXXXXXXXXXXXXXXXXXXXXXXX13 | (not set)                                          | (no)                                 |
| FAIL_ACTIVATE_504_PPT_STAZIONE_INT_PA_TIMEOUT                 | XXXXXXXXXXXXXXXXXXXXXXXXXXX15 | (not set)                                          | (no)                                 |
| FAIL_ACTIVATE_409_PPT_PAGAMENTO_IN_CORSO                      | XXXXXXXXXXXXXXXXXXXXXXXXXXX12 | (not set)                                          | (no)                                 |
| FAIL_ACTIVATE_404_PPT_DOMINIO_SCONOSCIUTO                     | XXXXXXXXXXXXXXXXXXXXXXXXXXX11 | (not set)                                          | (no)                                 |
| FAIL_ACTIVATE_502_PPT_WISP_SESSIONE_SCONOSCIUTA               | XXXXXXXXXXXXXXXXXXXXXXXXXXX76 | (not set)                                          | (no)                                 |
| FAIL_AUTH_REQUEST_TRANSACTION_ID_NOT_FOUND                    | XXXXXXXXXXXXXXXXXXXXXXXXXXX41 | FAIL_AUTH_REQUEST_TRANSACTION_ID_NOT_FOUND         | (generic UUID)                       |
| FAIL_AUTH_REQUEST_TRANSACTION_ID_ALREADY_PROCESSED            | XXXXXXXXXXXXXXXXXXXXXXXXXXX42 | FAIL_AUTH_REQUEST_TRANSACTION_ID_ALREADY_PROCESSED | (generic UUID)                       |
| OK                                                            | XXXXXXXXXXXXXXXXXXXXXXXXXXXXX | OK                                                 | (generic UUID)                       |
| ACTIVATE_XPAY_TRANSACTION_ID_WITH_PREFIX_SUCCESS              | XXXXXXXXXXXXXXXXXXXXXXXXXXX43 | (not set)                                          | 0XXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX |
| ACTIVATE_XPAY_TRANSACTION_ID_WITH_PREFIX_SUCCESS_2_RETRY      | XXXXXXXXXXXXXXXXXXXXXXXXXXX44 | (not set)                                          | 01XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX |
| ACTIVATE_XPAY_TRANSACTION_ID_WITH_PREFIX_NOT_FOUND            | XXXXXXXXXXXXXXXXXXXXXXXXXXX45 | (not set)                                          | (generic UUID)                       |
| ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_DIRECT_AUTH           | XXXXXXXXXXXXXXXXXXXXXXXXXXX46 | (not set)                                          | 00XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX |
| ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_METHOD_AUTH           | XXXXXXXXXXXXXXXXXXXXXXXXXXX47 | (not set)                                          | 01XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX |
| ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_CHALLENGE_AUTH        | XXXXXXXXXXXXXXXXXXXXXXXXXXX48 | (not set)                                          | 02XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX |
| ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_METHOD_CHALLENGE_AUTH | XXXXXXXXXXXXXXXXXXXXXXXXXXX49 | (not set)                                          | 03XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX |
| ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_DIRECT_DENY           | XXXXXXXXXXXXXXXXXXXXXXXXXXX50 | (not set)                                          | 04XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX |
| ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_METHOD_DENY           | XXXXXXXXXXXXXXXXXXXXXXXXXXX51 | (not set)                                          | 05XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX |
| ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_CHALLENGE_DENY        | XXXXXXXXXXXXXXXXXXXXXXXXXXX52 | (not set)                                          | 06XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX |
| ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_METHOD_CHALLENGE_DENY | XXXXXXXXXXXXXXXXXXXXXXXXXXX53 | (not set)                                          | 07XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX |
| ACTIVATE_VPOS_TRASACTION_ID_WITH_PREFIX_PAYMENT_NOT_FOUND     | XXXXXXXXXXXXXXXXXXXXXXXXXXX54 | (not set)                                          | 08XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX |
| FAIL_AUTH_REQUEST_5XX                                         | XXXXXXXXXXXXXXXXXXXXXXXXXXX74 | FAIL_AUTH_REQUEST_5XX                              | (generic UUID)                       |

## Ecommerce calculate fees Flow
The ecommerce transaction activation endpoint `/checkout/ecommerce/v1/transactions` also drive the calculate fee result, since that api is empty of any information about `transactionId` or `rptId`. So using specific suffix for rptId in the activation post, it will success and we will sure to obtain specific result from calculate fee. The calculate fee api returns the `BundleOption` object. By its boolean field `belowThreshold` the checkout frontend will show different disclaimer. The suffix of the RPTID must be one of these [`55`,`56`,`57`]. `55` will drive for a response with `belowThreshold` in `BundleOption` as false. `56` will drive for a response with `belowThreshold` in `BundleOption` as true. To make the call fail use suffix `57`. The default behaviour (all other rptId) is the `belowThreshold` in `BundleOption` as true. Everyone of this suffix put a specific cookie value in the browser.
The ecommerce transaction fee/calculate endpoint `/ecommerce/checkout/v1/fee/calculate` is driven by the following cookie mockFlow values:

| COOKIE MOCK FLOW                                   | HttpStatus                            | RptId Suffix |
|----------------------------------------------------|---------------------------------------|--------------|
| OK_ABOVETHRESHOLD_CALUCLATE_FEE                    | 200 success case belowThreshold false | 55           |
| OK_BELOWTHRESHOLD_CALUCLATE_FEE                    | 200 success case belowThreshold true  | 56           |
| FAIL_CALCULATE_FEE                                 | 400 bad request                       | 57           |  
| NOT_FOUND_CALCULATE_FEE                            | 404 not fount                         | 76           |  

## Ecommerce transaction user cancel Flow
The ecommerce transaction activation endpoint `/checkout/ecommerce/v1/transactions` also drive the transaction cancel user result. So using specific suffix for rptId in the activation post, it will success and we will sure to obtain specific result from transaction user cancel api. The suffix of the RPTID must be one of these [`58`,`59`,`60`]. `58` will drive delete transaction response with success result and set flow cookie OK_TRANSACTION_USER_CANCEL. `59` will drive for a delete transaction error with 404 httpStatus and set cookie flow ID_NOT_FOUND_TRANSACTION_USER_CANCEL. `60` will drive for a delete transaction error with 500 httpStatus and set cookie flow INTERNAL_SERVER_ERROR_TRANSACTION_USER_CANCEL.
The ecommerce transaction user cancel  endpoint `/ecommerce/checkout/v1/transactions/:transactionId` is driven by the following cookie mockFlow values:

| COOKIE MOCK FLOW                                   | HttpStatus                            | RptId Suffix |
|----------------------------------------------------|---------------------------------------|--------------|
| OK_TRANSACTION_USER_CANCEL                         | 202 accepted                          | 58           |
| ID_NOT_FOUND_TRANSACTION_USER_CANCEL               | 404 not found                         | 59           |
| INTERNAL_SERVER_ERROR_TRANSACTION_USER_CANCEL      | 500 Internal server error             | 60           |  

## Ecommerce auth-requests Error Flow
The ecommerce transaction auth-requests endpoint `/checkout/ecommerce/v1/transactions/:transactionId/auth-requests` is driven by the following cookie mockFlow values:

| COOKIE MOCK FLOW                                   | HttpStatus                            |
|----------------------------------------------------|---------------------------------------|
| OK                                                 | 200 success case                      |
| FAIL_AUTH_REQUEST_TRANSACTION_ID_NOT_FOUND         | 404 transactionId not fuond           |
| FAIL_AUTH_REQUEST_TRANSACTION_ID_ALREADY_PROCESSED | 409 transaction already processed     |   
| FAIL_AUTH_REQUEST_5XX                              | 502 bad gateway                       |   

## Ecommerce final state flow
The ecommerce transaction get transaction endpoint `/checkout/ecommerce/v1/transactions/:transactionId` is driven by the following cookie mockFlow values:

| COOKIE MOCK FLOW                                   | RptId Suffix |
|----------------------------------------------------|--------------|
| NOTIFICATION_REQUESTED                             | 61           |
| NOTIFICATION_ERROR                                 | 62           |
| NOTIFIED_KO                                        | 63           |  
| REFUNDED                                           | 64           |  
| REFUND_REQUESTED                                   | 65           |  
| REFUND_ERROR                                       | 66           |  
| CLOSURE_ERROR                                      | 67           |  
| EXPIRED                                            | 68           |  
| EXPIRED_NOT_AUTHORIZED                             | 69           |  
| CANCELED                                           | 70           |  
| CANCELLATION_EXPIRED                               | 71           |  
| UNAUTHORIZED                                       | 72           |  

For some state it is important to evaluate also the following properties:
 
 - Gateway: VPOS or XPAY
 - Error code: dependant from Gateway (see next two tables)
 - Send payment result outcome 

also other position of teh rpt id become significant to drive this properties.

The last two digits drive the final state (as said from 61 to 72)
They follow the three digits that drive the gateway result (from 000 to 100)
They follow 1 digit for gateway: 1=XPAY and 2=VPOS  
It follows 1 digit for send payment result outcome: 1=OK 2=KO

This is the schema of an RPT id starting with 30201672374

| RPT_ID FIRST 11 DIGITS                             | SEND PAYMENT RESULT OUTCOME DIGIT   | GATEWAY DIGIT  | GATEWAY CODE RESULT 3 DIGITS | STATUS DIGITS |
|----------------------------------------------------|-------------------------------------|----------------|------------------------------|---------------|
| 30201672374 (NOT FIXED)                            | 1 = OK                              | 1 = XPAY       | XXX (dependant from gateway) | (as listed)   |
|                                                    | 2 = KO                              | 2 = VPOS       |                              |               |

The possible error codes for XPAY are

| RESULT CODE XPAY                                   | ERROR CODE   | RTPID-DIGITS |
|----------------------------------------------------|--------------|--------------|
| SUCCESS                                            | 0            | 000          |
| INCORRECT_PARAMS                                   | 1            | 001          |
| NOT_FOUND                                          | 2            | 002          |
| INCORRECT_MAC                                      | 3            | 003          |
| MAC_NOT_PRESENT                                    | 4            | 004          |
| TIMEOUT                                            | 5            | 005          |
| INVALID_APIKEY                                     | 7            | 007          |
| INVALID_CONTRACT                                   | 8            | 008          |
| DUPLICATE_TRANSACTION                              | 9            | 009          |
| INVALID_GROUP                                      | 12           | 012          |
| TRANSACTION_NOT_FOUND                              | 13           | 013          |
| EXPIRED_CARD                                       | 14           | 014          |
| CARD_BRAND_NOT_PERM                                | 15           | 015          |
| INVALID_STATUS                                     | 16           | 016          |
| EXCESSIVE_AMOUNT                                   | 17           | 017          |
| RETRY_EXHAUSTED                                    | 18           | 018          |
| REFUSED_PAYMENT                                    | 19           | 019          |
| CANCELED_3DS_AUTH                                  | 20           | 020          |
| FAILED_3DS_AUTH                                    | 21           | 021          |
| INVALID_CARD                                       | 22           | 022          |
| INVALID_MAC_ALIAS                                  | 50           | 050          |
| KO_RETRIABLE                                       | 96           | 096          |
| GENERIC_ERROR                                      | 97           | 097          |
| UNAVAILABLE_METHOD                                 | 98           | 098          |
| FORBIDDEN_OPERATION                                | 99           | 099          |
| INTERNAL_ERROR                                     | 100          | 100          |


The possible error codes for VPOS are

| RESULT CODE VPOS                                   | ERROR CODE   | RTPID-DIGITS |
|----------------------------------------------------|--------------|--------------|
| SUCCESS                                            | 00           | 000          |
| ORDER_OR_REQREFNUM_NOT_FOUND                       | 01           | 001          |
| REQREFNUM_INVALID                                  | 02           | 002          |
| INCORRECT_FORMAT                                   | 03           | 003          |
| INCORRECT_MAC_OR_TIMESTAMP                         | 04           | 004          |
| INCORRECT_DATE                                     | 05           | 005          |
| UNKNOWN_ERROR                                      | 06           | 006          |
| TRANSACTION_ID_NOT_FOUND                           | 07           | 007          |
| OPERATOR_NOT_FOUND                                 | 08           | 008          |
| TRANSACTION_ID_NOT_CONSISTENT                      | 09           | 009          |
| EXCEEDING_AMOUNT                                   | 10           | 010          |
| INCORRECT_STATUS                                   | 11           | 011          |
| CIRCUIT_DISABLED                                   | 12           | 012          |
| DUPLICATED_ORDER                                   | 13           | 013          |
| UNSUPPORTED_CURRENCY                               | 16           | 016          |
| UNSUPPORTED_EXPONENT                               | 17           | 017          |
| REDIRECTION_3DS1                                   | 20           | 020          |
| TIMEOUT                                            | 21           | 021          |
| METHOD_REQUESTED                                   | 25           | 025          |
| CHALLENGE_REQUESTED                                | 26           | 026          |
| PAYMENT_INSTRUMENT_NOT_ACCEPTED                    | 35           | 035          |
| MISSING_CVV2                                       | 37           | 037          |
| INVALID_PAN                                        | 38           | 038          |
| XML_EMPTY                                          | 40           | 040          |
| XML_NOT_PARSABLE                                   | 41           | 041          |
| INSTALLMENTS_NOT_AVAILABLE                         | 50           | 050          |
| INSTALLMENT_NUMBER_OUT_OF_BOUNDS                   | 51           | 051          |
| APPLICATION_ERROR                                  | 98           | 098          |
| TRANSACTION_FAILED                                 | 99           | 099          |


All values for all of these propertiest out of the ranges listed for each of them will be interpreted as UNDEFINED

Example: Rpt id to drive Send payment result OK gateway VPOS result code DUPLICATED_ORDER and final status UNAUTHORIZED

30201672374 (first 11 digits)
1 (send payment result OK)
2 (VPOS)
013 (DUPLICATED ORDER)
72 (UNAUTHORIZED)
RPT ID is 302016723741201372

Example: Rpt id to drive Send payment result UNDEFINED gateway XPAY result code TIMEOUT and final status EXPIRED

30201672374 (first 11 digits)
0 (each values different from1 or 2 are ok) (send payment result UNDEFINED)
1 (XPAY)
005 (TIMEOUT)
68 (EXPIRED)
RPT ID is 302016723740100568

## Ecommerce waiting send payment result transaction status CLOSED
| COOKIE MOCK FLOW                                   | RptId Suffix |
|----------------------------------------------------|--------------|
| CLOSED                                             | 73           |

## Authorization mock flow
The authentication endpoints are driven to fail by using the following rptId suffix for different failure case

| COOKIE MOCK FLOW                                   | RptId Suffix |
|----------------------------------------------------|--------------|
| FAIL_POST_AUTH_TOKEN                               | 78           |
| FAIL_POST_AUTH_TOKEN_503                           | 79           |
| FAIL_POST_AUTH_TOKEN_504                           | 80           |
| FAIL_POST_AUTH_TOKEN_429                           | 81           |
| FAIL_GET_USERS_401                                 | 82           |
| FAIL_GET_USERS_500                                 | 83           |
| FAIL_UNAUTHORIZED_401                              | 84           |
| FAIL_UNAUTHORIZED_401_PAYMENT_REQUESTS             | 85           |
| FAIL_LOGOUT_400                                    | 86           |
| FAIL_LOGOUT_500                                    | 87           |

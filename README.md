# pagopa-checkout-backend-mock

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

| Name                             | Description                                                           | Required | Default value |
|----------------------------------|-----------------------------------------------------------------------|----------|---------------|
| ENDPOINT_DELAY                   | Delay time in milliseconds applied to every endpoint                  | No       | 0             |
| CHECK_STATUS_ADDITIONAL_ATTEMPTS | Additional attempts made when calling PM transaction status check (†) | No       | 0             |

(†) Note that the total time to successfully complete a transaction status check is `(CHECK_STATUS_ADDITIONAL_ATTEMPTS + 2) * ENDPOINT_DELAY`

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

If you invoke the `/checkout/payments/v1/payment-requests/:rptId` with an RPT id of the format `777777777773020167237496700xx` where `xx` is one of the flow codes below, you can control the failure mode of different handlers called from Checkout frontend during the payment process.

This is currently implemented via a `mockFlow` cookie which is returned from the endpoint with the flow name as the value.

| Flow name                       | Flow code |
|---------------------------------|-----------|
| OK                              | 00        |
| FAIL_VERIFY_400                 | 01        |
| FAIL_VERIFY_424                 | 02        |
| FAIL_VERIFY_500                 | 03        |
| FAIL_ACTIVATE_400               | 04        |
| FAIL_ACTIVATE_424               | 05        |
| FAIL_ACTIVATE_500               | 06        |
| FAIL_PAYMENT_STATUS_404         | 07        |
| FAIL_PAYMENT_STATUS_424         | 08        |
| FAIL_PAYMENT_STATUS_500         | 09        |
| ANSWER_ADD_WALLET_STATUS_201    | 10        |
| FAIL_ADD_WALLET_STATUS_403      | 11        |
| FAIL_ADD_WALLET_STATUS_404      | 12        |
| ANSWER_START_SESSION_STATUS_201 | 13        |
| FAIL_START_SESSION_STATUS_401   | 14        |
| FAIL_START_SESSION_STATUS_403   | 15        |
| FAIL_START_SESSION_STATUS_404   | 16        |
| FAIL_START_SESSION_STATUS_422   | 17        |
| FAIL_APPROVE_TERMS_STATUS_404   | 18        |
| FAIL_APPROVE_TERMS_STATUS_422   | 19        |
| FAIL_APPROVE_TERMS_STATUS_500   | 20        |
| ANSWER_PAY_3DS2_STATUS_201      | 21        |
| FAIL_PAY_3DS2_STATUS_401        | 22        |
| FAIL_PAY_3DS2_STATUS_403        | 23        |
| FAIL_PAY_3DS2_STATUS_404        | 24        |
| FAIL_CHECK_STATUS_404           | 25        |
| FAIL_CHECK_STATUS_422           | 26        |

/**
 * @deprecated pagopa-proxy with checkout has been replaced by eCommerce
 */
/* eslint-disable extra-rules/no-commented-out-code */
// import { pipe } from "fp-ts/function";
// import * as express from "express";
// import { RequestHandler } from "express";
// import * as E from "fp-ts/lib/Either";
// import * as O from "fp-ts/lib/Option";
// import * as t from "io-ts";
// import {
//   ResponseErrorForbiddenAnonymousUser,
//   ResponseErrorFromValidationErrors,
//   ResponseErrorNotFound,
//   ResponseErrorValidation,
//   ResponseSuccessJson
// } from "@pagopa/ts-commons/lib/responses";
// import { PathReporter } from "io-ts/PathReporter";
// import { PaymentResponse } from "../generated/payment_manager/PaymentResponse";
// import { sendResponseWithData, tupleWith } from "../utils/utils";
// import { TransactionResponse } from "../generated/payment_manager/TransactionResponse";
// import { IUserData } from "../constants";
// import {
//   EndpointController,
//   EndpointHandler,
//   HandlerResponseType,
//   ResponseErrorValidationFault,
//   ResponseGatewayTimeout,
//   ResponsePartyConfigurationError,
//   ResponsePaymentError,
//   ResponsePaymentStatusFaultError,
//   ResponseSuccessfulCreated,
//   ResponseUnauthorized
// } from "../utils/types";
// import {
//   ActivatePaymentT,
//   GetActivationStatusT,
//   GetPaymentInfoT
// } from "../generated/pagopa_proxy/requestTypes";
// import { RptId } from "../generated/pagopa_proxy/RptId";
// import { PaymentRequestsGetResponse } from "../generated/pagopa_proxy/PaymentRequestsGetResponse";
// import { PaymentFaultEnum } from "../generated/pagopa_proxy/PaymentFault";
// import { PaymentActivationsPostRequest } from "../generated/pagopa_proxy/PaymentActivationsPostRequest";
// import {
//   FlowCase,
//   getFlowCookie,
//   getFlowFromRptId,
//   maybeGetFlowCookie,
//   setFlowCookie
// } from "../flow";
// import { PaymentActivationsPostResponse } from "../generated/pagopa_proxy/PaymentActivationsPostResponse";
// import { PaymentActivationsGetResponse } from "../generated/pagopa_proxy/PaymentActivationsGetResponse";
// import { Pay3ds2UsingPOSTT } from "../generated/payment_manager/requestTypes";
// import { logger } from "../logger";
// import { PayRequest } from "../generated/payment_manager/PayRequest";
// import { GatewayFaultEnum } from "../generated/pagopa_proxy/GatewayFault";
// import { PartyConfigurationFaultEnum } from "../generated/pagopa_proxy/PartyConfigurationFault";
// import { PartyTimeoutFaultEnum } from "../generated/pagopa_proxy/PartyTimeoutFault";
// import { PaymentStatusFaultEnum } from "../generated/pagopa_proxy/PaymentStatusFault";
// import { ValidationFaultEnum } from "../generated/pagopa_proxy/ValidationFault";
// import { ActivationState, store } from "../store/store";

// export const paymentCheckHandler: (
//   idPayment: string,
//   userData: IUserData
// ) => RequestHandler = (idPayment: string, userData: IUserData) => async (
//   _req,
//   res
// ): Promise<void> => {
//   pipe(
//     E.right({
//       data: {
//         amount: {
//           amount: 12000,
//           currency: "EUR",
//           decimalDigits: 2
//         },
//         bolloDigitale: false,
//         detailsList: [
//           {
//             CCP: idPayment,
//             IUV: "02016723749670000",
//             codicePagatore: userData.fiscalCode,
//             enteBeneficiario: "EC_TE",
//             idDominio: "77777777777",
//             importo: 100,
//             nomePagatore: `${userData.name} ${userData.surname}`,
//             tipoPagatore: "F"
//           },
//           {
//             CCP: idPayment,
//             IUV: "02016723749670000",
//             codicePagatore: userData.fiscalCode,
//             enteBeneficiario: "Comune di Milano",
//             idDominio: "01199250158",
//             importo: 20,
//             nomePagatore: `${userData.name} ${userData.surname}`,
//             tipoPagatore: "F"
//           }
//         ],
//         fiscalCode: userData.fiscalCode,
//         iban: "IT57N0760114800000011050036",
//         id: 203436,
//         idPayment,
//         isCancelled: false,
//         origin: "WALLET_APP",
//         receiver: "EC_TE",
//         // eslint-disable-next-line sonarjs/no-duplicate-string
//         subject: "TARI/TEFA 2021",
//         urlRedirectEc:
//           "http://pagopamock.pagopa.hq/esito.php?idSession=e1283f0e673b4789a2af87fd9b4043f4"
//       }
//     }),
//     E.map(PaymentResponse.encode),
//     tupleWith(res),
//     E.fold(_ => res.send(500), sendResponseWithData)
//   );
// };

// const pay3ds2Controller: (
//   userData: IUserData,
//   flowId: FlowCase
// ) => EndpointController<Pay3ds2UsingPOSTT> = (userData, flowId) => (
//   _params
// ): HandlerResponseType<Pay3ds2UsingPOSTT> => {
//   const response: TransactionResponse = {
//     data: {
//       amount: {
//         amount: 12000,
//         currency: "EUR",
//         decimalDigits: 2
//       },
//       created: new Date("2022-01-17T15:00:20Z"),
//       description: "TARI/TEFA 2021",
//       detailsList: [
//         {
//           CCP: "d15da8f4df1b4ab6855c966044310b1a",
//           IUV: "02016723749670001",
//           codicePagatore: userData.fiscalCode,
//           enteBeneficiario: "EC_TE",
//           idDominio: "77777777777",
//           importo: 100,
//           nomePagatore: `${userData.name} ${userData.surname}`,
//           tipoPagatore: "F"
//         },
//         {
//           CCP: "d15da8f4df1b4ab6855c966044310b1a",
//           IUV: "02016723749670001",
//           codicePagatore: userData.fiscalCode,
//           enteBeneficiario: "Comune di Milano",
//           idDominio: "01199250158",
//           importo: 20,
//           nomePagatore: `${userData.name} ${userData.surname}`,
//           tipoPagatore: "F"
//         }
//       ],
//       directAcquirer: false,
//       error: false,
//       fee: {
//         amount: 100,
//         currency: "EUR",
//         decimalDigits: 2
//       },
//       grandTotal: {
//         amount: 12100,
//         currency: "EUR",
//         decimalDigits: 2
//       },
//       id: 7090106732,
//       idPayment: 203737,
//       idStatus: 0,
//       idWallet: 94243,
//       merchant: "EC_TE",
//       nodoIdPayment: "d15da8f4df1b4ab6855c966044310b1a",
//       orderNumber: 7090106732,
//       paymentCancelled: false,
//       paymentModel: 0,
//       statusMessage: "Da autorizzare",
//       success: false,
//       token: "NzA5MDEwNjczMg==",
//       updated: new Date("2022-01-17T15:00:20Z"),
//       urlCheckout3ds:
//         "https://acardste.vaservices.eu/wallet/checkout?id=NzA5MDEwNjczMg=="
//     }
//   };

//   const isModifiedFlow = O.fromPredicate((flow: FlowCase) =>
//     [
//       FlowCase.ANSWER_PAY_3DS2_STATUS_201,
//       FlowCase.FAIL_PAY_3DS2_STATUS_401,
//       FlowCase.FAIL_PAY_3DS2_STATUS_403,
//       FlowCase.FAIL_PAY_3DS2_STATUS_404
//     ].includes(flow)
//   );

//   return pipe(
//     isModifiedFlow(flowId),
//     O.fold(
//       () =>
//         pipe(
//           response,
//           TransactionResponse.decode,
//           // eslint-disable-next-line sonarjs/no-identical-functions
//           E.mapLeft<t.Errors, HandlerResponseType<Pay3ds2UsingPOSTT>>(e => {
//             logger.info(
//               PathReporter.report(E.left<t.Errors, TransactionResponse>(e))
//             );
//             logger.warn(
//               "PM `pay3ds2UsingPOST` endpoint doesn't have HTTP 400 responses, returning 404 on `TransactionResponse` failed decoding instead"
//             );
//             return ResponseErrorNotFound(
//               "Mock – Error while decoding `TransactionResponse`",
//               ""
//             );
//           }),
//           E.map(ResponseSuccessJson),
//           E.getOrElse(t.identity)
//         ),
//       flow => {
//         switch (flow) {
//           case FlowCase.ANSWER_PAY_3DS2_STATUS_201:
//             return ResponseSuccessfulCreated;
//           case FlowCase.FAIL_PAY_3DS2_STATUS_401:
//             return ResponseUnauthorized;
//           case FlowCase.FAIL_PAY_3DS2_STATUS_403:
//             return ResponseErrorForbiddenAnonymousUser;
//           case FlowCase.FAIL_PAY_3DS2_STATUS_404:
//             return ResponseErrorNotFound(
//               `Mock – Failure case ${FlowCase[flow]}`,
//               ""
//             );
//           default:
//             // eslint-disable-next-line sonarjs/no-duplicate-string
//             throw new Error("Bug – Unhandled flow case");
//         }
//       }
//     )
//   );
// };

// export const pay3ds2Handler = (
//   userData: IUserData
// ): EndpointHandler<Pay3ds2UsingPOSTT> => async (
//   req
// ): Promise<HandlerResponseType<Pay3ds2UsingPOSTT>> => {
//   const flowId = getFlowCookie(req);

//   return pipe(
//     req.body,
//     PayRequest.decode,
//     E.mapLeft<t.Errors, HandlerResponseType<Pay3ds2UsingPOSTT>>(e => {
//       logger.info(PathReporter.report(E.left<t.Errors, PayRequest>(e)));
//       logger.warn(
//         "PM `pay3ds2UsingPOST` endpoint doesn't have HTTP 400 responses, returning 404 on `PayRequest` failed decoding instead"
//       );
//       return ResponseErrorNotFound(
//         "Mock – Error while decoding `PayRequest`",
//         ""
//       );
//     }),
//     E.map(payRequest =>
//       pay3ds2Controller(
//         userData,
//         flowId
//       )({
//         Bearer: "",
//         id: "",
//         language: "",
//         payRequest
//       })
//     ),
//     E.getOrElse(t.identity)
//   );
// };

// export const cancelPayment: RequestHandler = async (_req, res) => {
//   res.status(200).send();
// };

// export const getPaymentInfoController: (
//   codiceContestoPagamento: string,
//   flowId: FlowCase
// ) => EndpointController<GetPaymentInfoT> = (
//   codiceContestoPagamento,
//   flowId
// ) => (_params): HandlerResponseType<GetPaymentInfoT> => {
//   const response = {
//     causaleVersamento: "TARI/TEFA 2021",
//     codiceContestoPagamento,
//     enteBeneficiario: {
//       denominazioneBeneficiario: "EC_TE",
//       identificativoUnivocoBeneficiario: "77777777777"
//     },
//     ibanAccredito: "IT21Q0760101600000000546200",
//     importoSingoloVersamento: 12000
//   };

//   const isModifiedFlow = O.fromPredicate((flow: FlowCase) =>
//     [
//       FlowCase.ANSWER_VERIFY_NO_ENTE_BENEFICIARIO,
//       FlowCase.FAIL_VERIFY_400_PPT_STAZIONE_INT_PA_SCONOSCIUTA,
//       FlowCase.FAIL_VERIFY_404_PPT_DOMINIO_SCONOSCIUTO,
//       FlowCase.FAIL_VERIFY_409_PPT_PAGAMENTO_IN_CORSO,
//       FlowCase.FAIL_VERIFY_502_PPT_SINTASSI_XSD,
//       FlowCase.FAIL_VERIFY_503_PPT_STAZIONE_INT_PA_ERRORE_RESPONSE,
//       FlowCase.FAIL_VERIFY_504_PPT_STAZIONE_INT_PA_TIMEOUT,
//       FlowCase.FAIL_VERIFY_500
//     ].includes(flow)
//   );

//   return pipe(
//     isModifiedFlow(flowId),
//     O.fold(
//       () =>
//         pipe(
//           response,
//           PaymentRequestsGetResponse.decode,
//           E.mapLeft<t.Errors, HandlerResponseType<GetPaymentInfoT>>(e =>
//             ResponseErrorFromValidationErrors(PaymentRequestsGetResponse)(e)
//           ),
//           E.map(ResponseSuccessJson),
//           E.getOrElse(t.identity)
//         ),
//       flow => {
//         switch (flow) {
//           case FlowCase.ANSWER_VERIFY_NO_ENTE_BENEFICIARIO:
//             return pipe(
//               response,
//               PaymentRequestsGetResponse.decode,
//               E.mapLeft<t.Errors, HandlerResponseType<GetPaymentInfoT>>(e =>
//                 ResponseErrorFromValidationErrors(PaymentRequestsGetResponse)(e)
//               ),
//               E.map(r => {
//                 // eslint-disable-next-line functional/immutable-data
//                 r.enteBeneficiario = undefined;
//                 return r;
//               }),
//               E.map(ResponseSuccessJson),
//               E.getOrElse(t.identity)
//             );
//           case FlowCase.FAIL_VERIFY_400_PPT_STAZIONE_INT_PA_SCONOSCIUTA:
//             return ResponseErrorValidation(`${FlowCase[flow]}`, "");
//           case FlowCase.FAIL_VERIFY_404_PPT_DOMINIO_SCONOSCIUTO:
//             return ResponseErrorValidationFault(
//               `Mock – Failure case ${FlowCase[flow]}`,
//               ValidationFaultEnum.PPT_DOMINIO_SCONOSCIUTO
//             );
//           case FlowCase.FAIL_VERIFY_409_PPT_PAGAMENTO_IN_CORSO:
//             return ResponsePaymentStatusFaultError(
//               PaymentFaultEnum.GENERIC_ERROR,
//               PaymentStatusFaultEnum.PAA_PAGAMENTO_IN_CORSO
//             );
//           case FlowCase.FAIL_VERIFY_502_PPT_SINTASSI_XSD:
//             return ResponsePaymentError(
//               PaymentFaultEnum.GENERIC_ERROR,
//               GatewayFaultEnum.PPT_SINTASSI_XSD
//             );
//           case FlowCase.FAIL_VERIFY_503_PPT_STAZIONE_INT_PA_ERRORE_RESPONSE:
//             return ResponsePartyConfigurationError(
//               PaymentFaultEnum.GENERIC_ERROR,
//               PartyConfigurationFaultEnum.PPT_STAZIONE_INT_PA_ERRORE_RESPONSE
//             );
//           case FlowCase.FAIL_VERIFY_504_PPT_STAZIONE_INT_PA_TIMEOUT:
//             return ResponseGatewayTimeout(
//               PartyTimeoutFaultEnum.PPT_STAZIONE_INT_PA_TIMEOUT
//             );
//           case FlowCase.FAIL_VERIFY_500:
//             throw new Error(`Mock – Failure case ${FlowCase[flow]}`);
//           default:
//             // eslint-disable-next-line sonarjs/no-duplicate-string
//             throw new Error("Bug – Unhandled flow case");
//         }
//       }
//     )
//   );
// };

// export const getPaymentInfoHandler = (
//   codiceContestoPagamento: string
// ): ((req: express.Request, res: express.Response) => Promise<void>) => async (
//   req,
//   res
// ): Promise<void> => {
//   const responseContent = pipe(
//     req.params.rptId,
//     RptId.decode,
//     E.mapLeft<t.Errors, HandlerResponseType<GetPaymentInfoT>>(e =>
//       ResponseErrorFromValidationErrors(RptId)(e)
//     ),
//     E.map(rptId => {
//       const flowId = pipe(
//         rptId,
//         getFlowFromRptId,
//         O.fold(() => maybeGetFlowCookie(req), O.of),
//         O.getOrElse(() => FlowCase.OK)
//       );

//       setFlowCookie(res, flowId);

//       return getPaymentInfoController(
//         codiceContestoPagamento,
//         flowId
//       )({
//         rpt_id_from_string: rptId,
//         "x-Client-Id": ""
//       });
//     }),
//     E.getOrElse(t.identity)
//   );

//   responseContent.apply(res);
// };

// const activatePaymentController: (
//   flowId: FlowCase
// ) => EndpointController<ActivatePaymentT> = flowId => (
//   params
// ): HandlerResponseType<ActivatePaymentT> => {
//   const response = {
//     causaleVersamento: "TARI/TEFA 2021",
//     codiceContestoPagamento: params.body.codiceContestoPagamento,
//     enteBeneficiario: {
//       denominazioneBeneficiario: "EC_TE",
//       identificativoUnivocoBeneficiario: "77777777777"
//     },
//     ibanAccredito: "IT21Q0760101600000000546200",
//     importoSingoloVersamento: params.body.importoSingoloVersamento
//   };

//   const isModifiedFlow = O.fromPredicate((flow: FlowCase) =>
//     [
//       FlowCase.OK_ENABLE_PERSISTENCE,
//       FlowCase.FAIL_ACTIVATE_400_PPT_STAZIONE_INT_PA_SCONOSCIUTA,
//       FlowCase.FAIL_ACTIVATE_404_PPT_DOMINIO_SCONOSCIUTO,
//       FlowCase.FAIL_ACTIVATE_409_PPT_PAGAMENTO_IN_CORSO,
//       FlowCase.FAIL_ACTIVATE_502_PPT_SINTASSI_XSD,
//       FlowCase.FAIL_ACTIVATE_503_PPT_STAZIONE_INT_PA_ERRORE_RESPONSE,
//       FlowCase.FAIL_ACTIVATE_504_PPT_STAZIONE_INT_PA_TIMEOUT,
//       FlowCase.FAIL_ACTIVATE_500
//     ].includes(flow)
//   );

//   const successResponse = pipe(
//     response,
//     PaymentActivationsPostResponse.decode,
//     E.mapLeft<t.Errors, HandlerResponseType<ActivatePaymentT>>(e =>
//       ResponseErrorFromValidationErrors(PaymentActivationsPostResponse)(e)
//     ),
//     E.map(ResponseSuccessJson),
//     E.getOrElse(t.identity)
//   );

//   const clientResponse = pipe(
//     isModifiedFlow(flowId),
//     O.fold(
//       () => successResponse,
//       flow => {
//         switch (flow) {
//           case FlowCase.OK_ENABLE_PERSISTENCE: {
//             if (
//               store[FlowCase.OK_ENABLE_PERSISTENCE]?.activationState ===
//               ActivationState.Activated
//             ) {
//               return ResponsePaymentStatusFaultError(
//                 PaymentFaultEnum.GENERIC_ERROR,
//                 PaymentStatusFaultEnum.PAA_PAGAMENTO_IN_CORSO
//               );
//             } else {
//               return successResponse;
//             }
//           }
//           case FlowCase.FAIL_ACTIVATE_400_PPT_STAZIONE_INT_PA_SCONOSCIUTA:
//             return ResponseErrorValidation(
//               `Mock – Failure case ${FlowCase[flow]}`,
//               ""
//             );
//           case FlowCase.FAIL_ACTIVATE_404_PPT_DOMINIO_SCONOSCIUTO:
//             return ResponseErrorValidationFault(
//               PaymentFaultEnum.GENERIC_ERROR,
//               ValidationFaultEnum.PPT_DOMINIO_SCONOSCIUTO
//             );
//           case FlowCase.FAIL_ACTIVATE_409_PPT_PAGAMENTO_IN_CORSO:
//             return ResponsePaymentStatusFaultError(
//               PaymentFaultEnum.GENERIC_ERROR,
//               PaymentStatusFaultEnum.PAA_PAGAMENTO_IN_CORSO
//             );
//           case FlowCase.FAIL_ACTIVATE_502_PPT_SINTASSI_XSD:
//             return ResponsePaymentError(
//               PaymentFaultEnum.GENERIC_ERROR,
//               GatewayFaultEnum.PPT_SINTASSI_XSD
//             );
//           case FlowCase.FAIL_ACTIVATE_503_PPT_STAZIONE_INT_PA_ERRORE_RESPONSE:
//             return ResponsePartyConfigurationError(
//               PaymentFaultEnum.GENERIC_ERROR,
//               PartyConfigurationFaultEnum.PPT_STAZIONE_INT_PA_ERRORE_RESPONSE
//             );
//           case FlowCase.FAIL_ACTIVATE_504_PPT_STAZIONE_INT_PA_TIMEOUT:
//             return ResponseGatewayTimeout(
//               PartyTimeoutFaultEnum.PPT_STAZIONE_INT_PA_TIMEOUT
//             );
//           case FlowCase.FAIL_ACTIVATE_500:
//             throw new Error(`Mock – Failure case ${FlowCase[flow]}`);
//           default:
//             throw new Error("Bug – Unhandled flow case");
//         }
//       }
//     )
//   );

//   // eslint-disable-next-line functional/immutable-data
//   store[flowId] = {
//     activationState: ActivationState.Activated,
//     attemptNumber: Number(process.env.CHECK_STATUS_ADDITIONAL_ATTEMPTS)
//   };

//   return clientResponse;
// };

// export const activatePaymentHandler = (): EndpointHandler<ActivatePaymentT> => async (
//   req
// ): Promise<HandlerResponseType<ActivatePaymentT>> => {
//   const flowId = getFlowCookie(req);

//   return pipe(
//     req.body,
//     PaymentActivationsPostRequest.decode,
//     E.mapLeft<t.Errors, HandlerResponseType<ActivatePaymentT>>(e =>
//       ResponseErrorFromValidationErrors(PaymentActivationsPostRequest)(e)
//     ),
//     E.map(paymentRequest =>
//       activatePaymentController(flowId)({
//         body: paymentRequest,
//         "x-Client-Id": ""
//       })
//     ),
//     E.getOrElse(t.identity)
//   );
// };

// const checkPaymentStatusController: (
//   idPayment: string,
//   flowId: FlowCase
// ) => EndpointController<GetActivationStatusT> = (idPayment, flowId) => (
//   _params
// ): HandlerResponseType<GetActivationStatusT> => {
//   const response: PaymentActivationsGetResponse = {
//     idPagamento: idPayment
//   };

//   const isModifiedFlow = O.fromPredicate((flow: FlowCase) =>
//     [
//       FlowCase.OK_ENABLE_PERSISTENCE,
//       FlowCase.FAIL_PAYMENT_STATUS_400,
//       FlowCase.FAIL_PAYMENT_STATUS_404,
//       FlowCase.FAIL_PAYMENT_STATUS_502,
//       FlowCase.FAIL_PAYMENT_STATUS_500
//     ].includes(flow)
//   );

//   const additionalAttempts = store[flowId].attemptNumber;

//   // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
//   const successResponse = () =>
//     pipe(
//       response,
//       PaymentActivationsGetResponse.decode,
//       E.mapLeft<t.Errors, HandlerResponseType<GetActivationStatusT>>(e =>
//         ResponseErrorFromValidationErrors(PaymentActivationsGetResponse)(e)
//       ),
//       E.map(responseData => {
//         logger.info(`Attempt number: ${additionalAttempts}`);
//         if (additionalAttempts > 0) {
//           const responseObj = ResponseErrorNotFound(
//             `Mock – Additional attempt #${additionalAttempts} on activation`,
//             ""
//           );
//           // eslint-disable-next-line functional/immutable-data
//           store[flowId].attemptNumber = store[flowId].attemptNumber - 1;
//           return responseObj;
//         } else {
//           // eslint-disable-next-line functional/immutable-data
//           store[flowId].attemptNumber = Number(
//             process.env.CHECK_STATUS_ADDITIONAL_ATTEMPTS
//           );
//           return ResponseSuccessJson(responseData);
//         }
//       }),
//       E.getOrElse(t.identity)
//     );
//   return pipe(
//     isModifiedFlow(flowId),
//     O.fold(successResponse, flow => {
//       switch (flow) {
//         case FlowCase.OK_ENABLE_PERSISTENCE: {
//           logger.info(`additional attempts: ${additionalAttempts}`);
//           if (additionalAttempts === 0) {
//             // eslint-disable-next-line functional/immutable-data
//             store[FlowCase.OK_ENABLE_PERSISTENCE].activationState =
//               ActivationState.Available;
//           } else {
//             // eslint-disable-next-line functional/immutable-data
//             store[FlowCase.OK_ENABLE_PERSISTENCE].activationState =
//               ActivationState.Activated;
//           }

//           return successResponse();
//         }
//         case FlowCase.FAIL_PAYMENT_STATUS_400:
//           return ResponseErrorValidation(
//             `Mock – Failure case ${FlowCase[flow]}`,
//             ""
//           );
//         case FlowCase.FAIL_PAYMENT_STATUS_404:
//           return ResponseErrorNotFound(
//             `Mock – Failure case ${FlowCase[flow]}`,
//             "Not found"
//           );
//         case FlowCase.FAIL_PAYMENT_STATUS_500:
//           throw new Error(`Mock – Failure case ${FlowCase[flow]}`);
//         default:
//           throw new Error("Bug – Unhandled flow case");
//       }
//     })
//   );
// };

// export const checkPaymentStatusHandler = (
//   idPayment: string
// ): EndpointHandler<GetActivationStatusT> => async (
//   req
// ): Promise<HandlerResponseType<GetActivationStatusT>> => {
//   const flowId = getFlowCookie(req);

//   return pipe(req.params.codiceContestoPagamento, codiceContestoPagamento =>
//     checkPaymentStatusController(
//       idPayment,
//       flowId
//     )({
//       codice_contesto_pagamento: codiceContestoPagamento,
//       "x-Client-Id": ""
//     })
//   );
// };

import { pipe } from "fp-ts/function";
import * as express from "express";
import { RequestHandler } from "express";
import * as E from "fp-ts/lib/Either";
import * as O from "fp-ts/lib/Option";
import * as t from "io-ts";
import {
  ResponseErrorInternal,
  ResponseSuccessJson
} from "@pagopa/ts-commons/lib/responses";
import { PathReporter } from "io-ts/PathReporter";
import { PaymentResponse } from "../generated/payment_manager/PaymentResponse";
import { sendResponseWithData, tupleWith } from "../utils/utils";
import { TransactionResponse } from "../generated/payment_manager/TransactionResponse";
import { IUserData } from "../constants";
import {
  EndpointController,
  EndpointHandler,
  HandlerResponseType,
  ResponsePaymentError
} from "../utils/types";
import {
  ActivatePaymentT,
  GetPaymentInfoT
} from "../generated/pagopa_proxy/requestTypes";
import { RptId } from "../generated/pagopa_proxy/RptId";
import { PaymentRequestsGetResponse } from "../generated/pagopa_proxy/PaymentRequestsGetResponse";
import { PaymentFaultV2Enum } from "../generated/pagopa_proxy/PaymentFaultV2";
import { PaymentFaultEnum } from "../generated/pagopa_proxy/PaymentFault";
import { PaymentActivationsPostRequest } from "../generated/pagopa_proxy/PaymentActivationsPostRequest";
import { FlowCase, getFlowFromRptId } from "../flow";
import { PaymentActivationsPostResponse } from "../generated/pagopa_proxy/PaymentActivationsPostResponse";
import { logger } from "../logger";

export const paymentCheckHandler: (
  idPayment: string,
  userData: IUserData
) => RequestHandler = (idPayment: string, userData: IUserData) => async (
  _req,
  res
): Promise<void> => {
  pipe(
    E.right({
      data: {
        amount: {
          amount: 12000,
          currency: "EUR",
          decimalDigits: 2
        },
        bolloDigitale: false,
        detailsList: [
          {
            CCP: idPayment,
            IUV: "02016723749670000",
            codicePagatore: userData.fiscalCode,
            enteBeneficiario: "EC_TE",
            idDominio: "77777777777",
            importo: 100,
            nomePagatore: `${userData.name} ${userData.surname}`,
            tipoPagatore: "F"
          },
          {
            CCP: idPayment,
            IUV: "02016723749670000",
            codicePagatore: userData.fiscalCode,
            enteBeneficiario: "Comune di Milano",
            idDominio: "01199250158",
            importo: 20,
            nomePagatore: `${userData.name} ${userData.surname}`,
            tipoPagatore: "F"
          }
        ],
        fiscalCode: userData.fiscalCode,
        iban: "IT57N0760114800000011050036",
        id: 203436,
        idPayment,
        isCancelled: false,
        origin: "WALLET_APP",
        receiver: "EC_TE",
        // eslint-disable-next-line sonarjs/no-duplicate-string
        subject: "TARI/TEFA 2021",
        urlRedirectEc:
          "http://pagopamock.pagopa.hq/esito.php?idSession=e1283f0e673b4789a2af87fd9b4043f4"
      }
    }),
    E.map(PaymentResponse.encode),
    tupleWith(res),
    E.fold(_ => res.send(500), sendResponseWithData)
  );
};

export const pay3ds2Handler: (userData: IUserData) => RequestHandler = (
  userData: IUserData
) => async (_req, res): Promise<void> => {
  pipe(
    E.right({
      data: {
        amount: {
          amount: 12000,
          currency: "EUR",
          decimalDigits: 2
        },
        created: new Date("2022-01-17T15:00:20Z"),
        description: "TARI/TEFA 2021",
        detailsList: [
          {
            CCP: "d15da8f4df1b4ab6855c966044310b1a",
            IUV: "02016723749670001",
            codicePagatore: userData.fiscalCode,
            enteBeneficiario: "EC_TE",
            idDominio: "77777777777",
            importo: 100,
            nomePagatore: `${userData.name} ${userData.surname}`,
            tipoPagatore: "F"
          },
          {
            CCP: "d15da8f4df1b4ab6855c966044310b1a",
            IUV: "02016723749670001",
            codicePagatore: userData.fiscalCode,
            enteBeneficiario: "Comune di Milano",
            idDominio: "01199250158",
            importo: 20,
            nomePagatore: `${userData.name} ${userData.surname}`,
            tipoPagatore: "F"
          }
        ],
        directAcquirer: false,
        error: false,
        fee: {
          amount: 100,
          currency: "EUR",
          decimalDigits: 2
        },
        grandTotal: {
          amount: 12100,
          currency: "EUR",
          decimalDigits: 2
        },
        id: 7090106732,
        idPayment: 203737,
        idStatus: 0,
        idWallet: 94243,
        merchant: "EC_TE",
        nodoIdPayment: "d15da8f4df1b4ab6855c966044310b1a",
        orderNumber: 7090106732,
        paymentCancelled: false,
        paymentModel: 0,
        pspId: 1122602,
        pspInfo: {
          codiceAbi: "03069",
          idPsp: "BCITITMM",
          ragioneSociale: "Intesa Sanpaolo S.p.A"
        },
        statusMessage: "Da autorizzare",
        success: false,
        token: "NzA5MDEwNjczMg==",
        updated: new Date("2022-01-17T15:00:20Z"),
        urlCheckout3ds:
          "https://acardste.vaservices.eu/wallet/checkout?id=NzA5MDEwNjczMg=="
      }
    }),
    E.map(TransactionResponse.encode),
    tupleWith(res),
    E.fold(_ => res.status(500).send(), sendResponseWithData)
  );
};

export const cancelPayment: RequestHandler = async (_req, res) => {
  res.status(200).send();
};

export const getPaymentInfoController: (
  codiceContestoPagamento: string
) => EndpointController<GetPaymentInfoT> = codiceContestoPagamento => (
  _params
): HandlerResponseType<GetPaymentInfoT> => {
  const response = {
    causaleVersamento: "TARI/TEFA 2021",
    codiceContestoPagamento,
    enteBeneficiario: {
      denominazioneBeneficiario: "EC_TE",
      identificativoUnivocoBeneficiario: "77777777777"
    },
    ibanAccredito: "IT21Q0760101600000000546200",
    importoSingoloVersamento: 12000
  };
  return pipe(
    response,
    PaymentRequestsGetResponse.decode,
    E.mapLeft<t.Errors, HandlerResponseType<GetPaymentInfoT>>(_ =>
      ResponsePaymentError(
        PaymentFaultEnum.GENERIC_ERROR,
        PaymentFaultV2Enum.GENERIC_ERROR
      )
    ),
    E.map(ResponseSuccessJson),
    E.getOrElse(t.identity)
  );
};

export const getPaymentInfoHandler = (
  codiceContestoPagamento: string
): ((req: express.Request, res: express.Response) => Promise<void>) => async (
  req,
  res
): Promise<void> => {
  const responseContent = pipe(
    req.params.rptId,
    RptId.decode,
    // eslint-disable-next-line sonarjs/no-identical-functions
    E.mapLeft<t.Errors, HandlerResponseType<GetPaymentInfoT>>(_ =>
      ResponsePaymentError(
        PaymentFaultEnum.GENERIC_ERROR,
        PaymentFaultV2Enum.GENERIC_ERROR
      )
    ),
    E.map(rptId => {
      pipe(
        rptId,
        getFlowFromRptId,
        O.fold(
          () => res.cookie("mockFlow", FlowCase.OK),
          id => res.cookie("mockFlow", id)
        )
      );

      return getPaymentInfoController(codiceContestoPagamento)({
        rpt_id_from_string: rptId,
        "x-Client-Id": ""
      });
    }),
    E.getOrElse(t.identity)
  );

  responseContent.apply(res);
};

const activatePaymentController: (
  flowId: O.Option<FlowCase>
) => EndpointController<ActivatePaymentT> = flowId => (
  params
): HandlerResponseType<ActivatePaymentT> => {
  const response = {
    causaleVersamento: "TARI/TEFA 2021",
    codiceContestoPagamento: params.body.codiceContestoPagamento,
    enteBeneficiario: {
      denominazioneBeneficiario: "EC_TE",
      identificativoUnivocoBeneficiario: "77777777777"
    },
    ibanAccredito: "IT21Q0760101600000000546200",
    importoSingoloVersamento: params.body.importoSingoloVersamento
  };

  return pipe(
    flowId,
    O.filter(
      flow =>
        flow === FlowCase.FAIL_ACTIVATE_500 ||
        flow === FlowCase.FAIL_ACTIVATE_424
    ),
    O.fold(
      () =>
        pipe(
          response,
          PaymentActivationsPostResponse.decode,
          // eslint-disable-next-line sonarjs/no-identical-functions
          E.mapLeft<t.Errors, HandlerResponseType<ActivatePaymentT>>(e => {
            logger.info(PathReporter.report(E.left(e)));
            return ResponsePaymentError(
              PaymentFaultEnum.GENERIC_ERROR,
              PaymentFaultV2Enum.GENERIC_ERROR
            );
          }),
          E.map(ResponseSuccessJson),
          E.getOrElse(t.identity)
        ),
      flow => {
        switch (flow) {
          case FlowCase.FAIL_ACTIVATE_500:
            return ResponseErrorInternal(
              `Mock – Failure case ${FlowCase[flow]}`
            );
          case FlowCase.FAIL_ACTIVATE_424:
            return ResponsePaymentError(
              PaymentFaultEnum.GENERIC_ERROR,
              PaymentFaultV2Enum.GENERIC_ERROR
            );
          default:
            throw new Error("Bug – Unhandled flow case");
        }
      }
    )
  );
};

export const activatePaymentHandler = (): EndpointHandler<ActivatePaymentT> => async (
  req
): Promise<HandlerResponseType<ActivatePaymentT>> => {
  const flowId = pipe(
    O.fromNullable(req.cookies.mockFlow),
    O.map(id => Number(id)),
    O.filter(id => id in FlowCase)
  );

  return pipe(
    req.body,
    PaymentActivationsPostRequest.decode,
    // eslint-disable-next-line sonarjs/no-identical-functions
    E.mapLeft<t.Errors, HandlerResponseType<ActivatePaymentT>>(e => {
      logger.info(PathReporter.report(E.left(e)));
      return ResponsePaymentError(
        PaymentFaultEnum.GENERIC_ERROR,
        PaymentFaultV2Enum.GENERIC_ERROR
      );
    }),
    E.map(paymentRequest =>
      activatePaymentController(flowId)({
        body: paymentRequest,
        "x-Client-Id": ""
      })
    ),
    E.getOrElse(t.identity)
  );
};

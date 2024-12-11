/* eslint-disable @typescript-eslint/no-explicit-any */
import { RequestHandler } from "express";
import {
  FlowCase,
  getErrorCodeCookie,
  getFlowCookie,
  getPaymentGatewayCookie,
  getSendPaymentResultCookie
} from "../../flow";
import { logger } from "../../logger";
import {
  createSuccessGetTransactionEntity,
  error404TransactionIdNotFound,
  internalServerError500
} from "../../utils/ecommerce/transaction";
import { TransactionStatusEnum } from "../../generated/ecommerce/TransactionStatus";
import { SendPaymentResultOutcomeEnum } from "../../generated/ecommerce/NewTransactionResponse";

export const NPG_GATEWAY = "NPG";

export const REDIRECT_GATEWAY = "REDIRECT";

export enum NpgErrorCode {
  ERROR_CODE_100 = "100",
  ERROR_CODE_101 = "101",
  ERROR_CODE_102 = "102",
  ERROR_CODE_104 = "104",
  ERROR_CODE_106 = "106",
  ERROR_CODE_109 = "109",
  ERROR_CODE_110 = "110",
  ERROR_CODE_111 = "111",
  ERROR_CODE_115 = "115",
  ERROR_CODE_116 = "116",
  ERROR_CODE_117 = "117",
  ERROR_CODE_118 = "118",
  ERROR_CODE_119 = "119",
  ERROR_CODE_120 = "120",
  ERROR_CODE_121 = "121",
  ERROR_CODE_122 = "122",
  ERROR_CODE_123 = "123",
  ERROR_CODE_124 = "124",
  ERROR_CODE_125 = "125",
  ERROR_CODE_126 = "126",
  ERROR_CODE_129 = "129",
  ERROR_CODE_200 = "200",
  ERROR_CODE_202 = "202",
  ERROR_CODE_204 = "204",
  ERROR_CODE_208 = "208",
  ERROR_CODE_209 = "209",
  ERROR_CODE_210 = "210",
  ERROR_CODE_413 = "413",
  ERROR_CODE_888 = "888",
  ERROR_CODE_902 = "902",
  ERROR_CODE_903 = "903",
  ERROR_CODE_904 = "904",
  ERROR_CODE_906 = "906",
  ERROR_CODE_907 = "907",
  ERROR_CODE_908 = "908",
  ERROR_CODE_909 = "909",
  ERROR_CODE_911 = "911",
  ERROR_CODE_913 = "913",
  ERROR_CODE_999 = "999",
  UNKNOWN_ERROR_CODE = "777"
}

export const authCompletedNpgErrorCode = new Map<FlowCase, NpgErrorCode>([
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_100,
    NpgErrorCode.ERROR_CODE_100
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_101,
    NpgErrorCode.ERROR_CODE_101
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_102,
    NpgErrorCode.ERROR_CODE_102
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_104,
    NpgErrorCode.ERROR_CODE_104
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_106,
    NpgErrorCode.ERROR_CODE_106
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_109,
    NpgErrorCode.ERROR_CODE_109
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_110,
    NpgErrorCode.ERROR_CODE_110
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_111,
    NpgErrorCode.ERROR_CODE_111
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_115,
    NpgErrorCode.ERROR_CODE_115
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_116,
    NpgErrorCode.ERROR_CODE_116
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_117,
    NpgErrorCode.ERROR_CODE_117
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_118,
    NpgErrorCode.ERROR_CODE_118
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_119,
    NpgErrorCode.ERROR_CODE_119
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_120,
    NpgErrorCode.ERROR_CODE_120
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_121,
    NpgErrorCode.ERROR_CODE_121
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_122,
    NpgErrorCode.ERROR_CODE_122
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_123,
    NpgErrorCode.ERROR_CODE_123
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_124,
    NpgErrorCode.ERROR_CODE_124
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_125,
    NpgErrorCode.ERROR_CODE_125
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_126,
    NpgErrorCode.ERROR_CODE_126
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_129,
    NpgErrorCode.ERROR_CODE_129
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_200,
    NpgErrorCode.ERROR_CODE_200
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_202,
    NpgErrorCode.ERROR_CODE_202
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_204,
    NpgErrorCode.ERROR_CODE_204
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_208,
    NpgErrorCode.ERROR_CODE_208
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_209,
    NpgErrorCode.ERROR_CODE_209
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_210,
    NpgErrorCode.ERROR_CODE_210
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_413,
    NpgErrorCode.ERROR_CODE_413
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_888,
    NpgErrorCode.ERROR_CODE_888
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_902,
    NpgErrorCode.ERROR_CODE_902
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_903,
    NpgErrorCode.ERROR_CODE_903
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_904,
    NpgErrorCode.ERROR_CODE_904
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_906,
    NpgErrorCode.ERROR_CODE_906
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_907,
    NpgErrorCode.ERROR_CODE_907
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_908,
    NpgErrorCode.ERROR_CODE_908
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_909,
    NpgErrorCode.ERROR_CODE_909
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_911,
    NpgErrorCode.ERROR_CODE_911
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_913,
    NpgErrorCode.ERROR_CODE_913
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_999,
    NpgErrorCode.ERROR_CODE_999
  ],
  [
    FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_GENERIC,
    NpgErrorCode.UNKNOWN_ERROR_CODE
  ]
]);

export const closureRequestedNpgErrorCode = new Map<FlowCase, NpgErrorCode>([
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_100,
    NpgErrorCode.ERROR_CODE_100
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_101,
    NpgErrorCode.ERROR_CODE_101
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_102,
    NpgErrorCode.ERROR_CODE_102
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_104,
    NpgErrorCode.ERROR_CODE_104
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_106,
    NpgErrorCode.ERROR_CODE_106
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_109,
    NpgErrorCode.ERROR_CODE_109
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_110,
    NpgErrorCode.ERROR_CODE_110
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_111,
    NpgErrorCode.ERROR_CODE_111
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_115,
    NpgErrorCode.ERROR_CODE_115
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_116,
    NpgErrorCode.ERROR_CODE_116
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_117,
    NpgErrorCode.ERROR_CODE_117
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_118,
    NpgErrorCode.ERROR_CODE_118
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_119,
    NpgErrorCode.ERROR_CODE_119
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_120,
    NpgErrorCode.ERROR_CODE_120
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_121,
    NpgErrorCode.ERROR_CODE_121
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_122,
    NpgErrorCode.ERROR_CODE_122
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_123,
    NpgErrorCode.ERROR_CODE_123
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_124,
    NpgErrorCode.ERROR_CODE_124
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_125,
    NpgErrorCode.ERROR_CODE_125
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_126,
    NpgErrorCode.ERROR_CODE_126
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_129,
    NpgErrorCode.ERROR_CODE_129
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_200,
    NpgErrorCode.ERROR_CODE_200
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_202,
    NpgErrorCode.ERROR_CODE_202
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_204,
    NpgErrorCode.ERROR_CODE_204
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_208,
    NpgErrorCode.ERROR_CODE_208
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_209,
    NpgErrorCode.ERROR_CODE_209
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_210,
    NpgErrorCode.ERROR_CODE_210
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_413,
    NpgErrorCode.ERROR_CODE_413
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_888,
    NpgErrorCode.ERROR_CODE_888
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_902,
    NpgErrorCode.ERROR_CODE_902
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_903,
    NpgErrorCode.ERROR_CODE_903
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_904,
    NpgErrorCode.ERROR_CODE_904
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_906,
    NpgErrorCode.ERROR_CODE_906
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_907,
    NpgErrorCode.ERROR_CODE_907
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_908,
    NpgErrorCode.ERROR_CODE_908
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_909,
    NpgErrorCode.ERROR_CODE_909
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_911,
    NpgErrorCode.ERROR_CODE_911
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_913,
    NpgErrorCode.ERROR_CODE_913
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_999,
    NpgErrorCode.ERROR_CODE_999
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_GENERIC,
    NpgErrorCode.UNKNOWN_ERROR_CODE
  ]
]);

export const closureErrorNpgErrorCode = new Map<FlowCase, NpgErrorCode>([
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_100,
    NpgErrorCode.ERROR_CODE_100
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_101,
    NpgErrorCode.ERROR_CODE_101
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_102,
    NpgErrorCode.ERROR_CODE_102
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_104,
    NpgErrorCode.ERROR_CODE_104
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_106,
    NpgErrorCode.ERROR_CODE_106
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_109,
    NpgErrorCode.ERROR_CODE_109
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_110,
    NpgErrorCode.ERROR_CODE_110
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_111,
    NpgErrorCode.ERROR_CODE_111
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_115,
    NpgErrorCode.ERROR_CODE_115
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_116,
    NpgErrorCode.ERROR_CODE_116
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_117,
    NpgErrorCode.ERROR_CODE_117
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_118,
    NpgErrorCode.ERROR_CODE_118
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_119,
    NpgErrorCode.ERROR_CODE_119
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_120,
    NpgErrorCode.ERROR_CODE_120
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_121,
    NpgErrorCode.ERROR_CODE_121
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_122,
    NpgErrorCode.ERROR_CODE_122
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_123,
    NpgErrorCode.ERROR_CODE_123
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_124,
    NpgErrorCode.ERROR_CODE_124
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_125,
    NpgErrorCode.ERROR_CODE_125
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_126,
    NpgErrorCode.ERROR_CODE_126
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_129,
    NpgErrorCode.ERROR_CODE_129
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_200,
    NpgErrorCode.ERROR_CODE_200
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_202,
    NpgErrorCode.ERROR_CODE_202
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_204,
    NpgErrorCode.ERROR_CODE_204
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_208,
    NpgErrorCode.ERROR_CODE_208
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_209,
    NpgErrorCode.ERROR_CODE_209
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_210,
    NpgErrorCode.ERROR_CODE_210
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_413,
    NpgErrorCode.ERROR_CODE_413
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_888,
    NpgErrorCode.ERROR_CODE_888
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_902,
    NpgErrorCode.ERROR_CODE_902
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_903,
    NpgErrorCode.ERROR_CODE_903
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_904,
    NpgErrorCode.ERROR_CODE_904
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_906,
    NpgErrorCode.ERROR_CODE_906
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_907,
    NpgErrorCode.ERROR_CODE_907
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_908,
    NpgErrorCode.ERROR_CODE_908
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_909,
    NpgErrorCode.ERROR_CODE_909
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_911,
    NpgErrorCode.ERROR_CODE_911
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_913,
    NpgErrorCode.ERROR_CODE_913
  ],
  [
    FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_999,
    NpgErrorCode.ERROR_CODE_999
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_GENERIC,
    NpgErrorCode.UNKNOWN_ERROR_CODE
  ]
]);

export const unauthorizedNpgErrorCode = new Map<FlowCase, NpgErrorCode>([
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_100,
    NpgErrorCode.ERROR_CODE_100
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_101,
    NpgErrorCode.ERROR_CODE_101
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_102,
    NpgErrorCode.ERROR_CODE_102
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_104,
    NpgErrorCode.ERROR_CODE_104
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_106,
    NpgErrorCode.ERROR_CODE_106
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_109,
    NpgErrorCode.ERROR_CODE_109
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_110,
    NpgErrorCode.ERROR_CODE_110
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_111,
    NpgErrorCode.ERROR_CODE_111
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_115,
    NpgErrorCode.ERROR_CODE_115
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_116,
    NpgErrorCode.ERROR_CODE_116
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_117,
    NpgErrorCode.ERROR_CODE_117
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_118,
    NpgErrorCode.ERROR_CODE_118
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_119,
    NpgErrorCode.ERROR_CODE_119
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_120,
    NpgErrorCode.ERROR_CODE_120
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_121,
    NpgErrorCode.ERROR_CODE_121
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_122,
    NpgErrorCode.ERROR_CODE_122
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_123,
    NpgErrorCode.ERROR_CODE_123
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_124,
    NpgErrorCode.ERROR_CODE_124
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_125,
    NpgErrorCode.ERROR_CODE_125
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_126,
    NpgErrorCode.ERROR_CODE_126
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_129,
    NpgErrorCode.ERROR_CODE_129
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_200,
    NpgErrorCode.ERROR_CODE_200
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_202,
    NpgErrorCode.ERROR_CODE_202
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_204,
    NpgErrorCode.ERROR_CODE_204
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_208,
    NpgErrorCode.ERROR_CODE_208
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_209,
    NpgErrorCode.ERROR_CODE_209
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_210,
    NpgErrorCode.ERROR_CODE_210
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_413,
    NpgErrorCode.ERROR_CODE_413
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_888,
    NpgErrorCode.ERROR_CODE_888
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_902,
    NpgErrorCode.ERROR_CODE_902
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_903,
    NpgErrorCode.ERROR_CODE_903
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_904,
    NpgErrorCode.ERROR_CODE_904
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_906,
    NpgErrorCode.ERROR_CODE_906
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_907,
    NpgErrorCode.ERROR_CODE_907
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_908,
    NpgErrorCode.ERROR_CODE_908
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_909,
    NpgErrorCode.ERROR_CODE_909
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_911,
    NpgErrorCode.ERROR_CODE_911
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_913,
    NpgErrorCode.ERROR_CODE_913
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_999,
    NpgErrorCode.ERROR_CODE_999
  ],
  [
    FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_GENERIC,
    NpgErrorCode.UNKNOWN_ERROR_CODE
  ]
]);

export const expiredTransactionForAuthCompletedNpgErrorCode = new Map<
  FlowCase,
  NpgErrorCode
>([
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_100,
    NpgErrorCode.ERROR_CODE_100
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_101,
    NpgErrorCode.ERROR_CODE_101
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_102,
    NpgErrorCode.ERROR_CODE_102
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_104,
    NpgErrorCode.ERROR_CODE_104
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_106,
    NpgErrorCode.ERROR_CODE_106
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_109,
    NpgErrorCode.ERROR_CODE_109
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_110,
    NpgErrorCode.ERROR_CODE_110
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_111,
    NpgErrorCode.ERROR_CODE_111
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_115,
    NpgErrorCode.ERROR_CODE_115
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_116,
    NpgErrorCode.ERROR_CODE_116
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_117,
    NpgErrorCode.ERROR_CODE_117
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_118,
    NpgErrorCode.ERROR_CODE_118
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_119,
    NpgErrorCode.ERROR_CODE_119
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_120,
    NpgErrorCode.ERROR_CODE_120
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_121,
    NpgErrorCode.ERROR_CODE_121
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_122,
    NpgErrorCode.ERROR_CODE_122
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_123,
    NpgErrorCode.ERROR_CODE_123
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_124,
    NpgErrorCode.ERROR_CODE_124
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_125,
    NpgErrorCode.ERROR_CODE_125
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_126,
    NpgErrorCode.ERROR_CODE_126
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_129,
    NpgErrorCode.ERROR_CODE_129
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_200,
    NpgErrorCode.ERROR_CODE_200
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_202,
    NpgErrorCode.ERROR_CODE_202
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_204,
    NpgErrorCode.ERROR_CODE_204
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_208,
    NpgErrorCode.ERROR_CODE_208
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_209,
    NpgErrorCode.ERROR_CODE_209
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_210,
    NpgErrorCode.ERROR_CODE_210
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_413,
    NpgErrorCode.ERROR_CODE_413
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_888,
    NpgErrorCode.ERROR_CODE_888
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_902,
    NpgErrorCode.ERROR_CODE_902
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_903,
    NpgErrorCode.ERROR_CODE_903
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_904,
    NpgErrorCode.ERROR_CODE_904
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_906,
    NpgErrorCode.ERROR_CODE_906
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_907,
    NpgErrorCode.ERROR_CODE_907
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_908,
    NpgErrorCode.ERROR_CODE_908
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_909,
    NpgErrorCode.ERROR_CODE_909
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_911,
    NpgErrorCode.ERROR_CODE_911
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_913,
    NpgErrorCode.ERROR_CODE_913
  ],
  [
    FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_999,
    NpgErrorCode.ERROR_CODE_999
  ],
  [
    FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_GENERIC,
    NpgErrorCode.UNKNOWN_ERROR_CODE
  ]
]);

export enum NpgAuthorizationStatus {
  AUTHORIZED = "AUTHORIZED",
  EXECUTED = "EXECUTED",
  DECLINED = "DECLINED",
  DENIED_BY_RISK = "DENIED_BY_RISK",
  THREEDS_VALIDATED = "THREEDS_VALIDATED",
  THREEDS_FAILED = "THREEDS_FAILED",
  PENDING = "PENDING",
  CANCELED = "CANCELED",
  VOIDED = "VOIDED",
  REFUNDED = "REFUNDED",
  FAILED = "FAILED"
}

export enum RedirectAuthorizationStatus {
  OK = "OK",
  KO = "KO",
  CANCELED = "CANCELED",
  ERROR = "ERROR",
  EXPIRED = "EXPIRED"
}

// eslint-disable-next-line max-lines-per-function, complexity
export const ecommerceGetTransaction: RequestHandler = async (req, res) => {
  logger.info("[Get transaction ecommerce] - Return success case");
  const gateway = getPaymentGatewayCookie(req);
  const errorCode = getErrorCodeCookie(req);
  const sendPaymentResultOutcome = getSendPaymentResultCookie(req);
  // eslint-disable-next-line sonarjs/max-switch-cases, sonarjs/no-duplicated-branches
  switch (getFlowCookie(req)) {
    case FlowCase.NOTIFICATION_REQUESTED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.NOTIFICATION_REQUESTED,
          {
            sendPaymentResultOutcome
          },
          {
            errorCode,
            gateway
          }
        )
      );
    case FlowCase.NOTIFICATION_ERROR:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.NOTIFICATION_ERROR,
          {
            sendPaymentResultOutcome
          },
          {
            errorCode,
            gateway
          }
        )
      );
    case FlowCase.NOTIFIED_KO:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.NOTIFIED_KO,
          {
            sendPaymentResultOutcome
          },
          {
            errorCode,
            gateway
          }
        )
      );
    case FlowCase.REFUNDED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.REFUNDED,
          {
            sendPaymentResultOutcome
          },
          {
            errorCode,
            gateway
          }
        )
      );
    case FlowCase.REFUND_REQUESTED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.REFUND_REQUESTED,
          {
            sendPaymentResultOutcome
          },
          {
            errorCode,
            gateway
          }
        )
      );
    case FlowCase.REFUND_ERROR:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.REFUND_ERROR,
          {
            sendPaymentResultOutcome
          },
          {
            errorCode,
            gateway
          }
        )
      );
    case FlowCase.CLOSURE_ERROR:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_ERROR,
          {
            sendPaymentResultOutcome
          },
          {
            errorCode,
            gateway
          }
        )
      );
    case FlowCase.EXPIRED_NOT_AUTHORIZED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED_NOT_AUTHORIZED,
          {
            sendPaymentResultOutcome
          },
          {
            errorCode,
            gateway
          }
        )
      );
    case FlowCase.CANCELED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CANCELED,
          {
            sendPaymentResultOutcome
          },
          {
            errorCode,
            gateway
          }
        )
      );
    case FlowCase.CANCELLATION_EXPIRED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CANCELLATION_EXPIRED,
          {
            sendPaymentResultOutcome
          },
          {
            errorCode,
            gateway
          }
        )
      );
    case FlowCase.EXPIRED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome
          },
          {
            errorCode,
            gateway
          }
        )
      );
    case FlowCase.UNAUTHORIZED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.UNAUTHORIZED,
          {
            sendPaymentResultOutcome
          },
          {
            errorCode,
            gateway
          }
        )
      );
    case FlowCase.CLOSED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSED,
          {
            sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.NOT_RECEIVED
          },
          undefined
        )
      );
    case FlowCase.AUTHORIZATION_REQUESTED_NO_NPG_OUTCOME:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.AUTHORIZATION_REQUESTED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: undefined
          }
        )
      );
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_EXECUTED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.AUTHORIZATION_COMPLETED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.EXECUTED
          }
        )
      );
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_AUTHORIZED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.AUTHORIZATION_COMPLETED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.AUTHORIZED
          }
        )
      );
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_PENDING:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.AUTHORIZATION_COMPLETED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.PENDING
          }
        )
      );
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_VOIDED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.AUTHORIZATION_COMPLETED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.VOIDED
          }
        )
      );
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_REFUNDED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.AUTHORIZATION_COMPLETED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.REFUNDED
          }
        )
      );
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_FAILED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.AUTHORIZATION_COMPLETED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.FAILED
          }
        )
      );
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_CANCELED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.AUTHORIZATION_COMPLETED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.CANCELED
          }
        )
      );
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DENIED_BY_RISK:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.AUTHORIZATION_COMPLETED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.DENIED_BY_RISK
          }
        )
      );
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_THREEDS_VALIDATED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.AUTHORIZATION_COMPLETED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.THREEDS_VALIDATED
          }
        )
      );
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_THREEDS_FAILED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.AUTHORIZATION_COMPLETED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.THREEDS_FAILED
          }
        )
      );
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_100:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_101:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_102:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_104:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_106:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_109:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_110:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_111:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_115:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_116:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_117:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_118:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_119:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_120:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_121:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_122:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_123:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_124:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_125:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_126:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_129:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_200:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_202:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_204:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_208:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_209:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_210:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_413:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_888:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_902:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_903:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_904:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_906:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_907:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_908:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_909:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_911:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_913:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_999:
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_GENERIC:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.AUTHORIZATION_COMPLETED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            errorCode: authCompletedNpgErrorCode.get(getFlowCookie(req)),
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.DECLINED
          }
        )
      );
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_EXECUTED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_REQUESTED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.EXECUTED
          }
        )
      );
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_AUTHORIZED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_REQUESTED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.AUTHORIZED
          }
        )
      );
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_PENDING:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_REQUESTED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.PENDING
          }
        )
      );
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_VOIDED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_REQUESTED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.VOIDED
          }
        )
      );
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_REFUNDED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_REQUESTED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.REFUNDED
          }
        )
      );
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_FAILED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_REQUESTED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.FAILED
          }
        )
      );
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_CANCELED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_REQUESTED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.CANCELED
          }
        )
      );
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DENIED_BY_RISK:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_REQUESTED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.DENIED_BY_RISK
          }
        )
      );
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_THREEDS_VALIDATED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_REQUESTED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.THREEDS_VALIDATED
          }
        )
      );
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_THREEDS_FAILED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_REQUESTED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.THREEDS_FAILED
          }
        )
      );
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_100:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_101:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_102:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_104:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_106:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_109:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_110:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_111:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_115:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_116:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_117:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_118:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_119:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_120:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_121:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_122:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_123:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_124:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_125:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_126:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_129:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_200:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_202:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_204:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_208:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_209:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_210:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_413:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_888:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_902:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_903:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_904:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_906:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_907:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_908:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_909:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_911:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_913:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_999:
    case FlowCase.CLOSURE_REQUESTED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_GENERIC:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_REQUESTED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            errorCode: closureRequestedNpgErrorCode.get(getFlowCookie(req)),
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.DECLINED
          }
        )
      );
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_EXECUTED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_ERROR,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.EXECUTED
          }
        )
      );
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_AUTHORIZED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_ERROR,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.AUTHORIZED
          }
        )
      );
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_PENDING:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_ERROR,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.PENDING
          }
        )
      );
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_VOIDED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_ERROR,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.VOIDED
          }
        )
      );
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_REFUNDED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_ERROR,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.REFUNDED
          }
        )
      );
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_FAILED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_ERROR,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.FAILED
          }
        )
      );
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_CANCELED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_ERROR,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.CANCELED
          }
        )
      );
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DENIED_BY_RISK:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_ERROR,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.DENIED_BY_RISK
          }
        )
      );
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_THREEDS_VALIDATED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_ERROR,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.THREEDS_VALIDATED
          }
        )
      );
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_THREEDS_FAILED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_ERROR,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.THREEDS_FAILED
          }
        )
      );
    case FlowCase.CLOSURE_ERROR_WITH_NPG_ON_CLOSE_PAYMENT_ERROR_CODE_422_DID_NOT_RECEIVE_RPT:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_ERROR,
          {
            closePaymentResultError: {
              description: "Node did not receive RPT yet",
              statusCode: 422
            },
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.DECLINED
          }
        )
      );
    case FlowCase.CLOSURE_ERROR_WITH_NPG_ON_CLOSE_PAYMENT_ERROR_CODE_400_REFUND_CASES:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_ERROR,
          {
            closePaymentResultError: {
              description: "Invalid idBrokerPSP",
              statusCode: 400
            },
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.DECLINED
          }
        )
      );
    case FlowCase.CLOSURE_ERROR_WITH_NPG_ON_CLOSE_PAYMENT_ERROR_CODE_404_REFUND_CASES:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_ERROR,
          {
            closePaymentResultError: {
              description: "The indicated PSP does not exist",
              statusCode: 404
            },
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.DECLINED
          }
        )
      );
    // this will be used later
    /* case FlowCase.CLOSURE_ERROR_WITH_NPG_ON_CLOSE_PAYMENT_ERROR_CODE_422_OUTCOME_ALREADY_ACQUIRED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_ERROR,
          {
            closePaymentResultError: {
              description: "Outcome already acquired",
              statusCode: 422
            },
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.DECLINED
          }
        )
      );
      */
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_100:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_101:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_102:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_104:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_106:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_109:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_110:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_111:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_115:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_116:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_117:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_118:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_119:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_120:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_121:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_122:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_123:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_124:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_125:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_126:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_129:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_200:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_202:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_204:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_208:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_209:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_210:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_413:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_888:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_902:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_903:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_904:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_906:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_907:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_908:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_909:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_911:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_913:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_999:
    case FlowCase.CLOSURE_ERROR_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_GENERIC:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_ERROR,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            errorCode: closureErrorNpgErrorCode.get(getFlowCookie(req)),
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.DECLINED
          }
        )
      );
    case FlowCase.CLOSED_WITH_NPG_AUTH_STATUS_EXECUTED_SEND_PAYMENT_RESULT_NOT_RECEIVED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSED,
          {
            sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.NOT_RECEIVED
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.EXECUTED
          }
        )
      );
    case FlowCase.NOTIFICATION_REQUESTED_WITH_NPG_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_OK:
    case FlowCase.EXPIRED_TRANSACTION_FOR_NOTIFICATION_REQUESTED_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_OK:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.NOTIFICATION_REQUESTED,
          {
            sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.EXECUTED
          }
        )
      );
    case FlowCase.NOTIFICATION_REQUESTED_WITH_NPG_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_KO:
    case FlowCase.EXPIRED_TRANSACTION_FOR_NOTIFICATION_REQUESTED_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_KO:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.NOTIFICATION_REQUESTED,
          {
            sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.EXECUTED
          }
        )
      );
    case FlowCase.NOTIFICATION_ERROR_WITH_NPG_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_OK:
    case FlowCase.EXPIRED_TRANSACTION_FOR_NOTIFICATION_ERROR_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_OK:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.NOTIFICATION_ERROR,
          {
            sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.EXECUTED
          }
        )
      );
    case FlowCase.NOTIFICATION_ERROR_WITH_NPG_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_KO:
    case FlowCase.EXPIRED_TRANSACTION_FOR_NOTIFICATION_ERROR_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_KO:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.NOTIFICATION_ERROR,
          {
            sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.EXECUTED
          }
        )
      );
    case FlowCase.NOTIFIED_OK_WITH_NPG_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_OK:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.NOTIFIED_OK,
          {
            sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.EXECUTED
          }
        )
      );
    case FlowCase.NOTIFIED_KO_WITH_NPG_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_KO:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.NOTIFIED_KO,
          {
            sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.EXECUTED
          }
        )
      );
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_REQUESTED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: undefined
          }
        )
      );
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_EXECUTED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.EXECUTED
          }
        )
      );

    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_AUTHORIZED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.AUTHORIZED
          }
        )
      );
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_PENDING:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.PENDING
          }
        )
      );
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_VOIDED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.VOIDED
          }
        )
      );
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_REFUNDED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.REFUNDED
          }
        )
      );
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_FAILED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.FAILED
          }
        )
      );
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_CANCELED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.CANCELED
          }
        )
      );
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DENIED_BY_RISK:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.DENIED_BY_RISK
          }
        )
      );
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_THREEDS_VALIDATED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.THREEDS_VALIDATED
          }
        )
      );
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_THREEDS_FAILED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.THREEDS_FAILED
          }
        )
      );
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_100:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_101:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_102:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_104:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_106:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_109:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_110:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_111:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_115:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_116:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_117:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_118:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_119:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_120:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_121:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_122:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_123:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_124:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_125:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_126:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_129:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_200:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_202:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_204:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_208:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_209:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_210:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_413:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_888:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_902:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_903:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_904:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_906:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_907:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_908:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_909:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_911:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_913:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_999:
    case FlowCase.EXPIRED_TRANSACTION_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_DECLINED_ERROR_CODE_GENERIC:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            errorCode: expiredTransactionForAuthCompletedNpgErrorCode.get(
              getFlowCookie(req)
            ),
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.DECLINED
          }
        )
      );
    case FlowCase.EXPIRED_TRANSACTION_FOR_CLOSURE_REQUESTED_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_NOT_RECEIVED:
    case FlowCase.EXPIRED_TRANSACTION_FOR_CLOSURE_ERROR_AUTH_STATUS_EXECUTED_AND_SEND_PAYMENT_RESULT_NOT_RECEIVED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.NOT_RECEIVED
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.EXECUTED
          }
        )
      );
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_AUTHORIZED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.UNAUTHORIZED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.AUTHORIZED
          }
        )
      );
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_PENDING:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.UNAUTHORIZED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.PENDING
          }
        )
      );
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_VOIDED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.UNAUTHORIZED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.VOIDED
          }
        )
      );
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_REFUNDED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.UNAUTHORIZED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.REFUNDED
          }
        )
      );
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_FAILED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.UNAUTHORIZED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.FAILED
          }
        )
      );
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_CANCELED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.UNAUTHORIZED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.CANCELED
          }
        )
      );
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DENIED_BY_RISK:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.UNAUTHORIZED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.DENIED_BY_RISK
          }
        )
      );
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_THREEDS_VALIDATED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.UNAUTHORIZED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.THREEDS_VALIDATED
          }
        )
      );
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_THREEDS_FAILED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.UNAUTHORIZED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.THREEDS_FAILED
          }
        )
      );
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_100:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_101:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_102:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_104:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_106:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_109:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_110:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_111:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_115:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_116:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_117:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_118:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_119:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_120:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_121:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_122:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_123:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_124:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_125:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_126:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_129:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_200:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_202:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_204:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_208:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_209:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_210:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_413:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_888:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_902:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_903:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_904:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_906:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_907:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_908:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_909:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_911:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_913:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_999:
    case FlowCase.UNAUTHORIZED_WITH_NPG_AUTH_STATUS_DECLINED_ERROR_CODE_GENERIC:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.UNAUTHORIZED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            errorCode: unauthorizedNpgErrorCode.get(getFlowCookie(req)),
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.DECLINED
          }
        )
      );
    case FlowCase.REFUND_REQUESTED_TRANSACTION_WITH_NPG_AUTH_STATUS_EXECUTED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.REFUND_REQUESTED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.EXECUTED
          }
        )
      );
    case FlowCase.REFUND_ERROR_TRANSACTION_WITH_NPG_AUTH_STATUS_EXECUTED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.REFUND_ERROR,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.EXECUTED
          }
        )
      );
    case FlowCase.REFUNDED_TRANSACTION_WITH_NPG_AUTH_STATUS_EXECUTED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.REFUNDED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: NPG_GATEWAY,
            gatewayAuthorizationStatus: NpgAuthorizationStatus.EXECUTED
          }
        )
      );
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_REDIRECT_AUTH_STATUS_OK:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.AUTHORIZATION_COMPLETED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.OK
          }
        )
      );
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_REDIRECT_AUTH_STATUS_KO:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.AUTHORIZATION_COMPLETED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.KO
          }
        )
      );
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_REDIRECT_AUTH_STATUS_CANCELED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.AUTHORIZATION_COMPLETED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.CANCELED
          }
        )
      );
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_REDIRECT_AUTH_STATUS_ERROR:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.AUTHORIZATION_COMPLETED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.ERROR
          }
        )
      );
    case FlowCase.AUTHORIZATION_COMPLETED_WITH_REDIRECT_AUTH_STATUS_EXPIRED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.AUTHORIZATION_COMPLETED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.EXPIRED
          }
        )
      );
    case FlowCase.CLOSURE_REQUESTED_WITH_REDIRECT_AUTH_STATUS_OK:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_REQUESTED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.OK
          }
        )
      );
    case FlowCase.CLOSURE_REQUESTED_WITH_REDIRECT_AUTH_STATUS_KO:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_REQUESTED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.KO
          }
        )
      );
    case FlowCase.CLOSURE_REQUESTED_WITH_REDIRECT_AUTH_STATUS_CANCELED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_REQUESTED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.CANCELED
          }
        )
      );
    case FlowCase.CLOSURE_REQUESTED_WITH_REDIRECT_AUTH_STATUS_ERROR:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_REQUESTED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.ERROR
          }
        )
      );
    case FlowCase.CLOSURE_REQUESTED_WITH_REDIRECT_AUTH_STATUS_EXPIRED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_REQUESTED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.EXPIRED
          }
        )
      );
    case FlowCase.CLOSURE_ERROR_WITH_REDIRECT_AUTH_STATUS_OK:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_ERROR,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.OK
          }
        )
      );
    case FlowCase.CLOSURE_ERROR_WITH_REDIRECT_AUTH_STATUS_KO:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_ERROR,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.KO
          }
        )
      );
    case FlowCase.CLOSURE_ERROR_WITH_REDIRECT_AUTH_STATUS_CANCELED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_ERROR,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.CANCELED
          }
        )
      );
    case FlowCase.CLOSURE_ERROR_WITH_REDIRECT_AUTH_STATUS_ERROR:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_ERROR,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.ERROR
          }
        )
      );
    case FlowCase.CLOSURE_ERROR_WITH_REDIRECT_AUTH_STATUS_EXPIRED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.CLOSURE_ERROR,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.EXPIRED
          }
        )
      );
    case FlowCase.UNAUTHORIZED_WITH_REDIRECT_AUTH_STATUS_OK:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.UNAUTHORIZED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.OK
          }
        )
      );
    case FlowCase.UNAUTHORIZED_WITH_REDIRECT_AUTH_STATUS_KO:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.UNAUTHORIZED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.KO
          }
        )
      );
    case FlowCase.UNAUTHORIZED_WITH_REDIRECT_AUTH_STATUS_CANCELED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.UNAUTHORIZED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.CANCELED
          }
        )
      );
    case FlowCase.UNAUTHORIZED_WITH_REDIRECT_AUTH_STATUS_ERROR:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.UNAUTHORIZED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.ERROR
          }
        )
      );
    case FlowCase.UNAUTHORIZED_WITH_REDIRECT_AUTH_STATUS_EXPIRED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.UNAUTHORIZED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.EXPIRED
          }
        )
      );
    case FlowCase.NOTIFICATION_REQUESTED_WITH_REDIRECT_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_OK:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.NOTIFICATION_REQUESTED,
          {
            sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.OK
          }
        )
      );
    case FlowCase.NOTIFICATION_REQUESTED_WITH_REDIRECT_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_KO:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.UNAUTHORIZED,
          {
            sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.OK
          }
        )
      );
    case FlowCase.NOTIFICATION_ERROR_WITH_REDIRECT_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_OK:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.NOTIFICATION_ERROR,
          {
            sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.OK
          }
        )
      );
    case FlowCase.NOTIFICATION_ERROR_WITH_REDIRECT_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_KO:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.NOTIFICATION_ERROR,
          {
            sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.OK
          }
        )
      );
    case FlowCase.NOTIFIED_OK_WITH_REDIRECT_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_OK:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.NOTIFIED_KO,
          {
            sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.OK
          }
        )
      );
    case FlowCase.NOTIFIED_KO_WITH_REDIRECT_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_KO:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.NOTIFIED_KO,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.OK
          }
        )
      );
    case FlowCase.EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_OK:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.OK
          }
        )
      );
    case FlowCase.EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_KO:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.KO
          }
        )
      );
    case FlowCase.EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_CANCELED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.CANCELED
          }
        )
      );
    case FlowCase.EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_EXPIRED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.EXPIRED
          }
        )
      );
    case FlowCase.EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_AUTHORIZATION_COMPLETED_AUTH_STATUS_ERROR:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome: undefined
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.ERROR
          }
        )
      );
    case FlowCase.EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_CLOSURE_REQUESTED_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_NOT_RECEIVED:
    case FlowCase.EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_CLOSURE_ERROR_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_NOT_RECEIVED:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.NOT_RECEIVED
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.OK
          }
        )
      );
    case FlowCase.EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_NOTIFICATION_REQUESTED_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_OK:
    case FlowCase.EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_NOTIFICATION_ERROR_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_OK:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.OK
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.OK
          }
        )
      );
    case FlowCase.EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_NOTIFICATION_REQUESTED_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_KO:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.EXPIRED,
          {
            sendPaymentResultOutcome: SendPaymentResultOutcomeEnum.KO
          },
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.OK
          }
        )
      );
    case FlowCase.EXPIRED_TRANSACTION_WITH_REDIRECT_FOR_NOTIFICATION_ERROR_AUTH_STATUS_OK_AND_SEND_PAYMENT_RESULT_KO:
    case FlowCase.REFUND_REQUESTED_TRANSACTION_WITH_REDIRECT_AUTH_STATUS_OK:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.REFUND_REQUESTED,
          undefined,
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.OK
          }
        )
      );
    case FlowCase.REFUND_ERROR_TRANSACTION_WITH_REDIRECT_AUTH_STATUS_OK:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.REFUND_ERROR,
          undefined,
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.OK
          }
        )
      );
    case FlowCase.REFUNDED_TRANSACTION_WITH_REDIRECT_AUTH_STATUS_OK:
      return res.status(200).send(
        createSuccessGetTransactionEntity(
          req.params.transactionId,
          TransactionStatusEnum.REFUNDED,
          undefined,
          {
            gateway: REDIRECT_GATEWAY,
            gatewayAuthorizationStatus: RedirectAuthorizationStatus.OK
          }
        )
      );
    default:
      return res
        .status(200)
        .send(
          createSuccessGetTransactionEntity(
            req.params.transactionId,
            TransactionStatusEnum.NOTIFIED_OK
          )
        );
  }
};

const ecommerceDeleteTransaction500 = (res: any): void => {
  logger.info("[Delete transaction ecommerce] - Return error case 404");
  res.status(500).send(internalServerError500());
};

const ecommerceDeleteTransaction404 = (
  transactionId: string,
  res: any
): void => {
  logger.info("[Delete transaction ecommerce] - Return error case 404");
  res.status(404).send(error404TransactionIdNotFound(transactionId));
};

export const ecommerceDeleteTransaction: RequestHandler = async (req, res) => {
  logger.info("[User cancel transaction ecommerce]");
  switch (getFlowCookie(req)) {
    case FlowCase.INTERNAL_SERVER_ERROR_TRANSACTION_USER_CANCEL:
      ecommerceDeleteTransaction500(res);
      break;
    case FlowCase.ID_NOT_FOUND_TRANSACTION_USER_CANCEL:
      ecommerceDeleteTransaction404(req.params.transactionId, res);
      break;
    default:
      logger.info(
        "[Delete transaction ecommerce] - Return success case 202 accepted"
      );
      res.status(202).send();
  }
};

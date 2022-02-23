import { StatusEnum } from "./generated/payment_manager/User";
import { PspListResponseData } from "./generated/payment_manager/PspListResponseData";
import { LinguaEnum } from "./generated/payment_manager/Psp";

export const ID_PAYMENT = "e1283f0e673b4789a2af87fd9b4043f4";

export const USER_DATA = {
  cellphone: "+39 333 3333333",
  email: "john.doe@gmail.com",
  fiscalCode: "JHNDOE00A01F205N",
  name: "John",
  surname: "Doe"
};

export type IUserData = typeof USER_DATA;

export const SESSION_USER = {
  acceptTerms: true,
  email: USER_DATA.email,
  fiscalCode: USER_DATA.fiscalCode,
  notificationEmail: USER_DATA.email,
  registered: false,
  status: "ANONYMOUS" as StatusEnum,
  userId: 39624
};

export type ISessionUser = typeof SESSION_USER;

export const pspList: PspListResponseData = {
  myBankSellerBankList: [],
  pspList: [
    {
      appChannel: false,
      businessName: "Poste Italiane",
      codiceAbi: "06220",
      fixedCost: {
        amount: 1,
        currency: "EUR",
        decimalDigits: 2
      },
      id: 8,
      idCard: 11008,
      idChannel: "POSTE1",
      idIntermediary: "BANCOPOSTA",
      idPsp: "POSTE1",
      isDirectAcquirer: false,
      isPspOnus: false,
      lingua: LinguaEnum.IT,
      logoPSP: "http://acardste.vaservices.eu/pp-restapi/v4/resources/psp/8",
      paymentModel: 0,
      paymentType: "CP",
      serviceAvailability: "disponibilitaServizio FRANCESE",
      serviceLogo:
        "http://acardste.vaservices.eu/pp-restapi/v4/resources/service/8",
      serviceName: "nomeServizio 02 poste (MOD0)",
      solvedByPan: false,
      urlInfoChannel: "http://www.test.sia.eu"
    },
    {
      appChannel: false,
      businessName: "Poste Italiane",
      codiceAbi: "06220",
      fixedCost: {
        amount: 625,
        currency: "EUR",
        decimalDigits: 2
      },
      flagStamp: true,
      id: 11,
      idCard: 11008,
      idChannel: "POSTE1",
      idIntermediary: "BANCOPOSTA",
      idPsp: "Digital stamp enabled PSP",
      isDirectAcquirer: false,
      isPspOnus: false,
      lingua: LinguaEnum.IT,
      logoPSP: "http://acardste.vaservices.eu/pp-restapi/v4/resources/psp/11",
      paymentModel: 1,
      paymentType: "CP",
      serviceAvailability: "Pagamento Bollo Digitale tramite Poste",
      serviceLogo:
        "http://acardste.vaservices.eu/pp-restapi/v4/resources/service/11",
      serviceName: "poste - DS Enabled",
      solvedByPan: false,
      urlInfoChannel: "http://www.test.sia.eu"
    },
    {
      appChannel: false,
      businessName: "Psp NEXI 2",
      codiceAbi: "99997",
      fixedCost: {
        amount: 111,
        currency: "EUR",
        decimalDigits: 2
      },
      flagStamp: true,
      id: 22,
      idCard: 99997,
      idChannel: "NEXI (Visa)",
      idIntermediary: "Psp Nexi",
      idPsp: "NEXI_Visa",
      isDirectAcquirer: true,
      isPspOnus: false,
      lingua: LinguaEnum.IT,
      logoPSP: "http://acardste.vaservices.eu/pp-restapi/v4/resources/psp/22",
      paymentModel: 1,
      paymentType: "CP",
      serviceAvailability: "NEXI",
      serviceLogo:
        "http://acardste.vaservices.eu/pp-restapi/v4/resources/service/22",
      serviceName: "NEXI (Visa)",
      solvedByPan: false
    }
  ]
};

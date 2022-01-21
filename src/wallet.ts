import { splitAt } from "./utils";
import { Wallet } from "./generated/api/Wallet";
import { CreditCard } from "./generated/api/CreditCard";

const censorPan: (pan: string) => string = (rawPan: string) => {
  const pan = rawPan.replace(/ /g, "");
  const [panPrefix, panSuffix] = splitAt(pan.length - 4, pan);

  return panPrefix.replace(/./g, "*") + panSuffix;
};

export const createResponseWallet: (
  wallet: Wallet
) => Record<string, unknown> = (wallet: Wallet) => {
  // eslint-disable-next-line functional/no-let
  let creditCard: unknown = wallet.creditCard;

  if (creditCard) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { expireMonth, expireYear, holder, pan } = creditCard;
    const censoredPan = censorPan(pan);
    creditCard = {
      brand: "MASTERCARD",
      brandLogo:
        "https://acardste.vaservices.eu/wallet/assets/img/creditcard/carta_mc.png",
      expireMonth,
      expireYear,
      flag3dsVerified: false,
      flagForwardCreateToTkm: false,
      flagForwardDeleteToTkm: false,
      hasAlreadyPaid: false,
      holder,
      id: 75603,
      isOnUs: true,
      onlyOnUs: false,
      pan: censoredPan
    };
  }

  return {
    ...wallet,
    creditCard,
    favourite: false,
    idPagamentoFromEC: "e1283f0e673b4789a2af87fd9b4043f4",
    idPsp: 1123779,
    idWallet: 94187,
    isPspToIgnore: false,
    onboardingChannel: "IO-PAY",
    pagoPa: true,
    psp: {
      appChannel: false,
      businessName: "Intesa Sanpaolo S.p.A",
      codiceAbi: "03069",
      directAcquirer: false,
      fixedCost: {
        amount: 100,
        currency: "EUR",
        decimalDigits: 2
      },
      flagStamp: false,
      id: 1123779,
      idCard: 1050,
      idChannel: "00799960158_10",
      idIntermediary: "00799960158",
      idPsp: "BCITITMM",
      isPspOnus: false,
      lingua: "IT",
      logoPSP:
        "https://acardste.vaservices.eu/pp-restapi/v4/resources/psp/1123779",
      participant: "CT000097",
      paymentModel: 1,
      paymentType: "CP",
      serviceAvailability: "7/7-24H",
      serviceDescription:
        "Clienti e non delle Banche del Gruppo Intesa Sanpaolo possono disporre pagamenti con carte di pagamento VISA-MASTERCARD",
      serviceLogo:
        "https://acardste.vaservices.eu/pp-restapi/v4/resources/service/1123779",
      serviceName: "Pagamento con Carte",
      solvedByPan: false,
      tags: ["VISA", "MASTERCARD"]
    },
    pspEditable: false,
    registeredNexi: false,
    saved: false,
    services: ["pagoPA", "FA", "BPD"]
  };
};

export const createUpdateResponseWallet: (
  wallet: Wallet,
  creditCard: CreditCard
) => Record<string, unknown> = (wallet: Wallet, creditCard) => ({
  ...wallet,
  creditCard,
  favourite: false,
  idPsp: 1123779,
  idWallet: 94187,
  isPspToIgnore: false,
  onboardingChannel: "IO-PAY",
  pagoPa: true,
  psp: {
    appChannel: false,
    businessName: "Intesa Sanpaolo S.p.A",
    codiceAbi: "03069",
    directAcquirer: false,
    fixedCost: {
      amount: 100,
      currency: "EUR",
      decimalDigits: 2
    },
    flagStamp: false,
    id: 1123779,
    idCard: 1050,
    idChannel: "00799960158_10",
    idIntermediary: "00799960158",
    idPsp: "BCITITMM",
    isPspOnus: false,
    lingua: "IT",
    logoPSP:
      "https://acardste.vaservices.eu/pp-restapi/v4/resources/psp/1123779",
    participant: "CT000097",
    paymentModel: 1,
    paymentType: "CP",
    serviceAvailability: "7/7-24H",
    serviceDescription:
      "Clienti e non delle Banche del Gruppo Intesa Sanpaolo possono disporre pagamenti con carte di pagamento VISA-MASTERCARD",
    serviceLogo:
      "https://acardste.vaservices.eu/pp-restapi/v4/resources/service/1123779",
    serviceName: "Pagamento con Carte",
    solvedByPan: false,
    tags: ["VISA", "MASTERCARD"]
  },
  pspEditable: true,
  registeredNexi: false,
  saved: false,
  services: ["pagoPA", "FA", "BPD"],
  type: "CREDIT_CARD"
});

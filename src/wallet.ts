import { Wallet } from "./generated/api/Wallet";
import { splitAt } from "./utils";

const censorPan: (pan: string) => string = (rawPan: string) => {
  const pan = rawPan.replace(/ /g, "");
  const [panPrefix, panSuffix] = splitAt(pan.length - 4, pan);

  return panPrefix.replace(/.*/, "*") + panSuffix;
};

export const createResponseWallet: (wallet: Wallet) => Wallet = (
  wallet: Wallet
) => {
  // eslint-disable-next-line functional/no-let
  let creditCard;
  if (wallet.creditCard) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const censoredPan = censorPan(wallet.creditCard.pan!);

    creditCard = {
      ...wallet.creditCard,
      brand: "OTHER",
      brandLogo:
        "https://acardste.vaservices.eu/wallet/assets/img/creditcard/generic.png",
      flagForwardCreateToTkm: false,
      flagForwardDeleteToTkm: false,
      flags3dsVerified: false,
      hasAlreadyPaid: false,
      isOnUs: false,
      onlyOnUs: false,
      pan: censoredPan,
      securityCode: undefined
    };
  }

  const walletOverrides = {
    creditCard,
    favourite: false,
    idPagamentoFromEC: undefined,
    idPsp: 1122602,
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
      id: 1122602,
      idCard: 1050,
      idChannel: "00799960158_10",
      idIntermediary: "00799960158",
      idPsp: "BCITITMM",
      isPspOnus: false,
      lingua: "IT",
      logoPSP:
        "https://acardste.vaservices.eu/pp-restapi/v4/resources/psp/1122602",
      participant: "CT000097",
      paymentModel: 1,
      paymentType: "CP",
      serviceAvailability: "7/7-24H",
      serviceDescription:
        "Clienti e non delle Banche del Gruppo Intesa Sanpaolo possono disporre pagamenti con carte di pagamento VISA-MASTERCARD",
      serviceLogo:
        "https://acardste.vaservices.eu/pp-restapi/v4/resources/service/1122602",
      serviceName: "Pagamento con Carte",
      solvedByPan: false,
      tags: ["VISA", "MASTERCARD"]
    },
    pspEditable: false,
    registeredNexi: false,
    saved: false,
    services: ["BPD", "FA", "pagoPA"]
  };

  return {
    ...wallet,
    ...walletOverrides
  } as Wallet;
};

import { Wallet } from "../generated/payment_manager/Wallet";
import { CreditCard } from "../generated/payment_manager/CreditCard";
import { splitAt } from "./utils";

const censorPan: (pan: string) => string = (rawPan: string) => {
  const pan = rawPan.replace(/ /g, "");
  const [panPrefix, panSuffix] = splitAt(pan.length - 4, pan);

  return panPrefix.replace(/./g, "*") + panSuffix;
};

export const createResponseWallet: (wallet: Wallet) => Wallet = (
  wallet: Wallet
) => {
  // eslint-disable-next-line functional/no-let
  let creditCard = wallet.creditCard as CreditCard;

  if (creditCard) {
    const { expireMonth, expireYear, holder, pan } = creditCard;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const censoredPan = censorPan(pan!);
    creditCard = {
      brand: "MASTERCARD",
      expireMonth,
      expireYear,
      holder,
      pan: censoredPan
    };
  }

  return {
    creditCard,
    idWallet: 94187,
    psp: {
      businessName: "Intesa Sanpaolo S.p.A",
      directAcquirer: false,
      fixedCost: {
        amount: 100,
        currency: "EUR",
        decimalDigits: 2
      },
      logoPSP:
        "https://acardste.vaservices.eu/pp-restapi/v4/resources/psp/1123779",
      serviceAvailability: "7/7-24H"
    },
    pspEditable: false,
    type: wallet.type
  } as Wallet;
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

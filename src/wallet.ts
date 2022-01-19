import { Validation } from "io-ts";
import { pipe } from "fp-ts/function";
import { right } from "fp-ts/Either";
import { splitAt } from "./utils";
import { Wallet } from "./generated/api/Wallet";

const censorPan: (pan: string) => string = (rawPan: string) => {
  const pan = rawPan.replace(/ /g, "");
  const [panPrefix, panSuffix] = splitAt(pan.length - 4, pan);

  return panPrefix.replace(/./g, "*") + panSuffix;
};

export const createResponseWallet: (wallet: Wallet) => Validation<unknown> = (
  wallet: Wallet
) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { expireMonth, expireYear, holder, pan } = wallet.creditCard!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const censoredPan = censorPan(pan!);
  const creditCard = {
    brand: "MASTERCARD",
    brandLogo:
      "https://acardste.vaservices.eu/wallet/assets/img/creditcard/carta_mc.png",
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expireMonth: expireMonth!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    expireYear: expireYear!,
    flag3dsVerified: false,
    flagForwardCreateToTkm: false,
    flagForwardDeleteToTkm: false,
    hasAlreadyPaid: false,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    holder: holder!,
    id: 75603,
    isOnUs: true,
    onlyOnUs: false,
    pan: censoredPan
  };

  const walletSession = {
    creditCard,
    idWallet: 94187,
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
    services: ["pagoPA", "FA", "BPD"],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    type: wallet.type!
  };

  return pipe(
    right({
      favourite: false,
      idPagamentoFromEC: "e1283f0e673b4789a2af87fd9b4043f4",
      idPsp: 1123779,
      isPspToIgnore: false,
      onboardingChannel: "IO-PAY",
      pagoPa: true,
      ...wallet,
      ...walletSession
    })
  );
};

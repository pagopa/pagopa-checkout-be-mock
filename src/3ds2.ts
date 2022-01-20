/**
 * 3DS challenge status.
 * Normal state flow: AwaitingMethod -> AfterMethod -> AwaitingChallenge -> AfterChallenge -> Confirmed
 */
export enum Transaction3DSStatus {
  AwaitingMethod = 15,
  AfterMethod = 17,
  AwaitingChallenge = 16,
  AfterChallenge = 18,
  Confirmed = 3
}

export const encode3ds2MethodData: (idTransaction: number) => string = (
  idTransaction: number
) => {
  const encodedTransactionId = Buffer.from(idTransaction.toString()).toString(
    "base64"
  );
  const methodData = {
    threeDSMethodNotificationURL: `http://localhost:8080/api/checkout/v1/transactions/${encodedTransactionId}/method`,
    threeDSServerTransID: "97808490-b371-4f5f-bb9c-5f5de61107d0"
  };

  return Buffer.from(JSON.stringify(methodData)).toString("base64");
};

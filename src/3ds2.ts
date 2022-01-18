export const encode3ds2MethodData: (idTransaction: number) => string = (
  idTransaction: number
) => {
  const encodedTransactionId = Buffer.from(idTransaction.toString()).toString(
    "base64"
  );
  const methodData = {
    threeDSMethodNotificationURL: `https://api.uat.platform.pagopa.it/api/checkout/payment-transactions/v1/transactions/${encodedTransactionId}/method`,
    threeDSServerTransID: "97808490-b371-4f5f-bb9c-5f5de61107d0"
  };

  return Buffer.from(JSON.stringify(methodData)).toString("base64");
};
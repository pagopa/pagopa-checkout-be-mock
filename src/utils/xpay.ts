import {
  StatusEnum,
  XPayPaymentAuthorization
} from "../generated/pgs/XPayPaymentAuthorization";
import { XPayPaymentAuthorizationError } from "../generated/pgs/XPayPaymentAuthorizationError";

export const createSuccessXPayPollingResponseEntity = (
  requestId: string
): XPayPaymentAuthorization => ({
  html:
    '\n\n\n<html>\n<head>\n  <script type="text/javascript">\n    function moveWindow() {\n      var form = document.getElementById("downloadForm");\n      if (form != null) {\n        form.submit();\n      }\n    }\n  </script>\n<title>3DSECURE</title>\n<link rel="icon" href="acs/images/favicon.ico" type="image/x-icon" />\n<link rel="shortcut icon" href="acs/images/favicon.ico" type="image/x-icon" />\n</head>\n\n<body>\n<form id="downloadForm"\n      action="https://int-ecommerce.nexi.it/SitoInt/AcsServer"\n      method="POST">\n  <!--  Dati Carta -->\n  <input type="hidden" name="PaReq" value="WSxZLDEsMDEsQUN4bW03ckxKTjN1MnpWekpBMWpac0pJTkFVPSxVU0QsWSwxLEE=">\n  <input type="hidden" name="TermUrl" value="https://int-ecommerce.nexi.it/ecomm/3dsResponse">\n  <!--  Parametri MPI -->\n  <input type="hidden" name="mpi_xid" value="iYd26fROFW1jHgzT5IbSiPJGrBI=" /><input type="hidden" name="mpi_digest" value="7eAE4F+Vj9J0GodoiGlYNmSDSUw=" /><input type="hidden" name="mpi_recurEnd" value="" /><input type="hidden" name="mpi_purchAmount" value="12345" /><input type="hidden" name="mpi_okUrl" value="https://int-ecommerce.nexi.it/ecomm/3dsResponse" /><input type="hidden" name="mpi_expiry" value="3012" /><input type="hidden" name="mpi_failUrl" value="https://int-ecommerce.nexi.it/ecomm/3dsResponse" /><input type="hidden" name="mpi_version" value="2.0" /><input type="hidden" name="mpi_currency" value="978" /><input type="hidden" name="mpi_MD" value="q6xUnmsTre7Kddm6SCWYYgGB.xpdemoas1" /><input type="hidden" name="mpi_installment" value="" /><input type="hidden" name="mpi_exponent" value="2" /><input type="hidden" name="mpi_merchantID" value="00061134" /><input type="hidden" name="mpi_recurFreq" value="" /><input type="hidden" name="mpi_description" value="108728877_1672842796366" /><input type="hidden" name="mpi_deviceCategory" value="0" /><input type="hidden" name="mpi_pan" value="4000000000000101" />\n  <!-- To support javascript unaware/disabled browsers -->\n  <div style="text-align:center;">\n    <noscript>\n      <p align="center">Please click the submit button below.<br>\n        <input type="submit" name="submit" value="Submit"></p>\n    </noscript>\n  </div>\n</form>\n<script type="text/javascript">\nmoveWindow();\n</script>\n</body>\n</html>\n',
  paymentAuthorizationId: requestId,
  status: StatusEnum.CREATED
});

export const createDeletedXPayPollingResponseEntity = (
  requestId: string
): XPayPaymentAuthorization => ({
  paymentAuthorizationId: requestId,

  status: StatusEnum.DENIED
});

export const createNotFoundXPayPollingResponseEntity = (): XPayPaymentAuthorizationError => ({
  errorDetail: "RequestId not found"
});

export const createAuthorizedXPayPollingResponseEntity = (
  requestId: string
): XPayPaymentAuthorization => ({
  paymentAuthorizationId: requestId,
  status: StatusEnum.AUTHORIZED
});

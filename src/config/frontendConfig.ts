import EmailPasswordWebJs from "supertokens-web-js/recipe/emailpassword";
import Session from "supertokens-web-js/recipe/session";

// for supertoken
// learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo

export const frontendConfig = () => {
  return {
    appInfo: {
      appName: "My Programming Journey",
      apiDomain: "http://localhost:3100",
      apiBasePath: "/token-admin",
    },
    recipeList: [
      EmailPasswordWebJs.init(),
      Session.init({ tokenTransferMethod: "header" }),
    ],
    // enableDebugLogs: true,
  };
};

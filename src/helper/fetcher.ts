import { signIn, signOut } from "supertokens-web-js/recipe/emailpassword";
import { log } from "./common";

const baseURL = "http://localhost:3100";

async function cmsSignIn(email: string, password: string) {
  try {
    const loginResult = await signIn({
      formFields: [
        {
          id: "email",
          value: email,
        },
        {
          id: "password",
          value: password,
        },
      ],
    });

    log("--- login result ---");
    log(loginResult);

    if (
      loginResult.status === "FIELD_ERROR" ||
      loginResult.status === "WRONG_CREDENTIALS_ERROR"
    ) {
      return Promise.reject("incorrect email or password");
    } else if (loginResult.status === "SIGN_IN_NOT_ALLOWED") {
      return Promise.reject("sign in not allowed");
    } else {
      return Promise.resolve("success");
    }
  } catch (error: any) {
    log("--- login error ---");
    log(error);

    return Promise.reject("something went wrong");
  }
}

async function cmsSignout() {
  await signOut();
}

export { cmsSignIn, cmsSignout };

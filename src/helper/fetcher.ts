import { signIn, signOut } from "supertokens-web-js/recipe/emailpassword";
import { log, errorLog } from "./common";
import axios, { AxiosRequestConfig, GenericAbortSignal } from "axios";

const baseURL = "http://localhost:3100/cms";

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

async function getAPI(
  path: string,
  params: any = {},
  cancelSignal?: GenericAbortSignal
) {
  return new Promise((resolve, reject) => {
    const config: AxiosRequestConfig = {};

    if (Object.keys(params).length > 0) {
      config.params = params;
    }

    if (cancelSignal != null) {
      config.signal = cancelSignal;
    }

    axios
      .get(`${baseURL}${path}`, config)
      .then(function (response) {
        log(response);
        if (response.status === 200 && response.statusText === "OK") {
          resolve(response.data);
        } else {
          reject(response.data);
        }
      })
      .catch(function (error) {
        errorLog(error);

        if (error.response !== undefined && error.response !== null) {
          if (error.response.data !== undefined && error.response !== null) {
            reject(error.response.data);
            return;
          }
        }
        reject(error.message);
      });
  });
}

async function postAPI(path: string, formData: never) {}

export { cmsSignIn, cmsSignout, getAPI, postAPI };

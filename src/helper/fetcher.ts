import { authClient } from "@/lib/auth-client";
import { log, errorLog } from "./common";
import axios, { AxiosRequestConfig, GenericAbortSignal } from "axios";
import { router, generateRoutePath } from "@/router/route";

const baseURL = "/api-prod/cms";
axios.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      router.navigate(generateRoutePath("/login", false), { replace: true });
    }
    return Promise.reject(error);
  },
);

async function cmsSignIn(email: string, password: string) {
  try {
    const result = await authClient.signIn.email({
      email,
      password,
    });

    log("--- login result ---");
    log(result);

    if (result.error) {
      return { data: null, error: "incorrect email or password" };
    }

    return { data: result.data, error: null };
  } catch (error: any) {
    log("--- login error ---");
    log(error);

    return { data: null, error: "something went wrong" };
  }
}

async function cmsSignout() {
  await authClient.signOut();
}

async function serverApi(
  path: string,
  method: string = "get",
  params?: { [key: string]: any },
  formData?: { [key: string]: any },
  cancelSignal?: GenericAbortSignal,
) {
  return new Promise((resolve, reject) => {
    const config: AxiosRequestConfig = {
      method: method,
      url: `${baseURL}${path}`,
      withCredentials: true,
    };

    if (Object.keys(params ?? {}).length > 0) {
      config.params = params;
    } else if (formData !== undefined && formData !== null) {
      config.data = formData;
    }

    if (cancelSignal != null) {
      config.signal = cancelSignal;
    }

    axios(config)
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

export { cmsSignIn, cmsSignout, serverApi };

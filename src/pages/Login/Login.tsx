import { ReactNode, useContext, useState } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { cmsSignIn } from "@/helper/fetcher";
import GridContainer from "@/components/ui/grid_system/GridContainer";
import GridRow from "@/components/ui/grid_system/GridRow";
import GridColumn from "@/components/ui/grid_system/GridColumn";
import Card from "@/components/ui/card/Card";
import InputField from "@/components/ui/form/InputField";
import CustomButton from "@/components/ui/button/CustomButton";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "@/context/GlobalContext";
import { log } from "@/helper/common";
import { generateRoutePath } from "@/router/route";

interface LoginFormInterface {
  email: string;
  password: string;
}

const eye: JSX.Element = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path
      fillRule="evenodd"
      d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
      clipRule="evenodd"
    />
  </svg>
);

const eyeSlash: JSX.Element = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
    <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
    <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
  </svg>
);
// TODO: can use flowbite for tooltip / snackbar / table ...etc
function Login() {
  const navigate = useNavigate();
  const { showLoading, setLoading } = useContext(GlobalContext);
  const [showPW, setShowPW] = useState(false);

  const form = useForm<LoginFormInterface>({
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormInterface> = async (
    data: LoginFormInterface
  ) => {
    /* let test = "";

    const count = Math.floor(Math.random() * 5) + 1;

    for (let i = 0; i < count; i++) {
      test +=
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. ";
    }

    toastDispatch({
      actionType: "insert",
      text: test,
      type: "success",
    }); */
    log("--- Login Data ---");
    log(data);
    if (!showLoading) {
      setLoading(true);
      try {
        const result = await cmsSignIn(data.email, data.password);
        log("--- Sign In Result ---");
        log(result);
        setLoading(false);
        navigate(generateRoutePath("/post"), { replace: true });
      } catch (error: any) {
        log("--- Sign In Error ---");
        log(error);
        setLoading(false);
      }
    }
  };

  /* for password suffix icon */
  function passwordIcon(): ReactNode {
    return (
      <button
        type="button"
        className="suffix-icon"
        onClick={() => setShowPW(!showPW)}
      >
        {showPW ? eyeSlash : eye}
      </button>
    );
  }

  return (
    <FormProvider {...form}>
      <div>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          autoComplete="off"
        >
          <Card showShadow={true} className="m-4 max-w-[550px]">
            <GridContainer>
              <GridRow>
                <GridColumn cols={12}>
                  <InputField
                    id="email"
                    name="email"
                    required={true}
                    validateEmail={true}
                    labelText="Email"
                  ></InputField>
                </GridColumn>

                <GridColumn cols={12}>
                  <InputField
                    id="password"
                    type={showPW ? "text" : "password"}
                    required={true}
                    name="password"
                    labelText="Password"
                    suffixIcon={passwordIcon()}
                  ></InputField>
                </GridColumn>
              </GridRow>

              <GridRow className="mt-4">
                <GridColumn cols={12}>
                  <CustomButton
                    text="Login"
                    type="submit"
                    block={true}
                    loading={showLoading}
                  ></CustomButton>
                </GridColumn>
              </GridRow>
            </GridContainer>
          </Card>
        </form>
      </div>
    </FormProvider>
  );
}

export default Login;

import { ReactNode, useContext, useState } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { cmsSignIn } from "@/helper/fetcher";
import GridContainer from "@/components/ui/grid_system/GridContainer";
import GridRow from "@/components/ui/grid_system/GridRow";
import GridColumn from "@/components/ui/grid_system/GridColumn";
import Card from "@/components/ui/card/Card";
import InputField from "@/components/ui/form/InputField";
import CustomButton from "@/components/ui/button/CustomButton";
import { useNavigate } from "react-router";
import { GlobalContext } from "@/context/GlobalContext";
import { log } from "@/helper/common";
import { generateRoutePath } from "@/router/route";
import { eyeIcon, eyeSlashIcon } from "@/components/ui/IconElement";
interface LoginFormInterface {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const { showLoading, setLoading, toastDispatch } = useContext(GlobalContext);
  const [showPW, setShowPW] = useState(false);

  const form = useForm<LoginFormInterface>({
    mode: "onSubmit",
    disabled: showLoading,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormInterface> = async (
    data: LoginFormInterface
  ) => {
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
        toastDispatch({
          actionType: "insert",
          text: "Incorrect Email or Password",
          type: "error",
        });
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
        {showPW ? eyeSlashIcon : eyeIcon}
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
                {/* email */}
                <GridColumn cols={12}>
                  <InputField
                    id="email"
                    name="email"
                    required={true}
                    validateEmail={true}
                    labelText="Email"
                    disabled={showLoading}
                  ></InputField>
                </GridColumn>

                {/* password */}
                <GridColumn cols={12}>
                  <InputField
                    id="password"
                    type={showPW ? "text" : "password"}
                    required={true}
                    name="password"
                    labelText="Password"
                    suffixIcon={passwordIcon()}
                    disabled={showLoading}
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

import TiptapEditor from "@/components/tiptap-editor/TiptapEditor";
import Card from "@/components/ui/card/Card";
import InputField from "@/components/ui/form/InputField";
import GridColumn from "@/components/ui/grid_system/GridColumn";
import GridContainer from "@/components/ui/grid_system/GridContainer";
import GridRow from "@/components/ui/grid_system/GridRow";
import { FormProvider, useForm } from "react-hook-form";

function PostDetail() {
  const postDetailForm = useForm({
    mode: "onSubmit",
    defaultValues: {
      "post-title": "",
    },
  });

  const onFormSubmit = (data: any) => {};

  return (
    <>
      <Card flat={true}>
        <FormProvider {...postDetailForm}>
          <form
            onSubmit={postDetailForm.handleSubmit(onFormSubmit)}
            noValidate
            autoComplete="off"
          >
            <GridContainer>
              <GridRow>
                <GridColumn cols={12}>
                  <InputField
                    id="post-title"
                    name="post-title"
                    labelText="Post Title"
                    required={true}
                    boldLabel={true}
                  ></InputField>
                </GridColumn>

                <GridColumn cols={12}>
                  <label className="pb-1 font-bold">Post Content</label>
                  <TiptapEditor></TiptapEditor>
                </GridColumn>
              </GridRow>
            </GridContainer>
          </form>
        </FormProvider>
      </Card>
    </>
  );
}

export default PostDetail;

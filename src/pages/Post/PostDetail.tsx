import TiptapEditor from "@/components/tiptap-editor/TiptapEditor";
import Card from "@/components/ui/card/Card";
import InputField from "@/components/ui/form/InputField";
import GridColumn from "@/components/ui/grid_system/GridColumn";
import GridContainer from "@/components/ui/grid_system/GridContainer";
import GridRow from "@/components/ui/grid_system/GridRow";
import DatePickerField from "@/components/ui/form/DatepickerField";
import { GlobalContext } from "@/context/GlobalContext";
import { log } from "@/helper/common";
import { serverApi } from "@/helper/fetcher";
import { useContext, useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

function PostDetail() {
  const { showLoading, setLoading, toastDispatch } = useContext(GlobalContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [categoryList, setCategoryList] = useState<
    Array<{
      id: number;
      name: string;
    }>
  >([]);
  const [tagsList, setTagsList] = useState<
    Array<{
      id: number;
      name: string;
    }>
  >([]);

  const postDetailForm = useForm({
    mode: "onSubmit",
    defaultValues: {
      "post-title": "",
      "post-date": new Date(),
    },
  });

  const abortControllerRef = useRef<Map<string, AbortController>>(new Map());

  // for abort controller
  function updateAbortControllerRef(
    key: "post" | "tag" | "category",
    reset: boolean = true
  ) {
    if (
      abortControllerRef.current !== null &&
      abortControllerRef.current.has(key)
    ) {
      abortControllerRef.current.get(key)?.abort();
      abortControllerRef.current.delete(key);
    }

    if (reset) {
      abortControllerRef.current.set(key, new AbortController());
    }
  }

  function getAbortController(key: "post" | "tag" | "category") {
    return abortControllerRef.current.get(key)?.signal;
  }

  // db function
  async function getPost() {
    try {
      const payload: any = { id };

      const result: any = await serverApi(
        "/post/detail",
        "get",
        payload,
        {},
        getAbortController("post")
      );

      log("--- Get Post data ---");
      log(result);

      postDetailForm.setValue("post-title", result.post_data.title);
      postDetailForm.setValue("post-date", new Date(result.post_data.date));

      getCategoryList();
      getTagsList();
    } catch (error) {
      log("--- Get Post data error ---");
      log(error);
    } finally {
    }
  }

  async function getCategoryList() {
    try {
      const result: any = await serverApi(
        "/categories/id-name-list",
        "get",
        {},
        {},
        getAbortController("category")
      );

      log("--- Get Category data ---");
      log(result);

      if (Array.isArray(result)) {
        setCategoryList([]);
      } else {
        setCategoryList(result.data);
      }
    } catch (error) {
      log("--- Get Category data error ---");
      log(error);

      setCategoryList([]);
    }
  }

  async function getTagsList() {
    try {
      const result: any = await serverApi(
        "/tags/id-name-list",
        "get",
        {},
        {},
        getAbortController("tag")
      );

      log("--- Get Tags data ---");
      log(result);

      if (Array.isArray(result)) {
        setTagsList([]);
      } else {
        setTagsList(result.data);
      }
    } catch (error) {
      log("--- Get Tags data error ---");
      log(error);

      setTagsList([]);
    }
  }

  const onFormSubmit = (data: any) => {
    // TODO:
    // Convert Date back to string for API submission if needed
    // const submitData = {
    //   ...data,
    //   "post-date": data["post-date"] ? dateToYMD(data["post-date"]) : "",
    // };
  };

  useEffect(() => {
    updateAbortControllerRef("post");
    updateAbortControllerRef("tag");
    updateAbortControllerRef("category");

    getPost();

    return () => {
      // cancel the previous request
      updateAbortControllerRef("post", false);
      updateAbortControllerRef("tag", false);
      updateAbortControllerRef("category", false);
    };
  }, []);

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

                <GridColumn xl={6} lg={6} md={6} sm={6} xs={12} cols={12}>
                  <DatePickerField
                    name="post-date"
                    labelText="Post Date"
                  ></DatePickerField>
                </GridColumn>

                <GridColumn
                  xl={6}
                  lg={6}
                  md={6}
                  sm={6}
                  xs={12}
                  cols={12}
                ></GridColumn>

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

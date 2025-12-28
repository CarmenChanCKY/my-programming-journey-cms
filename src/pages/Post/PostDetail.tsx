import TiptapEditor from "@/components/tiptap-editor/TiptapEditor";
import Card from "@/components/ui/card/Card";
import InputField from "@/components/ui/form/InputField";
import GridColumn from "@/components/ui/grid_system/GridColumn";
import GridContainer from "@/components/ui/grid_system/GridContainer";
import GridRow from "@/components/ui/grid_system/GridRow";
import DatePickerField from "@/components/ui/form/DatepickerField";
import { GlobalContext } from "@/context/GlobalContext";
import { dateToYMD, log, searchDropdownValueByText } from "@/helper/common";
import { serverApi } from "@/helper/fetcher";
import { useContext, useEffect, useRef, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import DropdownField, {
  DropdownItemListInterface,
} from "@/components/ui/form/DropdownField";
import IconButton from "@/components/ui/button/IconButton";
import { addIcon, deleteIcon } from "@/components/ui/IconElement";
import CustomButton from "@/components/ui/button/CustomButton";

function PostDetail() {
  const { showLoading, setLoading, toastDispatch } = useContext(GlobalContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [pageInit, setPageInit] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<
    Array<DropdownItemListInterface>
  >([]);
  const [tagsList, setTagsList] = useState<Array<DropdownItemListInterface>>(
    []
  );

  const postDetailForm = useForm({
    mode: "onSubmit",
    defaultValues: {
      "post-title": "",
      "post-date": new Date(),
      "post-slug": "",
      "post-category": -1 as string | number,
      "post-tags": [] as Array<number> | string,
      "post-content": "",
      "meta-keyword": "",
      "meta-description": "",
      references: [] as Array<Record<string, any>>,
    },
  });

  const { control } = postDetailForm;
  const {
    fields: referenceFields,
    append: appendReference,
    remove: removeReference,
  } = useFieldArray({
    control,
    name: "references",
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
      postDetailForm.setValue("post-slug", result.post_data.slug);
      postDetailForm.setValue("post-content", result.post_data.content);
      postDetailForm.setValue("meta-keyword", result.post_data.meta_keyword);
      postDetailForm.setValue(
        "meta-description",
        result.post_data.meta_description
      );

      postDetailForm.setValue(
        "references",
        result.post_reference.map((obj: any) => {
          return { "ref-name": obj.name, "ref-hyperlink": obj.hyperlink };
        })
      );

      postDetailForm.setValue("post-category", result.post_data.category_id);

      postDetailForm.setValue(
        "post-tags",
        result.tags_data.map((obj: any) => {
          return obj.tags_id;
        })
      );

      getCategoryList();
      getTagsList();

      setPageInit(true);
    } catch (error) {
      log("--- Get Post data error ---");
      log(error);
    } finally {
      setLoading(false);
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
        setCategoryList(
          result.data.map((obj: any) => {
            return { text: obj.name, value: obj.id };
          })
        );
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
        setTagsList(
          result.data.map((obj: any) => {
            return { text: obj.name, value: obj.id };
          })
        );
      }
    } catch (error) {
      log("--- Get Tags data error ---");
      log(error);

      setTagsList([]);
    }
  }

  const onFormSubmit = (data: any) => {
    console.log(data);

    const submitData: {
      title: string;
      date: string;
      slug: string;
      category_id: number;
      tags_id_list: Array<number>;
      content: string;
      "meta-keyword": string;
      "meta-description": string;
      references: Array<{ name: string; hyperlink: string }>;
    } = {
      title: data["post-title"],
      date: data["post-date"] ? dateToYMD(data["post-date"]) : "",
      slug: data["post-slug"].trim().replaceAll(" ", "-"),
      category_id: -1,
      tags_id_list: [],
      content: data["post-content"],
      "meta-keyword": data["meta-keyword"],
      "meta-description": data["meta-description"],
      references: [],
    };

    // search category id
    submitData.category_id = parseInt(
      searchDropdownValueByText(data["post-category"], categoryList).toString()
    );

    // search tags id
    const splitTags = data["post-tags"].split(", ");
    for (let i = 0; i < splitTags.length; i++) {
      submitData.tags_id_list.push(
        parseInt(searchDropdownValueByText(splitTags[i], tagsList).toString())
      );
    }

    submitData.references = data["references"].map(
      (obj: { "ref-name": string; "ref-hyperlink": string }) => {
        return { name: obj["ref-name"], hyperlink: obj["ref-hyperlink"] };
      }
    );

    console.log(submitData);

    // TODO: save to backend
  };

  useEffect(() => {
    updateAbortControllerRef("post");
    updateAbortControllerRef("tag");
    updateAbortControllerRef("category");

    if (id !== undefined && id !== null && id != "") {
      setLoading(true);
      getPost();
    } else {
      getCategoryList();
      getTagsList();
    }

    return () => {
      // cancel the previous request
      updateAbortControllerRef("post", false);
      updateAbortControllerRef("tag", false);
      updateAbortControllerRef("category", false);
    };
  }, []);

  useEffect(() => {
    const categoryID = postDetailForm.getValues("post-category");

    const categoryIndex = categoryList.findIndex(
      (obj: DropdownItemListInterface) => {
        return parseInt(obj.value) === categoryID;
      }
    );

    if (categoryIndex !== -1) {
      postDetailForm.setValue(
        "post-category",
        categoryList[categoryIndex].text
      );
    }
  }, [categoryList]);

  useEffect(() => {
    const tagsIdList: any = postDetailForm.getValues("post-tags");

    const filterTags = tagsList.filter((obj: DropdownItemListInterface) => {
      return tagsIdList.includes(obj.value);
    });

    if (filterTags.length > 0) {
      postDetailForm.setValue(
        "post-tags",
        filterTags
          .map((obj: DropdownItemListInterface) => {
            return obj.text;
          })
          .join(", ")
      );
    }
  }, [tagsList]);

  return (
    <>
      <FormProvider {...postDetailForm}>
        <form
          onSubmit={postDetailForm.handleSubmit(onFormSubmit)}
          noValidate
          autoComplete="off"
        >
          <Card flat={true} className="mb-4">
            <GridContainer>
              <GridRow>
                <GridColumn cols={12}>
                  <InputField
                    id="post-title"
                    name="post-title"
                    labelText="Post Title"
                    required={true}
                  ></InputField>
                </GridColumn>

                <GridColumn xl={6} lg={6} md={6} sm={12} xs={12} cols={12}>
                  <DatePickerField
                    name="post-date"
                    labelText="Post Date"
                  ></DatePickerField>
                </GridColumn>

                <GridColumn xl={6} lg={6} md={6} sm={12} xs={12} cols={12}>
                  <InputField
                    id="post-slug"
                    name="post-slug"
                    labelText="Slug"
                    required={true}
                  ></InputField>
                </GridColumn>

                <GridColumn xl={6} lg={6} md={6} sm={12} xs={12} cols={12}>
                  <DropdownField
                    labelText="Category"
                    dropdownFieldID="post-category"
                    dropdownListID="post-category-list"
                    name="post-category"
                    itemList={categoryList}
                    required
                  ></DropdownField>
                </GridColumn>
                <GridColumn xl={6} lg={6} md={6} sm={12} xs={12} cols={12}>
                  <DropdownField
                    labelText="Tags"
                    dropdownFieldID="post-tags"
                    dropdownListID="post-tags-list"
                    name="post-tags"
                    itemList={tagsList}
                    multiple
                    required
                  ></DropdownField>
                </GridColumn>

                <GridColumn xl={6} lg={6} md={6} sm={12} xs={12} cols={12}>
                  <InputField
                    id="meta-keyword"
                    name="meta-keyword"
                    labelText="Meta Keyword"
                  ></InputField>
                </GridColumn>

                <GridColumn xl={6} lg={6} md={6} sm={12} xs={12} cols={12}>
                  <InputField
                    id="meta-description"
                    name="meta-description"
                    labelText="Meta Description"
                  ></InputField>
                </GridColumn>
              </GridRow>

              <GridRow>
                <GridColumn cols={12} className="w-full">
                  <label className="pb-1">Post Content</label>
                  {pageInit && (
                    <TiptapEditor name="post-content"></TiptapEditor>
                  )}
                </GridColumn>
              </GridRow>

              <GridRow>
                <GridColumn cols={12} className="flex justify-between">
                  <label className="pb-1">Post Reference</label>
                  <IconButton
                    icon={addIcon}
                    disabled={showLoading}
                    onClick={() =>
                      appendReference({
                        "ref-name": "",
                        "ref-hyperlink": "",
                      })
                    }
                  ></IconButton>
                </GridColumn>
              </GridRow>

              {referenceFields.map((field: any, index: any) => (
                <GridRow key={field.id}>
                  <GridColumn xl={6} lg={6} md={6} sm={12} xs={12} cols={12}>
                    <InputField
                      id={`ref-name-${index}`}
                      name={`references.${index}.ref-name`}
                      labelText="Reference Name"
                      required={true}
                    ></InputField>
                  </GridColumn>

                  <GridColumn
                    xl={6}
                    lg={6}
                    md={6}
                    sm={12}
                    xs={12}
                    cols={12}
                    className="flex items-center gap-2"
                  >
                    <div className="flex-1">
                      <InputField
                        id={`ref-hyperlink-${index}`}
                        name={`references.${index}.ref-hyperlink`}
                        labelText="Hyperlink"
                        required={true}
                      ></InputField>
                    </div>

                    <IconButton
                      icon={deleteIcon}
                      disabled={showLoading}
                      color="error"
                      plain
                      onClick={() => removeReference(index)}
                    ></IconButton>
                  </GridColumn>
                </GridRow>
              ))}
            </GridContainer>
          </Card>

          <CustomButton
            type="submit"
            text="Submit"
            color="success"
            loading={showLoading}
          ></CustomButton>
        </form>
      </FormProvider>
    </>
  );
}

export default PostDetail;

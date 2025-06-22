import { useContext } from "react";
import InputField from "@/components/ui/form/InputField";
import CustomButton from "@/components/ui/button/CustomButton";
import DropdownField, {
  DropdownItemListInterface,
} from "@/components/ui/form/DropdownField";
import { GlobalContext } from "@/context/GlobalContext";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { searchDropdownValueByText } from "@/helper/common";

interface SearchPostLayoutInterface {
  categoryItemList: Array<DropdownItemListInterface>;
  tagsItemList: Array<DropdownItemListInterface>;
  onSubmit: (returnValue: PostSearchResultInterface) => void;
}

interface PostSearchFormInterface {
  categoryID: string;
  tagsIDList: string;
  postTitle: string;
}

export interface PostSearchResultInterface {
  categoryID: number;
  tagsIDList: Array<number>;
  postTitle: string;
}

function SearchPostLayout(props: SearchPostLayoutInterface) {
  const { showLoading, tableLoading } = useContext(GlobalContext);

  // TODO: need to test
  // https://codesandbox.io/p/sandbox/festive-cannon-dw0unh?file=%2Fsrc%2FApp.tsx%3A44%2C17-44%2C25
  // https://codesandbox.io/p/sandbox/react-hook-form-material-ui-select-multiple-vcgry?file=%2Fsrc%2FApp.js

  const searchForm = useForm<PostSearchFormInterface>({
    mode: "onSubmit",
    defaultValues: {
      postTitle: "",
      categoryID:
        props.categoryItemList !== undefined &&
        props.categoryItemList !== null &&
        props.categoryItemList.length > 0
          ? props.categoryItemList[0].text
          : "",
      tagsIDList:
        props.tagsItemList !== undefined &&
        props.tagsItemList !== null &&
        props.tagsItemList.length > 0
          ? props.tagsItemList[0].text
          : "",
    },
  });

  const onFormSubmit = (data: PostSearchFormInterface) => {};

  return (
    <FormProvider {...searchForm}>
      <form
        className="mb-5"
        onSubmit={searchForm.handleSubmit((data: PostSearchFormInterface) => {
          onFormSubmit(data);
        })}
        noValidate
        autoComplete="off"
      >
        <div className="flex flex-wrap gap-4">
          <InputField
            className="flex-auto"
            id="search-input-field"
            name="postTitle"
            placeholder="Search Post Title"
            disabled={showLoading || tableLoading}
          ></InputField>

          <DropdownField
            className="flex-auto"
            dropdownFieldID="search-category-field"
            dropdownListID="search-category-list"
            name="categoryID"
            itemList={props.categoryItemList ?? []}
            placeholder="Category"
            disabled={showLoading || tableLoading}
          ></DropdownField>

          <DropdownField
            className="flex-auto"
            dropdownFieldID="search-tags-field"
            dropdownListID="search-tags-list"
            name="tagsIDList"
            itemList={props.tagsItemList ?? []}
            placeholder="Tags"
            multiple
            disabled={showLoading || tableLoading}
          ></DropdownField>

          <CustomButton
            text="Search"
            outline={true}
            color="success"
            type="submit"
            disabled={showLoading || tableLoading}
          ></CustomButton>
        </div>
      </form>
    </FormProvider>
  );
}

export default SearchPostLayout;

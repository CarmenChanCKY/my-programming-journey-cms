import InputField from "@/components/ui/form/InputField";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import CustomButton from "@/components/ui/button/CustomButton";
import DropdownField, {
  DropdownItemListInterface,
} from "@/components/ui/form/DropdownField";
import { GlobalContext } from "@/context/GlobalContext";
import { useContext } from "react";
import { searchDropdownValueByText } from "@/helper/common";

interface SearchFilterLayoutInterface {
  showSearchBar?: boolean;
  searchBarPlaceholder?: string;
  showFilter?: boolean;
  filterItemList?: Array<DropdownItemListInterface>;
  onSubmit: (returnValue: SearchFilterFormInterface) => void;
}

export interface SearchFilterFormInterface {
  searchField: string;
  filterField: string;
}

function SearchFilterLayout(props: SearchFilterLayoutInterface) {
  const { showLoading, tableLoading } = useContext(GlobalContext);

  const searchFilterForm = useForm<SearchFilterFormInterface>({
    mode: "onSubmit",
    defaultValues: {
      searchField: "",
      filterField:
        props.filterItemList !== undefined &&
        props.filterItemList !== null &&
        props.filterItemList.length > 0
          ? props.filterItemList[0].text
          : "",
    },
  });

  const onSearchFilterFormSubmit: SubmitHandler<
    SearchFilterFormInterface
  > = async (data: SearchFilterFormInterface) => {
    if (
      props.filterItemList !== undefined &&
      props.filterItemList !== null &&
      props.filterItemList.length > 0 &&
      data.filterField !== ""
    ) {
      data.filterField = searchDropdownValueByText(
        data.filterField,
        props.filterItemList
      );
    }

    props.onSubmit(data);
  };

  return (
    <FormProvider {...searchFilterForm}>
      <form
        className="mb-5"
        onSubmit={searchFilterForm.handleSubmit(onSearchFilterFormSubmit)}
        noValidate
        autoComplete="off"
      >
        <div className="flex flex-wrap gap-4">
          {props.showSearchBar && (
            <InputField
              className="flex-1"
              id="search-input-field"
              name="searchField"
              placeholder={props.searchBarPlaceholder}
              disabled={showLoading || tableLoading}
            ></InputField>
          )}

          {props.showFilter && (
            <DropdownField
              className="flex-1"
              dropdownFieldID="search-filter-field"
              dropdownListID="search-filter-list"
              name="filterField"
              itemList={props.filterItemList ?? []}
              disabled={showLoading || tableLoading}
            ></DropdownField>
          )}

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

export default SearchFilterLayout;

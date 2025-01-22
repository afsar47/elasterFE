import { ComponentType, useCallback, useEffect, useState } from "react";
import AddNewCategoryModal from "../../DealerSharedComponent/AddNewCategoryModal";
import { Button, FormItem, Radio } from "@/components/ui";
import SelectAndButton from "@/components/ui/SelectAndButton";
import Input from "@/components/ui/Input";
import {
  ErrorMessage,
  Field,
  FieldInputProps,
  FieldProps,
  FormikErrors,
  FormikTouched,
  useFormikContext,
} from "formik";
import { FormFieldsName } from "../Fees/FeesStatistics";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { InputProps } from "react-select";
import { useAppDispatch, useAppSelector } from "../Store";
import { getAllCategtories } from "../../DealerInventory/store";

type BasicInfo = {
  touched: FormikTouched<FormFieldsName>;
  errors: FormikErrors<FormFieldsName>;
  setAddCategoryModelOpen: (open: boolean) => void;
};

const BasicInfo = (props: BasicInfo) => {
  const dispatch = useAppDispatch();
  const { touched, errors, setAddCategoryModelOpen } = props;
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [isAlertVisible, setIsAlertVisible] = useState(false); // State for alert visibility
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); // Track unsaved changes
  const allCategtories: any = useAppSelector(
    (state) => state.inventory.allCategories
  );
  const { values } = useFormikContext<FormFieldsName>(); // Access Formik context
  const [feeType, setFeeType] = useState(values.feeType ?? ""); // Uses the feeType from Formik values or defaults to an empty string

  useEffect(() => {
    console.log("Current Form Values:", values);
  }, [values]);
  

  const fetchData = useCallback(() => {
    dispatch(getAllCategtories("forDropDown"));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setFeeType(values.feeType || "");
  }, [values.feeType]);

  const handleNewCategoryClick = () => {
    setIsModalOpen(true); // Open modal on button click
  };

  const handleInputChange = (value: any) => {
    setHasUnsavedChanges(true); // Track unsaved changes
  };

  const { setFieldValue } = useFormikContext();

  const NumericFormatInput = ({
    onValueChange,
    ...rest
  }: Omit<NumericFormatProps, "form"> & {
    form: any;
    field: FieldInputProps<unknown>;
  }) => {
    return (
      <NumericFormat
        customInput={Input as ComponentType}
        type="text"
        autoComplete="off"
        onValueChange={onValueChange}
        {...rest}
      />
    );
  };

  const MarginInput = ({ field, form, ...props }: FieldProps) => {
    // console.log(field); // Should log field value now
    return <Input {...props} {...field} suffix="%" />;
  };

  const PriceInput = (props: any) => {
    return <Input {...props} value={props.field.value} prefix="$" />;
  };

  return (
    <div>
      {/* Name Field with FormItem and Field */}
      <FormItem
        label="Fee Name"
        className="mb-4"
        invalid={(errors.feeName && touched.feeName) as boolean}
        errorMessage={errors.feeName}
      >
        <Field
          type="text"
          name="feeName"
          placeholder="Enter name"
          component={Input}
          className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
          required
        />
      </FormItem>

      {/* Category Dropdown with FormItem and Add New Category Button */}
      <FormItem
        label="Category"
        invalid={(errors.category && touched.category) as boolean}
        errorMessage={errors.category}
      >
        <Field
          name="category"
          render={({ field, form }: FieldProps) => (
            <SelectAndButton
              options={allCategtories}
              addNewButtonLabel="Add New Category"
              value={allCategtories.find((c: any) => c.value === field.value)} // Match the value to prefill
              onChange={(value: any) => setFieldValue("category", value.value)}
              placeholder="Select or Add Category"
              addNewClick={() => setAddCategoryModelOpen(true)}
              className="mb-4"
            />
          )}
        />
        <ErrorMessage
          name="category"
          component="div"
          className="text-red-500 text-sm mb-2"
        />
      </FormItem>

      <FormItem
        label="Fees"
        className="mb-4"
        invalid={(errors.feeType && touched.feeType) as boolean}
        errorMessage={errors.feeType}
      >
        <div className="mt-4">
          <Radio.Group
            name="feeType"
            vertical
            value={feeType} // Ensure feeType value matches the initial value or is controlled
            onChange={(value: any) => setFieldValue("feeType", value)}
          >
            <Radio value="percentOfLineItem">Percent (%) of Line Item</Radio>
            <Radio value="percentOfService">Percent (%) of Service</Radio>
            <Radio value="fixedDollar">Fixed dollar ($) amount</Radio>
          </Radio.Group>
        </div>
      </FormItem>

      <FormItem
        label="Fee Amount"
        className="mb-4"
        invalid={(errors.feeAmount && touched.feeAmount) as boolean}
        errorMessage={errors.feeAmount}
      >
        {feeType &&
          (feeType === "fixedDollar" ? (
            <Field name="feeAmount">
              {({ field, form }: FieldProps) => (
                <NumericFormatInput
                  name="feeAmount"
                  form={form}
                  field={field}
                  placeholder="Fee Amount"
                  customInput={PriceInput as ComponentType}
                  onValueChange={(e) => form.setFieldValue(field.name, e.value)}
                  
                />
              )}
            </Field>
          ) : (
          //  (feeType === "percentOfLineItem" ?(
          //   <Field
          //   name="feeAmount"
          //   validate={(value: any) => {
          //     if (!value) {
          //       return "Fee amount is required";
          //     }
          //   }}
          // >
          //   {({ field, form }: FieldProps) => (
          //     <NumericFormatInput
          //       name="feeAmount"
          //       form={form}
          //       field={field}
          //       placeholder="Fee Amount"
          //       customInput={MarginInput as ComponentType}
          //       isAllowed={({ floatValue }) => (floatValue as number) <= 100}
          //       onValueChange={(e) => form.setFieldValue(field.name, e.value)
                  
          //       }

          //     />
          //   )}
          // </Field>
          //  ):(<Field
          //   name="feeAmount"
          //   validate={(value: any) => {
          //     if (!value) {
          //       return "Fee amount is required";
          //     }
          //   }}
          // >
          //   {({ field, form }: FieldProps) => (
          //     <NumericFormatInput
          //       name="feeAmount"
          //       form={form}
          //       field={field}
          //       placeholder="Fee Amount"
          //       customInput={MarginInput as ComponentType}
          //       isAllowed={({ floatValue }) => (floatValue as number) <= 100}
          //       onValueChange={(e) => form.setFieldValue(field.name, e.value)
                  
          //       }

          //     />
          //   )}
          // </Field>))
          <Field
            name={
              feeType === "percentOfLineItem"
                ? "percentOfLineItem"
                : "percentOfService"
            }
            validate={(value: any) => {
              if (!value) {
                return "Fee amount is required";
              }
            }}
          >
            {({ field, form }: FieldProps) => (
              <NumericFormatInput
                name="feeAmount"
                form={form}
                field={field}
                placeholder="Fee Amount"
                customInput={MarginInput as ComponentType}
                isAllowed={({ floatValue }) => (floatValue as number) <= 100}
                onValueChange={(e) => form.setFieldValue(field.name, e.value)}

              />
            )}
          </Field>
          ))}
      </FormItem>
    </div>
  );
};

export default BasicInfo;

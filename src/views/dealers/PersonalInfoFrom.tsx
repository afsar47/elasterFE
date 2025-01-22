import Input from '@/components/ui/Input';
import { FormItem } from '@/components/ui/Form';
import Select from '@/components/ui/Select';
import { HiUserCircle, HiMail, HiPhone } from 'react-icons/hi';
import { Field, FieldProps, FormikErrors, FormikTouched } from 'formik';

const statusOptions = [
    { value: true, label: 'Active' },
    { value: false, label: 'Inactive' },
];

type FormFieldsName = {
    fullname: string;
    email: string;
    phoneNumber: string;
    status: string;
};

type PersonalInfoFormProps = {
    touched: FormikTouched<FormFieldsName>;
    errors: FormikErrors<FormFieldsName>;
};

const PersonalInfoForm = (props: PersonalInfoFormProps) => {
    const { touched, errors } = props;

    return (
        <>
            <FormItem
                label="Name"
                invalid={errors.fullname && touched.fullname}
                errorMessage={errors.fullname}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="fullname"
                    placeholder="Name"
                    component={Input}
                    prefix={<HiUserCircle className="text-xl" />}
                />
            </FormItem>
            <FormItem
                label="Email"
                invalid={errors.email && touched.email}
                errorMessage={errors.email}
            >
                <Field
                    type="email"
                    autoComplete="off"
                    name="email"
                    placeholder="Email"
                    component={Input}
                    prefix={<HiMail className="text-xl" />}
                />
            </FormItem>
            <FormItem
                label="Phone Number"
                invalid={errors.phoneNumber && touched.phoneNumber}
                errorMessage={errors.phoneNumber}
            >
                <Field
                    type="text"
                    autoComplete="off"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    component={Input}
                    prefix={<HiPhone className="text-xl" />}
                />
            </FormItem>
            <FormItem
                label="Status"
                invalid={errors.status && touched.status}
                errorMessage={errors.status}
            >
                <Field name="status">
                    {({ field, form }: FieldProps) => (
                        <Select
                            options={statusOptions}
                            value={
                                statusOptions.find(
                                    (option) => option.value === field.value
                                ) || statusOptions[0]
                            } // Fallback to 'active'
                            onChange={(option) =>
                                form.setFieldValue(
                                    field.name,
                                    option?.value || false
                                )
                            }
                        />
                    )}
                </Field>
            </FormItem>
        </>
    );
};

export default PersonalInfoForm;

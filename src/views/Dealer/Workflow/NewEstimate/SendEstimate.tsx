import { Button, FormItem, Input, Notification, toast } from '@/components/ui';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup'
import { apiSendEstimateEmail } from '../../Services/WorkflowService';

const SendEstimate = ({ handleButtonClick, selectedCustomer, selectedVehicle, orderNumber, estimateId }: any) => {

    const initialValues = {
        reciepent: selectedCustomer?.email[0] || '',
        template: 'Default Template',
        subject: `Estimate (#${orderNumber}) ${
            selectedVehicle?.year
              ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`
              : ''
          }` || '',
        message: `Hi ${selectedCustomer?.firstName}, Below is a link to the invoice you requested from 247 Automotive. Please review and let us know if you have any questions.        
        ` || '',
    }

    const validationSchema = Yup.object().shape({
        reciepent: Yup.string().required("Reciepent is required"),
        template: Yup.string().required("Template is required"),
        subject: Yup.string().required("Subject is required"),
        message: Yup.string().required("Message is required"),
    })
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-[650px] h-[550px] rounded-lg shadow-lg relative border border-gray-200">
                <div className="flex justify-between items-center p-3 border-b">
                    <h3 className="text-base font-semibold">Send Estimate On Email</h3>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={handleButtonClick}
                    >
                        ✕
                    </button>
                </div>
                <div className="overflow-y-auto p-4" style={{ height: 'calc(100% - 110px)' }}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm }) => {
                            const htmlMessage = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email</title>
        </head>
        <body>
            <p>Hi ${selectedCustomer.firstName},</p>
            <p>
                Below is a link to the invoice you requested from 247 Automotive.
                Please review and let us know if you have any questions.
            </p>
            <p>
                <a href="https://admin.247automotive.services/estimate/${estimateId}">
                    View Invoice
                </a>
            </p>
        </body>
        </html>
    `;

                            apiSendEstimateEmail({
                                reciepent: values.reciepent,
                                subject: values.subject,
                                message: htmlMessage, // Pass `html` for backend
                            }).then(()=>{
                                setTimeout(() => {
                                    toast.push(
                                        <Notification title="Success" type="success">
                                            Email Sent Successfully
                                        </Notification>
                                    );
                                },400);
                            })
                            resetForm()
                            handleButtonClick()
                        }}
                    >
                        {({ touched, errors }) => (
                            <Form>
                                <FormItem label="Reciepent" className="mb-4"
                                    invalid={(errors.reciepent && touched.reciepent) as boolean}
                                    errorMessage={errors.reciepent}>
                                    <Field
                                        type="text"
                                        name="reciepent"
                                        placeholder="Enter Reciepent"
                                        component={Input}
                                        className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                                        required
                                    />
                                </FormItem>

                                <FormItem label="Template" className="mb-4"
                                    invalid={(errors.template && touched.template) as boolean}
                                    errorMessage={errors.template}>
                                    <Input type="text"
                                        name="template"
                                        disabled
                                        value={'Default Template'}
                                        placeholder="Enter name"
                                        className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                                        required ></Input>
                                </FormItem>

                                <FormItem label="Subject" className="mb-4"
                                    invalid={(errors.subject && touched.subject) as boolean}
                                    errorMessage={errors.subject}>
                                    <Field
                                        type="text"
                                        name="subject"
                                        placeholder="Enter Subject"
                                        component={Input}
                                        className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full"
                                        required
                                    />
                                </FormItem>

                                <FormItem
                                    label="Message"
                                    className="mb-4"
                                    invalid={(errors.message && touched.message) as boolean}
                                    errorMessage={errors.message}
                                >
                                    <Field
                                        as="textarea"
                                        name="message"
                                        placeholder="Enter Message"
                                        className="border border-gray-300 outline-none p-1 rounded-md focus:ring-2 focus:ring-indigo-500 w-full h-32"
                                        required
                                    />
                                </FormItem>

                                {/* <BasicInfo
                                    touched={touched}
                                    errors={errors}
                                    setAddCategoryModelOpen={setAddCategoryModelOpen}
                                /> */}
                                <div className="absolute bottom-0 left-0 right-0 flex justify-end p-2 border-t bg-white">
                                    <Button
                                        variant="primary"
                                        type="button"
                                        className="bg-gray-300 mr-2 px-4 py-1.5"
                                        onClick={handleButtonClick}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="solid"
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5"
                                    >
                                        Send
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    )
}

export default SendEstimate
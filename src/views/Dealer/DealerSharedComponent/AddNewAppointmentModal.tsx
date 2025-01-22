import { Avatar, Button, Card, Menu, Select, Switcher } from "@/components/ui";
import DateTimepicker from "@/components/ui/DatePicker/DateTimepicker";
import SelectAndButton from "@/components/ui/SelectAndButton";
import dayjs from "dayjs";
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { FaBell, FaCar, FaRegUser } from "react-icons/fa";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import {
  apiAddNewAppointment,
  apiUpdateAppointment,
  getAllCustomers,
  getAllVehicles,
} from "../DealerLists/Services/DealerListServices";
import { getAllEstimates } from "../Services/WorkflowService";
import * as Yup from "yup";
import AddNewCustomerModal from "./AddNewCustomerModal";
import AddNewVehicleModal from "./AddNewVehicleModal";

const AddNewAppointmentModal = ({
  eventsData,
  setEventsData,
  setModalOpen,
  isModalOpen,
  selectedEvent,
  isNewAppointment,
}: any) => {
  const disablePastDates = (date: Date) => {
    return dayjs(date).isBefore(dayjs(), "day"); // Disables dates before today
  };

  // console.log("Seleected appointment in modal : ", selectedEvent);
  // console.log("flag of appointment : ", isNewAppointment)

  const [selectedTimeRange, setSelectedTimeRange] = useState<[Date, Date]>([
    new Date(),
    new Date(new Date().getTime() + 60 * 60000),
  ]);
  const [customerSelected, setCustomerSelected] = useState(false);
  const [allCustomers, setallCustomers] = useState([]);
  const [allVehicles, setallVehicles] = useState([]);
  const [allEstimates, setallEstimates] = useState([]);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showVehicleForm, setshowVehicleForm] = useState(false);
  const [vehicleOptions, setVehicleOptions] = useState<any[]>([]);
  const [customerOptions, setCustomerOptions] = useState<any[]>([]);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    appointmentStartDate: Yup.string().required(
      "Start Date & Time is required"
    ),
    appointmentEndtDate: Yup.string().required("End Date & Time is required"),
    customer: Yup.string().required("Customer is required"),
    vehicle: Yup.string().required("Vehicle is required"),
    // order: Yup.string().required("Order is required"),
  });

  const handleAddAppointment = async (values: any) => {
    const startDateTime = new Date(values.appointmentStartDate);
    startDateTime.setHours(selectedTimeRange[0].getHours());
    startDateTime.setMinutes(selectedTimeRange[0].getMinutes());
    startDateTime.setSeconds(0);
    startDateTime.setMilliseconds(0);

    const endDateTime = new Date(values.appointmentEndtDate);
    endDateTime.setHours(selectedTimeRange[1].getHours());
    endDateTime.setMinutes(selectedTimeRange[1].getMinutes());
    endDateTime.setSeconds(0);
    endDateTime.setMilliseconds(0);

    const startDateTimeIso = startDateTime.toISOString();
    const endDateTimeIso = endDateTime.toISOString();

    const newEventData = {
      //   id: (eventsData.length + 1).toString(),
      title: values.title,
      start: startDateTime,
      end: endDateTime,
      customerId: values.customer,
      vehicleId: values.vehicle,
      note: values.note,
      sendConfirmation: values.sendConfirmation,
      sendReminder: values.sendReminder,
      eventColor: "orange",
      status : values.status,
    };

    setEventsData((prevEvents: any) => [...prevEvents, newEventData]);

    console.log("Appointment Data for update : ", newEventData);
    await apiAddNewAppointment(newEventData);
    // debugger;
    setModalOpen(false);
  };

  const handleUpdateAppointment = async (id: string, values: any) => {
    const startDateTime = new Date(values.appointmentStartDate);
    startDateTime.setHours(selectedTimeRange[0].getHours());
    startDateTime.setMinutes(selectedTimeRange[0].getMinutes());
    startDateTime.setSeconds(0);
    startDateTime.setMilliseconds(0);
  
    const endDateTime = new Date(values.appointmentEndtDate);
    endDateTime.setHours(selectedTimeRange[1].getHours());
    endDateTime.setMinutes(selectedTimeRange[1].getMinutes());
    endDateTime.setSeconds(0);
    endDateTime.setMilliseconds(0);
  
    const updatedEventData = {
      id, // Ensure the ID is retained for the update
      title: values.title,
      start: startDateTime,
      end: endDateTime,
      note: values.note,
      sendConfirmation: values.sendConfirmation,
      sendReminder: values.sendReminder,
      eventColor: "orange", // You can set or update the color as needed
      status: values.status,
    };
  
    // Update the event in the state
    setEventsData((prevEvents: any) =>
      prevEvents.map((event: any) =>
        event.id === id ? updatedEventData : event
      )
    );
  
    console.log("Updated Appointment Data: ", updatedEventData);
  
    // Call the API to persist the updated data
    await apiUpdateAppointment(id, updatedEventData);
  
    setModalOpen(false);
  };
  

  const onSwitcherToggle = (val: boolean, e: ChangeEvent) => {};
  const ConfirmationContent = ({
    icon,
    label,
  }: {
    icon: ReactNode;
    label: string;
  }) => {
    return (
      <div className="flex items-center gap-2 justify-between w-[200px]">
        <div>
          <span>{label}</span>
          <p className="text-xs text-gray-400">
            Will be sent when this appointment is saved.
          </p>
        </div>
        <Switcher defaultChecked onChange={onSwitcherToggle} />
      </div>
    );
  };

  const ReminderContent = ({
    icon,
    label,
  }: {
    icon: ReactNode;
    label: string;
  }) => {
    return (
      <div className="flex items-center gap-2 justify-between w-[200px]">
        <div>
          <span>{label}</span>
          <p className="text-xs text-gray-400">
            Will be sent 1 day before the appointment.
          </p>
        </div>
        <Switcher defaultChecked onChange={onSwitcherToggle} />
      </div>
    );
  };

  const createCustomerOptions = async () => {
    let customers = await getAllCustomers();
    if (customers.allCustomers && customers.allCustomers.length) {
      return customers.allCustomers.map((cust: any) => {
        const name = `${cust.firstName || ""} ${cust.lastName || ""}`;
        return {
          ...cust,
          value: name,
          label: (
            <div className="flex items-center justify-start w-full cursor-pointer">
              <Avatar
                shape="circle"
                size="sm"
                className="mr-4 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
              >
                {`${cust.firstName?.[0] || ""}${cust.lastName?.[0] || ""}`}
              </Avatar>
              <div className="flex flex-col">
                <p className="text-black">{name}</p>
                {cust.phoneNumber?.[0]?.number ? (
                  <p className="text-xs">
                    Mobile: {cust.phoneNumber[0].number}
                  </p>
                ) : null}
              </div>
            </div>
          ),
        };
      });
    }
    return []; // Explicitly return an empty array if no customers exist
  };

  const createVehicleOptions = async () => {
    try {
      const vehicles = await getAllVehicles();
      if (vehicles?.allVehicles?.length) {
        return vehicles.allVehicles.map((vehicle: any) => {
          const year = vehicle.year || "";
          const make = vehicle.make || "";
          const model = vehicle.model || "";
          const subModel = vehicle.subModel || "";
          const plateNumber = vehicle.licencePlate?.[0]?.plateNumber || "";

          return {
            ...vehicle, // Keep other properties intact
            value: vehicle._id,
            label: (
              <div className="flex items-center justify-start w-full cursor-pointer">
                <Avatar
                  shape="circle"
                  size="sm"
                  className="mr-4 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
                >
                  <FaCar />
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-black">{`${year} ${make} ${model}`}</p>
                  {subModel || plateNumber ? (
                    <p className="text-xs">{`${subModel} ${plateNumber}`}</p>
                  ) : null}
                </div>
              </div>
            ),
          };
        });
      }
      return []; // Return an empty array if no vehicles exist
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      return []; // Return an empty array in case of error
    }
  };

  //   const createEstimatesOptions = async () => {
  //     try {
  //       const allEstimates = await getAllEstimates(); // Updated to call `createVehicleOptions`
  //       if (allEstimates?.allEstimates?.length) {
  //         return allEstimates.allEstimates.map((estimate: any) => {
  //           return {
  //             ...estimate, // Keep other properties intact
  //             value: estimate._id,
  //             label: estimate.orderName,
  //           };
  //         });
  //       }
  //       return []; // Return an empty array in case of error
  //     } catch (error) {
  //       console.error("Error fetching vehicles:", error);
  //       return []; // Return an empty array in case of error
  //     }
  //   };

  const fetch = async () => {
    if (isModalOpen) {
      try {
        const allCustomers = await createCustomerOptions();
        setallCustomers(allCustomers);

        const allVehicles = await createVehicleOptions(); // Updated to call `createVehicleOptions`
        setallVehicles(allVehicles); // Correct state setter for vehicles

        // const allEstimates = await createEstimatesOptions(); // Updated to call `createVehicleOptions`
        setallEstimates(allEstimates);
      } catch (error) {
        console.error("Error in fetch:", error);
      }
    }
  };

  const handleButtonClick = () => {
    setShowCustomerForm(!showCustomerForm); // Toggle form visibility
  };

  const handleVehicleFormClose = () => {
    setshowVehicleForm(!showVehicleForm); // Toggle form visibility
  };

  useEffect(() => {
    const fetchVehicleOptions = async () => {
      const options = await createVehicleOptions();
      setVehicleOptions(options);
    };

    const fetchCustomerOptions = async () => {
      const customerOptions = await createCustomerOptions();
      setCustomerOptions(customerOptions);
    };

    fetchVehicleOptions();
    fetchCustomerOptions();
    fetch();
  }, []);

  const vehId = selectedEvent ? selectedEvent.vehicle : null;
  let vehicleDetails: string | null = null;
  if (vehicleOptions.length > 0) {
    const matchedVehicle = vehicleOptions.find(
      (vehicle) => vehicle._id === vehId
    );
    if (matchedVehicle) {
      vehicleDetails = `${matchedVehicle.year} ${matchedVehicle.make} ${matchedVehicle.model}`;
    }
  }

  const customId = selectedEvent ? selectedEvent.customer : null;
  let customerDetails: string | null = null;
  if (customerOptions.length > 0) {
    const metchedCustomer = customerOptions.find(
      (customer) => customer._id === customId
    );
    if (metchedCustomer) {
      customerDetails = `${metchedCustomer.firstName} ${metchedCustomer.lastName}`;
    }
  }
  // console.log("customer details : ", customerDetails);
  // console.log("Vehicle details : ", vehicleDetails);

  const appointmentEndDate = selectedEvent?.end
    ? new Date(selectedEvent.end)
    : null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[650px] h-[600px] rounded-lg shadow-lg relative border border-gray-200">
        <div className="flex justify-between items-center p-3 border-b">
        {!isNewAppointment ? (
          <h3 className="text-base font-semibold">Edit Appointment</h3>):(
            <h3 className="text-base font-semibold">Add Appointment</h3>
          )}
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setModalOpen(false)}
          >
            ✕
          </button>
        </div>
        <div className="overflow-hidden p-4 flex h-6/6">
          <div className="w-full">
            <Formik
              initialValues={{
                title: selectedEvent?.title || "",
                appointmentStartDate: selectedEvent?.start || "",
                appointmentEndDate: selectedEvent?.end || "",
                customer: selectedEvent?.customer || "",
                vehicle: selectedEvent?.vehicle || "",
                note: selectedEvent?.note || "",
                sendConfirmation: selectedEvent?.sendConfirmation || false,
                sendReminder: selectedEvent?.sendReminder || false,
                status: selectedEvent?.status || "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                if (selectedEvent) {
                  // Update logic
                  handleUpdateAppointment(selectedEvent.id, values);
                } else {
                  // Add new appointment logic
                  handleAddAppointment(values);
                }
                setSubmitting(false);
              }}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div className="mb-4">
                    <Field
                      type="text"
                      name="title"
                      className="border border-gray-300 rounded w-full p-2 mb-2"
                      placeholder="Title"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <DateTimepicker
                      disableDate={disablePastDates}
                      name="appointmentStartDate"
                      placeholder="Pick start date & time"
                      onChange={(value) =>
                        setFieldValue("appointmentStartDate", value)
                      }
                    />
                    <ErrorMessage
                      name="appointmentStartDate"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <DateTimepicker
                      disableDate={disablePastDates}
                      name="appointmentEndtDate"
                      placeholder="Pick end date & time"
                      onChange={
                        (value) => setFieldValue("appointmentEndtDate", value) // Set the value when it changes
                      }
                    />
                    <ErrorMessage
                      name="appointmentEndtDate"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="h-0.5 bg-gray-200 my-4"></div>

                  {!isNewAppointment ? (
                    <div className="mb-4">
                      <Field
                        type="text"
                        name="customer"
                        className="border border-gray-300 rounded w-full p-2 mb-2"
                        placeholder="Customer"
                        value={customerDetails || ""}
                      />
                      <ErrorMessage
                        name="customer"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  ) : (
                    <SelectAndButton
                      options={allCustomers}
                      addNewButtonLabel="Add New Customer"
                      onChange={(value: any) => {
                        setFieldValue("customer", value._id);
                        setCustomerSelected(!!value);
                      }}
                      placeholder="Select or Add Customer"
                      addNewClick={() => setShowCustomerForm(true)}
                      className="mb-4"
                    />
                  )}
                  <ErrorMessage
                    name="customer"
                    component="div"
                    className="text-red-500 text-sm mb-2"
                  />

                  {!isNewAppointment ? (
                    <div className="mb-4">
                      <Field
                        type="text"
                        name="vehicle"
                        className="border border-gray-300 rounded w-full p-2 mb-2"
                        placeholder="Vehicle"
                        value={vehicleDetails || ""}
                      />
                      <ErrorMessage
                        name="vehicle"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  ) : (
                    <SelectAndButton
                      options={allVehicles}
                      addNewButtonLabel="Add New Vehicle"
                      onChange={(value: any) =>
                        setFieldValue("vehicle", value._id)
                      }
                      addNewClick={() => setshowVehicleForm(true)}
                      placeholder="Select or Add Vehicle"
                      className="mb-4"
                    />
                  )}
                  <ErrorMessage
                    name="vehicle"
                    component="div"
                    className="text-red-500 text-sm mb-2"
                  />

                  <div className="mb-4">
                    <Field
                      as="textarea"
                      name="note"
                      className="border border-gray-300 rounded w-full p-2 "
                      placeholder="Notes"
                    />
                    <ErrorMessage
                      name="note"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-2">
                    <Field
                      as="select"
                      name="status"
                      className="border border-gray-300 rounded w-full p-2 mb-2"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setFieldValue("status", e.target.value)
                      }

                    >
                      <option value="shifted">Shifted</option>
                      <option value="confirmed">Confirmed</option>
                    </Field>
                    <ErrorMessage
                      name="status"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 flex justify-end p-2 border-t bg-white">
                    <Button
                      variant="primary"
                      type="button"
                      className="bg-gray-300 mr-2 px-4 py-1.5"
                      onClick={() => setModalOpen(false)}
                    >
                      Cancel
                    </Button>

                    {!isNewAppointment ? (

                    <Button
                      variant="solid"
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5"
                    >
                      Update
                    </Button>):(
                      <Button
                      variant="solid"
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5"
                    >
                      Save
                    </Button>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          <div className="w-1/3 h-full ml-4 flex flex-col items-start justify-between border-l border-gray-200 p-2 w-full">
            <div className="flex items-center space-x-2 mb-2"></div>
            <Card
              className="w-full h-full"
              headerClass="p-2"
              header={
                <>
                  <div className="flex items-center space-x-2 mb-2">
                    <FaBell
                      color="#5046E5"
                      className="h-5 w-5 text-gray-400 "
                    />
                    <h2 className="text-lg font-semibold text-indigo-600">
                      Reminders
                    </h2>
                  </div>
                </>
              }
            >
              {!customerSelected ? (
                <div className="w-full h-[300px] flex flex-col items-center justify-center">
                  <FaRegUser size={"30"} />
                  <p className="text-center mt-2">
                    Add a customer to turn on confirmation and reminders.
                  </p>
                </div>
              ) : (
                <div className="w-full h-[300px] flex flex-col">
                  <Menu>
                    <Menu.MenuCollapseArrowStart
                      eventKey="others"
                      className="h-3/4 p-4"
                      label={
                        <ConfirmationContent
                          icon={<HiOutlineGlobeAlt />}
                          label="Send Confirmation"
                        />
                      }
                    ></Menu.MenuCollapseArrowStart>
                    <Menu.MenuCollapseArrowStart
                      eventKey="others"
                      className="h-3/4 p-4"
                      label={
                        <ReminderContent
                          icon={<HiOutlineGlobeAlt />}
                          label="Send Reminder"
                        />
                      }
                    ></Menu.MenuCollapseArrowStart>
                  </Menu>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {showCustomerForm && (
        <AddNewCustomerModal handleButtonClick={handleButtonClick} />
      )}
      {showVehicleForm && (
        <AddNewVehicleModal handleButtonClick={handleVehicleFormClose} />
      )}
    </div>
  );
};

export default AddNewAppointmentModal;

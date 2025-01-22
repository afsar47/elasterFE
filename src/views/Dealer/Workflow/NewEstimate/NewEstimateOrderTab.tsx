import { DatePicker, Dropdown, Input, Menu, Notification, Select, TimeInput, toast } from "@/components/ui";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { apiUpdateCompleteEstimateDate, apiUpdateEstimateStatus } from "../../Services/WorkflowService";

const NewEstimateOrderTab = (props: any) => {
  const { servicesData, estimate, setisAppointmentModelOpen } = props;

  const estimateOptions = [
    { key: "Estimates", name: "Estimates" },
    { key: "Dropped Off", name: "Dropped Off" },
    { key: "In Progress", name: "In Progress" },
    { key: "Invoices", name: "Invoices" },
  ]

  const serviceWriterOptions = [
    { value: 'Syed Adnan Ali', label: 'Syed Adnan Ali' },
    { value: 'Saif Uddin', label: 'Saif Uddin' },
    { value: 'Faiz Uddin', label: 'Faiz Uddin' },
  ]

  const payTermOptions = [
    { key: "On Reciept", name: "On Reciept" },
    { key: "Net 7", name: "Net 7" },
    { key: "Net 10", name: "Net 10" },
    { key: "Net 30", name: "Net 30" },
    { key: "Net 45", name: "Net 45" },
    { key: "Net 60", name: "Net 60" },
  ];

  const [selectedWorkflow, setSelectedWorkflow] = useState("Estimates");
  const [selectedServiceWriter, setSelectedServiceWriter] = useState(serviceWriterOptions[0]);
  const [showServiceWriterSelection, setShowServiceWriterSelection] = useState(false);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [selectedDate, setSelectedDate]: any = useState("");
  const [selectedTime, setSelectedTime]: any = useState("");
  const [showDueDatePicker, setShowDueDatePicker]: any = useState("");
  const [selectedDueDate, setSelectedDueDate]: any = useState("");
  const [selectedDueTime, setSelectedDueTime]: any = useState("");
  const [selectedPayTerm, setSelectedPayTerm] = useState("On Reciept");
  const [showCustPoInput, setShowCustPoInput] = useState(false);
  const [customerPo, setCustomerPo] = useState("");

  const [createdAtDate, setCreatedAtDate]: any = useState("");
  const [createdAtTime, setCreatedAtTime]: any = useState("");

  useEffect(() => {
    setSelectedDate(estimate.completedDate);
    setSelectedTime(estimate.completedTime);
    setSelectedDueDate(estimate.dueDate);
    setSelectedDueTime(estimate.dueTime);

    const { createdAtDate, createdAtTime }: any = convertMongoTimestamp(estimate.createdAt)
    // debugger

    setCreatedAtDate(createdAtDate);
    setCreatedAtTime(createdAtTime);

  }, [estimate])



  function convertMongoTimestamp(mongoTimestamp: any) {
    const date = new Date(mongoTimestamp);

    // Extract the date in YYYY-MM-DD format
    const createdAtDate = date.toISOString().split('T')[0];

    // Format the time to 12-hour AM/PM format
    const options: any = { hour: 'numeric', minute: 'numeric', hour12: true };
    const createdAtTime = date.toLocaleTimeString('en-US', options);

    return { createdAtDate, createdAtTime };
  }

  const getDateTime = (selDate: any, selTime: any) => {
    const month = String(selDate.getMonth() + 1).padStart(2, '0');
    const day = String(selDate.getDate()).padStart(2, '0');
    const year = selDate.getFullYear();

    let date = `${month}/${day}/${year}`;

    let hours = selTime.getHours();
    const minutes = String(selTime.getMinutes()).padStart(2, '0');
    const meridian = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    let time = `${hours}:${minutes} ${meridian}`;

    return `${date} at ${time}`;
  }

  const updateEstimateStatus = (status: any) => {

    apiUpdateEstimateStatus(estimate._id, status)
    window.location.reload()
  }

  const updateDates = async (type: string) => {
    if (type === 'complete') {
      if (selectedDate !== "" && selectedTime !== "") {
        const formattedDate = selectedDate
          ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
          : null;

        // Extract just the time (HH:MM AM/PM) from selectedTime
        const formattedTime = selectedTime
          ? new Date(`${selectedTime}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          })
          : null;


        const payload = {
          completedDate: formattedDate, // "2024-11-25"
          completedTime: formattedTime, // Example: "10:10 PM"
          type: 'complete'
        };
        try {
          const response: any = await apiUpdateCompleteEstimateDate(estimate._id, payload);

          if (response.status === "success") {
            setShowDueDatePicker(false);
            toast.push(
              <Notification
                title="Completion Date & Time"
                type="success"
                duration={2000}
              >
                {response.message}
              </Notification>
            );
          }
        } catch (error) {
          console.error("Error updating date and time:", error);
          // Handle error here if needed
        }
      } else {
        toast.push(
          <Notification
            title="Completion Date & Time"
            type="warning"
            duration={2000}
          >
            Completed Date & Time both should be selected
          </Notification>
        )
      }
    } else if (type === 'due') {
      if (selectedDueDate !== "" && selectedDueTime !== "") {
        const formattedDate = selectedDueDate
          ? `${selectedDueDate.getFullYear()}-${String(selectedDueDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDueDate.getDate()).padStart(2, '0')}`
          : null;

        // Extract just the time (HH:MM AM/PM) from selectedDueTime
        const formattedTime = selectedDueTime
          ? new Date(`${selectedDueTime}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          })
          : null;


        const payload = {
          dueDate: formattedDate, // "2024-11-25"
          dueTime: formattedTime, // Example: "10:10 PM"
          type: 'due'
        };
        try {
          const response: any = await apiUpdateCompleteEstimateDate(estimate._id, payload);

          if (response.status === "success") {
            setShowDateTimePicker(false);
            toast.push(
              <Notification
                title="Completion Date & Time"
                type="success"
                duration={2000}
              >
                {response.message}
              </Notification>
            );
          }
        } catch (error) {
          console.error("Error updating date and time:", error);
          // Handle error here if needed
        }
      } else {
        toast.push(
          <Notification
            title="Completion Date & Time"
            type="warning"
            duration={2000}
          >
            Completed Date & Time both should be selected
          </Notification>
        )
      }
    }

    // Extract just the date (YYYY-MM-DD) from selectedDate
  };

  const dateRegex = /^[A-Z][a-z]{2}\s[A-Z][a-z]{2}\s\d{2}\s\d{4}\s\d{2}:\d{2}:\d{2}\sGMT[+-]\d{4}\s\([\w\s]+\)$/;

  return (
    <div className="new-estimate-order-tab">
      <p className="mt-4 text-lg font-header text-header-3 text-gray-900 font-semibold inverse:text-white whitespace-nowrap">{estimate.status} #{estimate.orderNo}</p>

      <div className="order-details mt-4 text-black text-sm">
        <div className="flex justify-between mt-3 relative">
          <p>Service Writer</p>
          <p className="text-indigo-600 cursor-pointer" onClick={() => setShowServiceWriterSelection(!showServiceWriterSelection)}>
            {selectedServiceWriter.value || ""}
            {showServiceWriterSelection ? <div className="bg-white shadow-md absolute right-0 h-[168px] text-black rounded mt-2">
              <Select
                className="w-48 m-2"
                placeholder="Please Select"
                options={serviceWriterOptions}
                onChange={(val: any) => setSelectedServiceWriter(val)}
                value={selectedServiceWriter}
                menuIsOpen={true}
                autoFocus
              />
            </div> : null}
          </p>
        </div>
        <div className="flex justify-between mt-3">
          <p>Technicians</p>
          <p>-</p>
        </div>
        <div className="flex justify-between mt-3">
          <p>Assignments</p>
          <p className="text-indigo-600 cursor-pointer">1 of 1</p>
        </div>
        <div className="flex justify-between mt-3">
          <p>Workflow</p>
          <Dropdown placement="bottom-end" menuStyle={{ marginTop: "8px" }} onSelect={(val) => setSelectedWorkflow(val)} renderTitle={<p className="text-indigo-600 cursor-pointer">{estimate.status}</p>}>
            {estimateOptions.map((item) => (
              <Dropdown.Item onSelect={updateEstimateStatus} key={item.key} eventKey={item.name}>
                {item.name}
              </Dropdown.Item>
            ))}
          </Dropdown>
        </div>
        <div className="flex justify-between mt-3">
          <p>Created</p>
          <p>{createdAtDate} at {createdAtTime}</p>
        </div>
        <div className="flex justify-between mt-3">
          <p>Appointment</p>
          <p className="text-indigo-600 cursor-pointer" onClick={() => setisAppointmentModelOpen(true)}>Schedule</p>
        </div>
        <div className="flex flex-col mt-3">
          <div className="flex justify-between">
            <p>Completed</p>
            <p className="text-indigo-600 cursor-pointer" >
              {!showDateTimePicker ? <span onClick={() => selectedDate === "" && selectedTime === "" ? setShowDateTimePicker(true) : toast.push(
                <Notification
                  title="Completion Date & Time"
                  type="warning"
                  duration={2000}
                >
                  Completed Date and Time already updated !
                </Notification>
              )}>{selectedDate && selectedTime ? dateRegex.test(selectedDate) && dateRegex.test(selectedTime)
                ? getDateTime(selectedDate, selectedTime) : `${selectedDate} at ${selectedTime}` : "Add"}</span> : <>
                <span className="text-red-600" onClick={() => { setShowDateTimePicker(false); setSelectedDate(""); setSelectedTime("") }}>Clear</span>
                <span className="ml-2" onClick={() => updateDates('complete')}>Done</span>
              </>}
            </p>
          </div>
          {showDateTimePicker ? <div className="flex mt-2">
            <DatePicker placeholder="Pick a date" className="w-full" onChange={(val: any) => setSelectedDate(val)} value={selectedDate} />
            <TimeInput format="12" className="w-2/5 ml-2" onChange={(val) => setSelectedTime(val)} value={selectedTime} />
          </div> : null}
        </div>
        <div className="flex flex-col justify-between mt-3">
          <div className="flex justify-between">
            <p>Due Date</p>
            <p className="text-indigo-600 cursor-pointer" >
              {!showDueDatePicker ?
                <span onClick={() => selectedDueDate === "" && selectedDueTime === "" ? setShowDueDatePicker(true) : toast.push(
                  <Notification
                    title="Due Date & Time"
                    type="warning"
                    duration={2000}
                  >
                    Due Date and Time already updated !
                  </Notification>
                )}>{selectedDueDate && selectedDueTime ? dateRegex.test(selectedDueDate) && dateRegex.test(selectedDueTime)
                  ? getDateTime(selectedDueDate, selectedDueTime) : `${selectedDueDate} at ${selectedDueTime}` : "Add"}</span> : <>
                  <span className="text-red-600" onClick={() => { setShowDueDatePicker(false); setSelectedDueDate(""); setSelectedDueTime("") }}>Clear</span>
                  <span className="ml-2" onClick={() => updateDates('due')}>Done</span>
                </>}
            </p>
          </div>
          {showDueDatePicker ? <div className="flex mt-2">
            <DatePicker placeholder="Pick a date" className="w-full" onChange={(val) => setSelectedDueDate(val)} value={selectedDueDate} />
            <TimeInput format="12" className="w-2/5 ml-2" onChange={(val) => setSelectedDueTime(val)} value={selectedDueTime} />
          </div> : null}
        </div>
        <div className="flex justify-between mt-3">
          <p>Payment Terms</p>
          <Dropdown placement="bottom-end" menuStyle={{ marginTop: "8px" }} onSelect={(val) => setSelectedPayTerm(val)} renderTitle={<p className="text-indigo-600 cursor-pointer">{selectedPayTerm}</p>}>
            {payTermOptions.map((item) => (
              <Dropdown.Item key={item.key} eventKey={item.key}>
                {item.name}
              </Dropdown.Item>
            ))}
          </Dropdown>
        </div>
        <div className="flex flex-col justify-between mt-3">
          <div className="flex justify-between">
            <p>Customer PO #</p>
            <p className="text-indigo-600 cursor-pointer" onClick={() => setShowCustPoInput(!showCustPoInput)}>
              {!showCustPoInput ? <span>{customerPo ? customerPo : "Add"}</span> : <>
                <span className="text-red-600" onClick={() => setShowDateTimePicker(false)}>Clear</span>
                <span className="ml-2">Done</span>
              </>}
            </p>
          </div>
          {showCustPoInput ? <div className="flex mt-2">
            <Input value={customerPo} onChange={(e) => setCustomerPo(e.target.value)} />
          </div> : null}
        </div>
      </div>

    </div >
  )
}

export default NewEstimateOrderTab

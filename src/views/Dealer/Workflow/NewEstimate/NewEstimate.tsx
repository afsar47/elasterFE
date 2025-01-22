import {
  Avatar,
  Button,
  Card,
  Drawer,
  Dropdown,
  Input,
  Menu,
  Select,
  Spinner,
  Tabs,
} from "@/components/ui";
import "./styles.css";

import {
  FaCar,
  FaCheck,
  FaChevronLeft,
  FaRegCheckCircle,
} from "react-icons/fa";
import { ReactNode, useEffect, useRef, useState } from "react";
import { GoChevronDown } from "react-icons/go";
import { AiOutlinePrinter } from "react-icons/ai";
import { FiActivity, FiSend } from "react-icons/fi";
import { FaBlog, FaRegMessage } from "react-icons/fa6";
import { HiDotsHorizontal, HiWifi } from "react-icons/hi";
import TabList from "@/components/ui/Tabs/TabList";
import TabNav from "@/components/ui/Tabs/TabNav";
import SideNav from "@/components/template/SideNav";
import TabContent from "@/components/ui/Tabs/TabContent";
import NewEstimateOrderTab from "./NewEstimateOrderTab";
import ServicesTab from "./ServicesTab";
import SelectAndButton from "@/components/ui/SelectAndButton";
import CustomersStatistics from "../../DealerLists/Customers/CustomersStatistics";
import AddNewCustomerModal from "../../DealerSharedComponent/AddNewCustomerModal";
import AddNewVehicleModal from "../../DealerSharedComponent/AddNewVehicleModal";
import {
  getAllCustomers,
  getAllVehicles,
} from "../../DealerLists/Services/DealerListServices";
import {
  apiAddNewEstimate,
  apiUpdateEstimate,
  getEstimateById,
} from "../../Services/WorkflowService";
import { IoCloudDoneOutline } from "react-icons/io5";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SendEstimate from "./SendEstimate";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Activities from "./Activities";
import PaymentModel from "../../DealerSharedComponent/PaymentModel";
import AddNewAppointmentModal from "../../DealerSharedComponent/AddNewAppointmentModal";
import LeftSidePanel from "@/components/template/SidePanel/LeftSidePanel";

interface Vehicle {
  _id: string;
  customerName: string;
  customerId: string; // This should match the customer ID property
  make: string;
  model: string;
  year: string;
  subModel?: string;
  licencePlate?: { plateNumber: string }[];
  value?: string;
  label?: JSX.Element;
  customers?: Customer[]; // Add this if you expect customers to be an array
}

interface Customer {
  id: string;
  name: string;
  // Other customer properties
}

const NewEstimate = () => {
  const [orderNumber, setOrderNumber] = useState(0);
  const [estimateId, setEstimateId] = useState("");
  const [selectedTab, setSelectedTab] = useState("order");
  const [primarySelectedTab, setPrimarySelectedTab] = useState("services");
  const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
  const [addVehicleModalOpen, setAddVehicleModalOpen] = useState(false);
  const [sendEstimateOpen, setsendEstimateOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer]: any = useState(null);
  const [selectedVehicle, setSelectedVehicle]: any = useState(null);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [vehicleOptions, setVehicleOptions] = useState<Vehicle[]>([]);

  const [orderTitle, setOrderTitle] = useState("");
  const [customerComment, setCustomerComment] = useState("");
  const [customerRecommendations, setCustomerRecommendations] = useState("");
  const [servicesData, setServicesData]: any = useState({});
  const [autoSaving, setAutoSaving] = useState(false);
  const [estimateData, setEstimateData]: any = useState({});
  const [grandTotal, setGrandTotal] = useState({});
  const [isPaymentModelOpen, setisPaymentModelOpen]: any = useState(false);
  const [isAppointmentModelOpen, setisAppointmentModelOpen]: any =
    useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const timerRef = useRef(null);

  // console.log("Customers in dropdown : ", customerOptions)
  // console.log("Vehicle options : ",vehicleOptions)

  // console.log("selectedVehicle : ", selectedVehicle);

  const filteredVehicleOptions = selectedCustomer
    ? vehicleOptions.filter(
        (vehicle) => vehicle.customerId === selectedCustomer.id
      )
    : vehicleOptions;

  // console.log("selected customer : ", selectedCustomer);
  // console.log("selected vehicle's customerId : ", vehicleOptions);

  const customersArray = vehicleOptions.map((vehicle) => vehicle.customers);
  // console.log("Customer's Array : ", customersArray);

  // console.log("filterred vehicle ; ", filteredVehicleOptions)

  const dropdownItems = [
    { key: "a", name: "Item A" },
    { key: "b", name: "Item B" },
    { key: "c", name: "Item C" },
    { key: "d", name: "Item D" },
  ];

  const otherItems = [
    { key: "a", name: "Archive" },
    { key: "b", name: "Delete" },
  ];

  const dropdownBtn = (
    <Button
      variant="twoTone"
      className="h-[2.4rem] print-dropdown-btn ml-[1px] font-medium"
      onClick={() => {}}
    >
      <GoChevronDown />
    </Button>
  );

  const otherOptionsBtn = (
    <Button
      variant="twoTone"
      className="h-[2.4rem] ml-3 px-[16px] font-medium"
      onClick={() => {}}
    >
      <HiDotsHorizontal />
    </Button>
  );

  const fetchCustomers = async () => {
    let customers = await getAllCustomers();
    let labelValArr = [];
    if (customers.allCustomers && customers.allCustomers.length) {
      labelValArr = customers.allCustomers.map((cust: any) => {
        let name = `${cust.firstName || ""} ${cust.lastName || ""}`;
        cust.value = name;
        cust.label = (
          <div className="flex items-center justify-start w-full cursor-pointer">
            <Avatar
              shape="circle"
              size="sm"
              className="mr-4 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
            >
              {`${cust.firstName[0] || ""}${cust.lastName[0] || ""}`}
            </Avatar>
            <div className="flex flex-col">
              <p className="text-black">{name}</p>
              {cust.phoneNumber && cust.phoneNumber.length ? (
                <p className="text-xs">
                  Mobile: {`${cust.phoneNumber[0].number || ""}`}
                </p>
              ) : null}
            </div>
          </div>
        );
        return cust;
      });
    }

    setCustomerOptions(labelValArr);
  };

  const fetchVehicles = async () => {
    let vehicles = await getAllVehicles();

    console.log("All Vehicles : ", vehicles);
    let labelValArr = [];
    if (vehicles.allVehicles && vehicles.allVehicles.length) {
      labelValArr = vehicles.allVehicles.map((vehicle: any) => {
        vehicle.value = vehicle._id;
        vehicle.label = (
          <div className="flex items-center justify-start w-full cursor-pointer">
            <Avatar
              shape="circle"
              size="sm"
              className="mr-4 bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100"
            >
              <FaCar />
            </Avatar>
            <div className="flex flex-col">
              <p className="text-black">{`${vehicle.year || ""} ${vehicle.make || ""} ${vehicle.model || ""}`}</p>
              {vehicle.subModel && vehicle.licencePlate.length ? (
                <p className="text-xs">{`${vehicle.subModel || ""} ${vehicle.licencePlate[0].plateNumber || ""}`}</p>
              ) : null}
            </div>
          </div>
        );
        return vehicle;
      });
    }

    setVehicleOptions(labelValArr);
  };

  useEffect(() => {
    const urlPath = window.location.pathname;
    const orderId = urlPath.split("/").pop();
    if (orderId) {
      const [idBeforeHyphen, idAfterHyphen]: any = orderId.split("-");
      setOrderNumber(Number(idAfterHyphen));
      setEstimateId(idBeforeHyphen);
    }
    // Call your APIs
    fetchVehicles();
    fetchCustomers();
  }, []);

  const handleEstimateSave = async (values: any) => {
    let saveEstimateResp = await apiUpdateEstimate(values, estimateId);
    setAutoSaving(false);
  };

  const getGrandTotal = (total: any) => {
    // setGrandTotal(total)
  };

  useEffect(() => {
    const handleMouseMove = () => {
      // Clear any existing timer when the mouse moves
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setAutoSaving(true);
        //
        const estimateDataToSave = {
          orderNo: orderNumber,
          orderName: orderTitle,
          customer: selectedCustomer ? selectedCustomer._id : "",
          vehicle: selectedVehicle ? selectedVehicle._id : "",
          comments: customerComment,
          recommendation: customerRecommendations,
          services: Object.values(servicesData).map(
            (service: any, idx: number) => {
              service.grandTotal = Number(grandTotal[idx]);
              return service;
            }
          ),
          // grandTotal: Number(grandTotal),
        };
        handleEstimateSave(estimateDataToSave);
      }, 5000);
    };

    // Attach the mousemove event listener
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup the event listener and timer on component unmount
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [
    orderNumber,
    orderTitle,
    selectedCustomer,
    selectedVehicle,
    customerComment,
    customerRecommendations,
    servicesData,
    grandTotal,
  ]);

  // const customerOptions = [
  //   { value: "Faiz", label: <div className="flex align-center justify-center">
  //     <p className="mt-2 mr-8">FU</p>
  //     <div className="flex flex-col">
  //       <p className="text-black">Faiz</p>
  //       <p className="text-xs">Mobile: (91) 7974062002</p>
  //     </div>
  //   </div>, mob: 7974062002 },
  // ]

  // const vehicleOptions = [
  //   { value: "Vehicle1", label: <div className="flex align-center justify-center">
  //     <p className="mt-2 mr-8">VO</p>
  //     <div className="flex flex-col">
  //       <p className="text-black">Vehicle1</p>
  //       <p className="text-xs">Model: Swift Dezire</p>
  //     </div>
  //   </div>, mob: 7974062002 },
  // ]
  const fetchEstimate = async () => {
    try {
      const urlSegments = window.location.pathname.split("/");
      const orderId = urlSegments[urlSegments.length - 1].split("-")[0];
      const response = await getEstimateById(orderId);

      if (response.estimate) {
        let estimate = response.estimate;
        setEstimateData(estimate);

        let grandTotalMap = {};
        if (estimate.services && estimate.services.length) {
          estimate.services.forEach((service: any, idx: number) => {
            if (!service.grandTotal) service.grandTotal = 710;
            grandTotalMap[idx + 1] = Number(service.grandTotal);
          });

          setGrandTotal(grandTotalMap);
        }
        if (estimate.orderName) setOrderTitle(estimate.orderName);
        if (estimate.comments) setCustomerComment(estimate.comments);
        if (estimate.recommendation)
          setCustomerRecommendations(estimate.recommendation);
        if (estimate.customer) {
          let selCustomer: any = customerOptions.find(
            (cust: any) => cust._id === estimate.customer._id
          );
          if (selCustomer && selCustomer._id) {
            setSelectedCustomer(selCustomer);
          }
        }
        if (estimate.vehicle) {
          let selVehicle: any = vehicleOptions.find(
            (veh: any) => veh._id === estimate.vehicle._id
          );
          if (selVehicle && selVehicle._id) {
            setSelectedVehicle(selVehicle);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch estimate:", error);
      toast.error("Unable to fetch estimate data.");
    }
  };

  useEffect(() => {
    if (
      !customerOptions ||
      !customerOptions.length ||
      !vehicleOptions ||
      !vehicleOptions.length
    )
      return;

    fetchEstimate();
  }, [customerOptions, vehicleOptions]);

  const MenuContent = ({
    icon,
    label,
    service,
  }: {
    icon: ReactNode;
    label: string;
    service: any;
  }) => {
    return (
      <div className="flex items-center gap-2 w-full">
        <span className="flex items-center justify-between w-full">
          {label} <div className="text-xl">{icon}</div>
          {service.serviceTotal}
        </span>
      </div>
    );
  };

  const cardFooter = (
    <Button
      size="sm"
      variant="solid"
      className="w-full"
      onClick={() => setisPaymentModelOpen(!isPaymentModelOpen)}
    >
      New Payment
    </Button>
  );

  const PanelContent = (
    <div
      className={`flex flex-col items-start justify-start w-80 pr-10 -mr-14 `}
    >
      <Menu
        className="px-4 pb-4 border pt-7 -mt-7"
        variant={"light"}
        sideCollapsed={true}
      >
        <div className="p-1 w-full relative">
          <Tabs
            onChange={(tab) => setSelectedTab(tab)}
            value={selectedTab}
            variant="pill"
          >
            <TabList className="border rounded-md p-1">
              <TabNav className="w-full py-1" value="order">
                Order
              </TabNav>
              <TabNav className="w-full py-1" value="customer">
                Customer
              </TabNav>
              <TabNav className="w-full py-1" value="vehicle">
                Vehicle
              </TabNav>
            </TabList>

            <TabContent value="order" className="P-0">
              <NewEstimateOrderTab
                servicesData={servicesData}
                estimate={estimateData}
                setisAppointmentModelOpen={setisAppointmentModelOpen}
              />
              <br />
              <div className="w-full border-t"></div>
              <Menu className="p-0">
                <Menu.MenuCollapse
                  labelClass="w-full"
                  label={
                    <div className="flex items-center p-0">
                      <FaCheck className="mr-1" /> Authorizations
                    </div>
                  }
                >
                  {Object.values(servicesData) &&
                    Object.values(servicesData).length > 0 &&
                    Object.values(servicesData).map((service: any) => {
                      return (
                        <Menu.MenuItem
                          key={service._id}
                          className="p-0"
                          eventKey="wifi"
                        >
                          <MenuContent
                            icon={
                              service.isAuthorized === true ? (
                                <FaRegCheckCircle className="text-indigo-700" />
                              ) : (
                                <IoIosCloseCircleOutline className="text-indigo-700" />
                              )
                            }
                            label={
                              service.serviceTitle === ""
                                ? "Untitled Service"
                                : service.serviceTitle
                            }
                            service={service}
                          />
                        </Menu.MenuItem>
                      );
                    })}
                </Menu.MenuCollapse>
              </Menu>
              <br />
              <div className="w-full border-t"></div>
              <Menu className="p-0">
                <Menu.MenuCollapse
                  labelClass="w-full"
                  label={
                    <div className="flex items-center p-0">
                      <FiActivity className="mr-1 stroke-[3.5px] text-[15px]" />{" "}
                      Activity
                    </div>
                  }
                >
                  <Activities />
                </Menu.MenuCollapse>
              </Menu>
              {estimateData &&
                (estimateData.status === "In Progress" ||
                  estimateData.status === "Invoices") && (
                  <Card
                    // className="fixed bottom-0 w-3/12 right-0"
                    headerClass="font-semibold text-lg text-indigo-600"
                    bodyClass="text-center"
                    footerClass="flex justify-end"
                    footer={cardFooter}
                  >
                    <div className="flex item-center justify-between">
                      <h6>Grand Total</h6>
                      <h6>$279.00</h6>
                    </div>
                  </Card>
                )}
              {isPaymentModelOpen && (
                <PaymentModel
                  handleClosePaymentModel={setisPaymentModelOpen}
                  estimateData={estimateData}
                />
              )}
            </TabContent>

            <TabContent value="customer">hi</TabContent>

            <TabContent value="vehicle">hi</TabContent>
          </Tabs>
        </div>
      </Menu>
    </div>
  );

  return (
    <div className="new-estimate w-full h-full ">
      {estimateData && estimateData._id ? (
        <div className="new-estimate-page-container flex flex-row">
          <div className="basic-order-info-container w-full lg:w-3/4 ">
            <div className="order-init-container flex-col items-start justify-start lg:flex lg:flex-row lg:items-center lg:justify-start">
              <div className="flex w-fit">
                <Button
                  variant="plain"
                  onClick={() => window.history.back()}
                  className="back-arrow-button"
                >
                  <FaChevronLeft />
                </Button>

                <h2 className="m-0 font-header text-header-2 text-gray-900 estimate-order-title">
                  #{orderNumber}:
                </h2>
                <Input
                  value={orderTitle}
                  onChange={(e) => setOrderTitle(e.target.value)}
                  className="estimate-order-title p-1 w-[56%] h-[2.4rem] border border-transparent ml-2"
                  placeholder="Enter Order Title..."
                />
              </div>

              {/* <div className="estimate-interaction-buttons flex justify-start items-center">
              <div className="button-with-dropdown flex items-center justify-center">
                <Button variant="twoTone" className="flex justify-center items-center print-btn h-[2.4rem] font-medium" onClick={() => { }}>
                  <AiOutlinePrinter className="w-4 h-4 mr-1" />
                  Print
                </Button>
                <Dropdown placement="bottom-end" menuStyle={{ marginTop: "20px" }} renderTitle={dropdownBtn}>
                  {dropdownItems.map((item) => (
                    <Dropdown.Item key={item.key} eventKey={item.key}>
                      {item.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown>
              </div>
              <Button variant="twoTone" className="flex justify-center items-center ml-3 h-[2.4rem] font-medium" onClick={() => { setsendEstimateOpen(!sendEstimateOpen) }}>
                <FiSend className="mr-1" />
                Send
              </Button>

              <Button variant="twoTone" className="flex justify-center items-center ml-3 h-[2.4rem] font-medium" onClick={() => { }}>
                <FaRegMessage className="mr-1" />
                Message
              </Button>

              <Dropdown placement="bottom-end" menuStyle={{ marginTop: "8px" }} renderTitle={otherOptionsBtn}>
                {otherItems.map((item) => (
                  <Dropdown.Item key={item.key} eventKey={item.key}>
                    {item.name}
                  </Dropdown.Item>
                ))}
              </Dropdown>

              <p className="ml-4 w-[70px] flex justify-center items-center">{autoSaving ? <span className="flex justify-start items center">Saving <Spinner className="ml-2 mt-1" size={14} /></span> : <IoCloudDoneOutline size={20} />}</p>
              
            </div> */}
              <div className="estimate-interaction-buttons flex flex-wrap sm:flex-nowrap justify-start items-center">
                <div className="button-with-dropdown flex items-center justify-center mb-2 sm:mb-0 sm:w-auto w-full">
                  <Button
                    variant="twoTone"
                    className="flex justify-center items-center print-btn h-[2.4rem] font-medium sm:w-auto w-full"
                    onClick={() => {}}
                  >
                    <AiOutlinePrinter className="w-4 h-4 mr-1" />
                    Print
                  </Button>
                  <Dropdown
                    placement="bottom-end"
                    menuStyle={{ marginTop: "20px" }}
                    renderTitle={dropdownBtn}
                    className="sm:w-auto "
                  >
                    {dropdownItems.map((item) => (
                      <Dropdown.Item key={item.key} eventKey={item.key}>
                        {item.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown>
                </div>

                <Button
                  variant="twoTone"
                  className="flex justify-center items-center ml-0 sm:ml-3 h-[2.4rem] font-medium sm:w-auto w-full mb-2 sm:mb-0"
                  onClick={() => {
                    setsendEstimateOpen(!sendEstimateOpen);
                  }}
                >
                  <FiSend className="mr-1" />
                  Send
                </Button>

                <Button
                  variant="twoTone"
                  className="flex justify-center items-center ml-0 sm:ml-3 h-[2.4rem] font-medium sm:w-auto w-full mb-2 sm:mb-0"
                  onClick={() => {}}
                >
                  <FaRegMessage className="mr-1" />
                  Message
                </Button>

                <div className="flex sm:justify-around w-full">
                  <Dropdown
                    placement="bottom-end"
                    menuStyle={{ marginTop: "8px" }}
                    renderTitle={otherOptionsBtn}
                  >
                    {otherItems.map((item) => (
                      <Dropdown.Item key={item.key} eventKey={item.key}>
                        {item.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown>

                  <p className="ml-0 sm:ml-4 w-full sm:w-[70px] flex justify-center items-center text-center">
                    {autoSaving ? (
                      <span className="flex justify-start items-center">
                        Saving <Spinner className="ml-2 mt-1" size={14} />
                      </span>
                    ) : (
                      <IoCloudDoneOutline size={20} />
                    )}
                  </p>
                  <div className="lg:hidden px-4 py-2">
                    <LeftSidePanel content={PanelContent} />
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="block lg:hidden px-4 py-2">
                <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 border rounded-md"
              aria-label="Toggle Menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
              </div> */}

            <div className="cust-and-veh-inputs flex mt-8">
              <SelectAndButton
                options={customerOptions}
                addNewButtonLabel="Add New Customer"
                value={selectedCustomer}
                onChange={(value: any) => setSelectedCustomer(value)}
                placeholder="Add Customer..."
                addNewClick={() =>
                  setAddCustomerModalOpen(!addCustomerModalOpen)
                }
                className="mb-4 mr-12 w-[256px]"
              />
              {addCustomerModalOpen ? (
                <AddNewCustomerModal
                  handleButtonClick={() =>
                    setAddCustomerModalOpen(!addCustomerModalOpen)
                  }
                />
              ) : null}
              <SelectAndButton
                // options={vehicleOptions}
                options={filteredVehicleOptions}
                addNewButtonLabel="Add New Vehicle"
                value={selectedVehicle}
                onChange={(value: any) => setSelectedVehicle(value)}
                placeholder="Add Vehicle..."
                addNewClick={() => setAddVehicleModalOpen(!addVehicleModalOpen)}
                className="mb-4 w-[256px]"
              />
              {addVehicleModalOpen ? (
                <AddNewVehicleModal
                  handleButtonClick={() =>
                    setAddVehicleModalOpen(!addVehicleModalOpen)
                  }
                />
              ) : null}
            </div>

            <Tabs
              className="mt-5"
              onChange={(tab) => setPrimarySelectedTab(tab)}
              value={primarySelectedTab}
            >
              <TabList>
                <TabNav className="py-2 " value="services">
                  Services
                </TabNav>
                <TabNav className="py-2 " value="summary">
                  Summary
                </TabNav>
                <TabNav className="py-2 " value="inspections">
                  Inspections
                </TabNav>
                <TabNav className="py-2 " value="timeClocks">
                  Time Clocks
                </TabNav>
                <TabNav className="py-2 " value="partsAndTires">
                  Parts & Tires
                </TabNav>
              </TabList>

              <div className="bg-[#f0f1fa] pl-7 pr-4 lg:px-10 -mr-4 -ml-8 py-5 h-full">
                <TabContent value="services">
                  <ServicesTab
                    savedTotal={grandTotal || {}}
                    setGrandTotal={setGrandTotal}
                    grandTotal={grandTotal || {}}
                    prefillServicesData={estimateData.services || []}
                    storeDataInParent={(data: any) => setServicesData(data)}
                    estimateData={estimateData}
                    comment={customerComment}
                    recommendation={customerRecommendations}
                    onCommentChange={(value: any) => setCustomerComment(value)}
                    onRecommendatioChange={(value: any) =>
                      setCustomerRecommendations(value)
                    }
                  />
                </TabContent>

                <TabContent value="summary">hi</TabContent>
                <TabContent value="inspections">hi</TabContent>
                <TabContent value="timeClocks">hi</TabContent>
                <TabContent value="partsAndTires">hi</TabContent>
              </div>
            </Tabs>
          </div>
          <div className="relative hidden lg:block">
            <div
              className={`flex flex-col items-start justify-start w-80 -mr-14 `}
            >
              <Menu
                className="px-4 pb-4 border pt-7 -mt-7"
                variant={"light"}
                sideCollapsed={true}
              >
                <div className="p-1 w-full relative">
                  <Tabs
                    onChange={(tab) => setSelectedTab(tab)}
                    value={selectedTab}
                    variant="pill"
                  >
                    <TabList className="border rounded-md p-1">
                      <TabNav className="w-full py-1" value="order">
                        Order
                      </TabNav>
                      <TabNav className="w-full py-1" value="customer">
                        Customer
                      </TabNav>
                      <TabNav className="w-full py-1" value="vehicle">
                        Vehicle
                      </TabNav>
                    </TabList>

                    <TabContent value="order" className="P-0">
                      <NewEstimateOrderTab
                        servicesData={servicesData}
                        estimate={estimateData}
                        setisAppointmentModelOpen={setisAppointmentModelOpen}
                      />
                      <br />
                      <div className="w-full border-t"></div>
                      <Menu className="p-0">
                        <Menu.MenuCollapse
                          labelClass="w-full"
                          label={
                            <div className="flex items-center p-0">
                              <FaCheck className="mr-1" /> Authorizations
                            </div>
                          }
                        >
                          {Object.values(servicesData) &&
                            Object.values(servicesData).length > 0 &&
                            Object.values(servicesData).map((service: any) => {
                              return (
                                <Menu.MenuItem
                                  key={service._id}
                                  className="p-0"
                                  eventKey="wifi"
                                >
                                  <MenuContent
                                    icon={
                                      service.isAuthorized === true ? (
                                        <FaRegCheckCircle className="text-indigo-700" />
                                      ) : (
                                        <IoIosCloseCircleOutline className="text-indigo-700" />
                                      )
                                    }
                                    label={
                                      service.serviceTitle === ""
                                        ? "Untitled Service"
                                        : service.serviceTitle
                                    }
                                    service={service}
                                  />
                                </Menu.MenuItem>
                              );
                            })}
                        </Menu.MenuCollapse>
                      </Menu>
                      <br />
                      <div className="w-full border-t"></div>
                      <Menu className="p-0">
                        <Menu.MenuCollapse
                          labelClass="w-full"
                          label={
                            <div className="flex items-center p-0">
                              <FiActivity className="mr-1 stroke-[3.5px] text-[15px]" />{" "}
                              Activity
                            </div>
                          }
                        >
                          <Activities />
                        </Menu.MenuCollapse>
                      </Menu>
                      {estimateData &&
                        (estimateData.status === "In Progress" ||
                          estimateData.status === "Invoices") && (
                          <Card
                            // className="fixed bottom-0 w-3/12 right-0"
                            headerClass="font-semibold text-lg text-indigo-600"
                            bodyClass="text-center"
                            footerClass="flex justify-end"
                            footer={cardFooter}
                          >
                            <div className="flex item-center justify-between">
                              <h6>Grand Total</h6>
                              <h6>$279.00</h6>
                            </div>
                          </Card>
                        )}
                      {isPaymentModelOpen && (
                        <PaymentModel
                          handleClosePaymentModel={setisPaymentModelOpen}
                          estimateData={estimateData}
                        />
                      )}
                    </TabContent>

                    <TabContent value="customer">hi</TabContent>

                    <TabContent value="vehicle">hi</TabContent>
                  </Tabs>
                </div>
              </Menu>
            </div>
          </div>
        </div>
      ) : null}
      {isAppointmentModelOpen ? (
        <AddNewAppointmentModal
          isModalOpen={isAppointmentModelOpen}
          setModalOpen={setisAppointmentModelOpen}
        />
      ) : null}
      {sendEstimateOpen ? (
        <SendEstimate
          selectedCustomer={selectedCustomer}
          estimateId={estimateId}
          orderNumber={orderNumber}
          selectedVehicle={selectedVehicle}
          handleButtonClick={() => setsendEstimateOpen(!sendEstimateOpen)}
        />
      ) : null}
    </div>
  );
};

export default NewEstimate;

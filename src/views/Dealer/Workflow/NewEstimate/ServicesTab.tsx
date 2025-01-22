import { Button, Card, Dialog, Dropdown, Input, Menu, Spinner, Tabs, Tag } from "@/components/ui";
import "./styles.css";
import { useEffect, useRef, useState } from "react";
import { HiDotsHorizontal, HiOutlineDocumentText } from "react-icons/hi";
import TableCommon from "./TableCommon";
import { PiWrenchLight } from "react-icons/pi";
import { CiBoxes } from "react-icons/ci";
import { GiCarWheel } from "react-icons/gi";
import { GoTag } from "react-icons/go";
import { AiOutlineDollar } from "react-icons/ai";
import { getAllFees, getAllParts, getAllTires } from "../../DealerLists/Services/DealerInventoryServices";
import { toast } from "react-toastify";
import SelectAndButton from "@/components/ui/SelectAndButton";
import AddNewPartModal from "../../DealerSharedComponent/AddNewPartModal";
import TabList from "@/components/ui/Tabs/TabList";
import TabNav from "@/components/ui/Tabs/TabNav";
import AddNewFeeModal from "../../DealerSharedComponent/AddNewFeeModal";
import AddNewTireModal from "../../DealerSharedComponent/AddNewTireModal";
import { getEstimateById } from "../../Services/WorkflowService";

const ServicesTab = ({ comment, onCommentChange, recommendation, onRecommendatioChange, storeDataInParent, estimateData, prefillServicesData, setGrandTotal, savedTotal, grandTotal }: any) => {
  const [services, setServices] = useState<any[]>([]);
  const [showNoteField, setShowNoteField] = useState(false);
  const [servicesTableData, setServicesTableData] = useState({});

  const [showPartsTable, setShowPartsTable] = useState(false);
  const [showTiresTable, setShowTiresTable] = useState(false);
  const [showSubTable, setShowSubTable] = useState(false);
  const [showDiscountTable, setShowDiscountTable] = useState(false);
  const [allParts, setAllParts] = useState([]);
  const [addPartModalOpen, setAddPartModalOpen] = useState(false);
  const [addTireModalOpen, setAddTireModalOpen] = useState(false);
  const [addFeeModalOpen, setAddFeeModalOpen] = useState(false);
  const [showPartsLoader, setShowPartsLoader] = useState(false);
  const [showTiresLoader, setShowTiresLoader] = useState(false);
  const [showFeesLoader, setShowFeesLoader] = useState(false);
  const [allTires, setAllTires] = useState([]);
  const [allFees, setAllFees] = useState([]);
  const [showValueTypeSelection, setShowValueTypeSelection] = useState("");
  // const [ position, setPosition ] = useState({ top: 0, left: 0 });

  const [laborSubTotal, setLaborSubTotal] = useState({});
  const [partSubTotal, setPartSubTotal] = useState({});
  const [tireSubTotal, setTireSubTotal] = useState({});
  const [subcontractSubTotal, setSubcontractSubTotal] = useState({});
  const [feesSubTotal, setFeesSubTotal] = useState({});
  const [overallDiscount, setOverallDiscount] = useState({});

  const [activeServiceNo, setActiveServiceNo] = useState(0);

  const laborSubTotalMap = useRef({});
  const partSubTotalMap = useRef({});
  const tireSubTotalMap = useRef({});
  const subcontractSubTotalMap = useRef({});
  const feeSubTotalMap = useRef({});

  const laborRef: any = useRef();
  const partRef: any = useRef();
  const tireRef: any = useRef();
  const subcontractRef: any = useRef();
  const serviceDiscountRef: any = useRef();
  const feeRef: any = useRef();
  const laborTableMountedOnce: any = useRef(false);
  const partTableMountedOnce: any = useRef(false);
  const tireTableMountedOnce: any = useRef(false);
  const subcontractTableMountedOnce: any = useRef(false);
  const isPreffiledOnce = useRef(false);
  const isFeePreffilled = useRef(false);
  const isDicountPreffilled = useRef(false);

  const handleAddService = () => {
    setServices([...services, { serviceTitle: "" }]); // Add a new service with an empty title
  };

  const handleRemoveService = (index) => {
    const updatedServices = services.filter((_, i) => i !== index); // Remove the service at the given index
    setServices(updatedServices);
  };

  const handleInputChange = (index, value, key, serviceNo) => {
    //  
    const updatedServices = services.map((service, i) =>
      i === index ? { ...service, [key]: value } : service // Update the title for the specific service
    );
    //  
    setServices(updatedServices);
    // setServicesTableData({ ...servicesTableData, [serviceNo - 1]: { ...servicesTableData[serviceNo - 1], [key]: value } });
    setServicesTableData({ ...servicesTableData, [serviceNo - 1]: { ...servicesTableData[serviceNo - 1], [key]: value } });
    if (storeDataInParent) storeDataInParent({ ...servicesTableData, [serviceNo - 1]: { ...servicesTableData[serviceNo - 1], [key]: value } });
  };

  const dropdownRenderButton = (
    <Button variant="twoTone" className="h-[2.4rem] ml-3 px-[16px] font-medium" onClick={() => { }}>
      <HiDotsHorizontal />
    </Button>
  );

  // const handleDataStorage = (index, key, value) => {
  //   servicesTableData[index]
  //   // setServicesTableData({ ...servicesTableData, [index]: [ {  } ] })
  // }

  // [
  //   { idx: val }
  //   { idx: val }
  //   { idx: val }
  // ]

  useEffect(() => {
    let labor = ((Object.values(laborSubTotal[activeServiceNo-1] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0);
    let part = ((Object.values(partSubTotal[activeServiceNo-1] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0);
    let tire = ((Object.values(tireSubTotal[activeServiceNo-1] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0);
    let subcontract = ((Object.values(subcontractSubTotal[activeServiceNo-1] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0);
    let fees = ((Object.values(feesSubTotal[activeServiceNo-1] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0);
    let overall = ((Object.values(overallDiscount[activeServiceNo-1] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0);

    // if (!isPreffiledOnce.current) {
      if (prefillServicesData && prefillServicesData.length) {
        prefillServicesData.forEach((service, index) => {
          if (service.serviceFee && service.serviceFee.length && !isFeePreffilled.current) {
            service.serviceFee.forEach((fee, idx) => {
              handleFeeSubtotal(fee.feeSubtotal, index + 1, idx, idx <= 1 ? fee.feeSubtotalType : "$");
            });
          }
  
          if (service.discount && service.discount.length && !isDicountPreffilled.current) {
            service.discount.forEach((disc, idx) => {
              handleDiscountCalculation({ type: disc.discount.type || "%", value: disc.discount.value }, idx, index, true);
            });
          }
        });
      }
    // }
    setGrandTotal({ ...grandTotal, [activeServiceNo-1]: ((labor + part + tire + subcontract + fees) - overall).toFixed(2) });
  }, [ laborSubTotal, partSubTotal, tireSubTotal, subcontractSubTotal, feesSubTotal, overallDiscount, prefillServicesData, activeServiceNo ])

  // console.log("-savedTotal", savedTotal, activeServiceNo, grandTotal);

  const technicians = [
    { key: "Faiz", name: "Faiz" },
    { key: "Saif", name: "Saif" },
    { key: "Adnan", name: "Adnan" },
  ]
  // const handleMouseMove = (e) => {
  //   const { top, left } = e.currentTarget.getBoundingClientRect();
  //   // const cursorTop = e.clientY - top;
  //   // const cursorLeft = e.clientX - left;

  //   setPosition({ top: top, left: left });
  // };

  const fetchFees = async () => {
    let response = await getAllFees();
    if (response && response.data && response.data.status && response.data.status === "success") {
      if (response.data.allFees && response.data.allFees.length) {
        response.data.allFees.forEach((fee: any) => {
          fee.value = fee._id;
          fee.label = fee.feeName;
        });

        setAllFees(response.data.allFees);
        // setShowPartsTable(true);
      }
    } else toast.error('Failed to fetch fees.');
  }


  useEffect(() => {
    fetchFees();
  }, []);

  // useEffect(() => {
  //   if (prefillServicesData && prefillServicesData.length && laborRef.current) {
  //     console.log("prefillServicesData", prefillServicesData, laborRef.current);
  //     // prefillServicesData.forEach(service => {
  //       // if (service.labors && service.labors.length)
  //     // })
  //   }
  // }, [prefillServicesData, laborRef])

  const generateTypeTabForHover = (handleChange: any, rowIndex: any, serviceNo: any, key: any, tableName: any, isFees: boolean) => {
    let discountObj = (servicesTableData[serviceNo - 1] && servicesTableData[serviceNo - 1][tableName] && servicesTableData[serviceNo - 1][tableName][rowIndex] && servicesTableData[serviceNo - 1][tableName][rowIndex][key]) || {};
    let defaultVal = (servicesTableData[serviceNo - 1] && servicesTableData[serviceNo - 1][tableName] && servicesTableData[serviceNo - 1][tableName][rowIndex] && servicesTableData[serviceNo - 1][tableName][rowIndex][key] && servicesTableData[serviceNo - 1][tableName][rowIndex][key]["type"]);
    if (isFees) {
      if (rowIndex <= 1) defaultVal = (servicesTableData[serviceNo - 1] && servicesTableData[serviceNo - 1][tableName] && servicesTableData[serviceNo - 1][tableName][rowIndex] && servicesTableData[serviceNo - 1][tableName][rowIndex][key]);
      else defaultVal = "$";
    }
    return (
      <Tabs key={key} onChange={(e) => {
        let updateObj = { [key]: e }
        if (key === "discount") updateObj = { "discount": { ...discountObj, type: e } };

        handleChange(rowIndex, updateObj)
      }} defaultValue={defaultVal || "%"} variant="pill" className={`type-selection border w-fit bg-white rounded-md absolute -left-[60px] -top-[4px]`} onMouseLeave={(e) => !(e.relatedTarget && e.relatedTarget.parentElement && e.relatedTarget.parentElement.classList && e.relatedTarget.parentElement.classList.contains("type-selection")) ? setShowValueTypeSelection(0) : null}>
        <TabList className="type-selection">
          <TabNav className="py-1 px-3 mr-0 text-lg" value="%">%</TabNav>
          <TabNav className="py-1 px-3 mr-0 text-lg" value="$">$</TabNav>
        </TabList>
      </Tabs>
    )
  }

  // const handleLaborSubTotal = (value, key, serviceNo, rowIndex) => {
  //   let val = value;
  //   if (!val) {
  //     if (servicesTableData[serviceNo] && servicesTableData[serviceNo]["labors"] && servicesTableData[serviceNo]["labors"][rowIndex] && servicesTableData[serviceNo]["labors"][rowIndex]["hours"]) val = servicesTableData[serviceNo]["labors"][rowIndex]["rate"];
  //     if (servicesTableData[serviceNo] && servicesTableData[serviceNo]["labors"] && servicesTableData[serviceNo]["labors"][rowIndex] && servicesTableData[serviceNo]["labors"][rowIndex]["rate"]) val = servicesTableData[serviceNo]["labors"][rowIndex]["rate"];
  //   }
  //   // setLaborSubTotal((+e.target.value || 0) * (servicesTableData[serviceNo]["labors"][rowIndex]["rate"] || 0))
  // }

  const handleLaborCalculation = (type, value, serviceNo, rowIndex) => {
    serviceNo = serviceNo - 1;

    let hours = 0, rate = 0, discount = {};

    // Extract relevant data
    const labor = servicesTableData[serviceNo]?.labors?.[rowIndex] || {};
    if (labor.hours) hours = labor.hours;
    if (labor.rate) rate = labor.rate;
    if (labor.discount) discount = labor.discount;

    // Calculate base total
    let total;
    if (type === "hours") {
      total = value * rate;
    } else if (type === "rate") {
      total = value * hours;
    } else if (type === "discount") {
      total = rate * hours;
    } else {
      console.error("Invalid type specified");
      return;
    }

    // Apply discount if applicable
    const appliedDiscount = type === "discount" ? value : discount;
    if (appliedDiscount?.type && appliedDiscount?.value) {
      if (appliedDiscount.type === "$") {
        total -= appliedDiscount.value;
      } else if (appliedDiscount.type === "%") {
        total -= total * (appliedDiscount.value / 100);
      }
    }

    laborSubTotalMap.current[serviceNo] = {...laborSubTotalMap.current[serviceNo], [rowIndex]: (total || 0)};
    let subtotalArray = Object.values(laborSubTotalMap.current[serviceNo]);
    let subtotalSum =  subtotalArray.reduce((sum, value) => sum + (value ? value : 0), 0);
    setLaborSubTotal({ ...laborSubTotal, [serviceNo]: {...laborSubTotal[serviceNo], [rowIndex]: subtotalSum} });
  };

  const columns = [
    {
      header: 'Labor',
      accessor: 'laborName',
      render: (value: string, rowIndex: number, handleChange: (index: number, values: object) => void) => (
        <Input
          className="h-8"
          type="text"
          value={value}
          onChange={(e) => handleChange(rowIndex, { 'laborName': e.target.value })}
          placeholder="Enter labor..."
        />
      ),
    },
    {
      header: 'Technician',
      accessor: 'technician',
      render: (value: string, rowIndex: number, handleChange: (index: number, values: object) => void) => (
        <div className="flex justify-center align-center">
          <Dropdown
            placement="bottom-end"
            menuStyle={{ marginTop: "8px" }}
            renderTitle={<p className="text-sm text-indigo-600 cursor-pointer hover:text-indigo-400">{value || "Assign Technician"}</p>}
            onSelect={(val) => handleChange(rowIndex, { "technician": val })}
          >
            {technicians.map((item) => (
              <Dropdown.Item key={item.key} eventKey={item.key}>
                {item.name}
              </Dropdown.Item>
            ))}
          </Dropdown>
        </div>
        // <span className="text-nowrap text-center block">{value}</span>
      ), // Static label
    },
    // {
    //   header: 'Tags',
    //   accessor: 'tags',
    //   render: (value: string) => <span>{value}</span>, // Static label
    // },
    {
      header: 'Hours',
      accessor: 'hours',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void, serviceNo) => (
        <div className="w-full flex justify-center align-center">
          <Input
            className="h-8 w-14 text-center"
            placeholder="0"
            type="text"
            value={value}
            onChange={(e) => { handleChange(rowIndex, { 'hours': +e.target.value }); handleLaborCalculation("hours", +e.target.value, serviceNo, rowIndex); }}
          />
        </div>
      ),
    },
    {
      header: 'Rate/hr',
      accessor: 'rate',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void, serviceNo) => (
        <div className="w-full flex justify-center align-center">
          <Input
            className="h-8 w-14 text-center"
            placeholder="0"
            type="text"
            value={value}
            onChange={(e) => { handleChange(rowIndex, { 'rate': +e.target.value }); handleLaborCalculation("rate", +e.target.value, serviceNo, rowIndex); }}
          />
        </div>
      ),
    },
    {
      header: 'Discount',
      accessor: 'discount',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void, serviceNo) => (
        <div className="w-full flex justify-center align-center relative">
          {showValueTypeSelection === (`labor-${rowIndex + 1 + serviceNo}`) ? generateTypeTabForHover(handleChange, rowIndex, serviceNo, "discount", "labors") : null}
          <Input
            className="h-8 w-14 text-center"
            placeholder={`0${(servicesTableData[serviceNo - 1] && servicesTableData[serviceNo - 1]["labors"] && servicesTableData[serviceNo - 1]["labors"][rowIndex] && servicesTableData[serviceNo - 1]["labors"][rowIndex].discount && servicesTableData[serviceNo - 1]["labors"][rowIndex].discount.type) || "%"}`}
            type="text"
            value={(value && value.value) || ""}
            onChange={(e) => { handleChange(rowIndex, { 'discount': { type: value.type || "%", value: +e.target.value } }); handleLaborCalculation("discount", { type: value.type || "%", value: +e.target.value }, serviceNo, rowIndex) }}
            onMouseEnter={() => setShowValueTypeSelection(`labor-${rowIndex + 1 + serviceNo}`)}
            onMouseLeave={(e) => !(e.relatedTarget && e.relatedTarget.parentElement && e.relatedTarget.parentElement.classList && e.relatedTarget.parentElement.classList.contains("type-selection")) ? setShowValueTypeSelection("") : null}
          />
        </div>
      ),
    },
    {
      header: 'Subtotal',
      accessor: 'subtotal',
      render: (value: number, rowIndex: number, _, serviceNo) => {
        let val = 0;
        if (servicesTableData[serviceNo - 1] && servicesTableData[serviceNo - 1]["labors"] && servicesTableData[serviceNo - 1]["labors"][rowIndex]) {
          let data = servicesTableData[serviceNo - 1]["labors"][rowIndex];
          if (data.rate && data.hours) val = data.rate * data.hours;
          if (data.discount.value) {
            let discount = data.discount.type === "%" ? val * (data.discount.value / 100) : data.discount.value;
            val -= discount;
          }
        }

        // setLaborSubTotal((laborSubTotal || 0) + (val || 0));
        return <span className="block text-center">${(val || 0).toFixed(2)}</span>
      },
    },
  ];

  // console.log("---this", laborSubTotal);

  const initialData = [
    { labor: '', technician: 'Assign Technician', hours: null, rate: null, discount: {}, subtotal: 0 },
  ];

  const initialFeeData = [
    { fee: "EPA", feeSubtotal: 0 },
    { fee: "Shop Supplies", feeSubtotal: 0 },
  ];

  const initialPartsData = [
    { part: '', parthash: "", bin: "", partQty: null, partCost: null, partPrice: null, discount: {}, partSubtotal: 0 },
    // { part: '', parthash: "", bin: "", partQty: null, partCost: null, partPrice: null, partDisc: null, partSubtotal: 0 },
  ];

  const initialTiresData = [
    { tire: '', tirehash: "", tireQty: null, tireCost: null, tirePrice: null, discount: {}, tireSubtotal: 0 },
    // { tire: '', tirehash: "", tireQty: null, tireCost: null, tirePrice: null, tireDisc: null, tireSubtotal: 0 },
  ];

  const initialSubcontractData = [
    { subcontract: '', vendor: "", subcontractCost: null, subcontractPrice: null, discount: {}, subcontractSubtotal: 0 },
  ];

  const initialDiscountData = [
    { serviceDiscount: "Discount", discount: {} },
    // { serviceDiscount: "Discount", serviceDisc: null },
  ];

  const handleDataUpdate = (serviceno, data, tableName) => {
    let servicesNewData = { ...servicesTableData, [serviceno - 1]: { ...servicesTableData[serviceno - 1], [tableName]: data } };
    setServicesTableData({ ...servicesTableData, [serviceno - 1]: { ...servicesTableData[serviceno - 1], [tableName]: data } });
    if (storeDataInParent) storeDataInParent(servicesNewData);
  }

  // console.log("srvcstbledta", servicesTableData);

  const handleFeeSubtotal = (fee, serviceNo, rowIndex, type) => {
    // console.log("feeSubTotalMap.current[rowIndex]", fee);
    serviceNo = serviceNo - 1;

    let feeType = "%";
    if (servicesTableData[serviceNo] && servicesTableData[serviceNo]["serviceFee"] && servicesTableData[serviceNo]["serviceFee"][rowIndex] && servicesTableData[serviceNo]["serviceFee"][rowIndex]["feeSubtotalType"]) feeType = servicesTableData[serviceNo]["serviceFee"][rowIndex]["feeSubtotalType"];
    if (rowIndex > 1) feeType = "$";

    if (type) feeType = type;

    let labor = ((Object.values(laborSubTotal[serviceNo] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0);
    let part = ((Object.values(partSubTotal[serviceNo] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0);
    let tire = ((Object.values(tireSubTotal[serviceNo] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0);
    let subcontract = ((Object.values(subcontractSubTotal[serviceNo] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0);
    let overall = ((Object.values(overallDiscount[serviceNo] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0);

    let overallTotal = labor + part + tire + subcontract;

    if (feeType === "%") {
      fee = (overallTotal * (fee / 100));
    }

    feeSubTotalMap.current[serviceNo] = {...feeSubTotalMap.current[serviceNo], [rowIndex]: fee};
    let subtotalArray = Object.values(feeSubTotalMap.current[serviceNo]);
    let subtotalSum =  subtotalArray.reduce((sum, value) => sum + (value ? value : 0), 0);
    // console.log("----feeSubTotalMap.current[serviceNo]", feeSubTotalMap.current[serviceNo], overall, subtotalSum, labor + part + tire + subcontract);
    setFeesSubTotal({ ...feesSubTotal, [serviceNo]: { ...feeSubTotalMap.current[serviceNo], [rowIndex]: fee } });

    if (Number(savedTotal[serviceNo]) == ((labor + part + tire + subcontract + subtotalSum) - overall)) isFeePreffilled.current = true;
  }

  const feeColumns = [
    {
      header: 'Service Fee',
      accessor: 'fee',
      render: (value: string, rowIndex: number, handleChange: (index: number, values: object) => void) => {
        return rowIndex <= 1 ?
          <Input
            className="h-8"
            type="text"
            value={value}
            onChange={(e) => handleChange(rowIndex, { 'fee': e.target.value })}
            placeholder="Enter fees..."
          />
          :
          <SelectAndButton
            options={allFees}
            addNewButtonLabel="Add New Part"
            value={allFees.find(fee => fee.feeName === value)}
            placeholder="Add Parts..."
            onChange={(value) => { handleChange(rowIndex, { "fee": value.feeName, "feeSubtotal": value.feeAmount }) }}
            addNewClick={() => setAddFeeModalOpen(true)}
            className="w-[200px]"
          />
      },
    },
    {
      header: '',
      accessor: '',
      render: (value: string, rowIndex: number, handleChange: (index: number, values: object) => void) => (
        <div className="flex justify-center align-center invisible">
          <Dropdown
            placement="bottom-end"
            menuStyle={{ marginTop: "8px" }}
            renderTitle={<p className="text-sm text-indigo-600 cursor-pointer hover:text-indigo-400">{value || "Assign Technician"}</p>}
            onSelect={(val) => handleChange(rowIndex, { "technician": val })}
          >
            {technicians.map((item) => (
              <Dropdown.Item key={item.key} eventKey={item.key}>
                {item.name}
              </Dropdown.Item>
            ))}
          </Dropdown>
        </div>
        // <span className="text-nowrap text-center block">{value}</span>
      ), // Static label
    },
    // {
    //   header: 'Tags',
    //   accessor: 'tags',
    //   render: (value: string) => <span>{value}</span>, // Static label
    // },
    {
      header: '',
      accessor: '',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void) => (
        <div className="w-full flex justify-center align-center invisible">
          <Input
            className="h-8 w-14 text-center"
            placeholder="0"
            type="text"
            value={value}
            onChange={(e) => handleChange(rowIndex, { 'hours': +e.target.value })}
          />
        </div>
      ),
    },
    {
      header: '',
      accessor: '',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void) => (
        <div className="w-full flex justify-center align-center invisible">
          <Input
            className="h-8 w-14 text-center"
            placeholder="0"
            type="text"
            value={value}
            onChange={(e) => handleChange(rowIndex, { 'rate': +e.target.value })}
          />
        </div>
      ),
    },
    {
      header: '',
      accessor: '',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void) => (
        <div className="w-full flex justify-center align-center invisible">
          <Input
            className="h-8 w-14 text-center"
            placeholder="0%"
            type="text"
            value={value}
            onChange={(e) => handleChange(rowIndex, { 'disc': +e.target.value })}
          />
        </div>
      ),
    },
    {
      header: 'Subtotal',
      accessor: 'feeSubtotal',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void, serviceNo) => {
        // if (rowIndex <= 1) setFeesSubTotal((feesSubTotal || 0) + (value || 0));
        // let val = 0;
        // if (servicesTableData[serviceNo] && servicesTableData[serviceNo].rowData && servicesTableData[serviceNo].rowData[rowIndex]) {
        //   let data = servicesTableData[serviceNo].rowData[rowIndex];
        //   if (data.rate && data.hours) val = data.rate * data.hours;
        //   if (data.disc) {
        //     let discount = val * (data.disc/100);
        //     val -= discount;
        //   }
        // }
        return <div className="w-full flex justify-center align-center relative">
          {rowIndex <= 1 && showValueTypeSelection === (`feeSubtotal-${rowIndex + 1 + serviceNo}`) ? generateTypeTabForHover(handleChange, rowIndex, serviceNo, "feeSubtotalType", "serviceFee", true) : null}
          {/* <Input
            className="h-8 w-14 text-center"
            placeholder="$0"
            type="text"
            value={value}
            onChange={(e) => {handleChange(rowIndex, { 'feeSubtotal': +e.target.value }); handleFeeSubtotal(+e.target.value, serviceNo, rowIndex)}}
            onMouseEnter={() => setShowValueTypeSelection(`feeSubtotal-${rowIndex + 1 + serviceNo}`)}
            onMouseLeave={(e) => !(e.relatedTarget && e.relatedTarget.parentElement && e.relatedTarget.parentElement.classList && e.relatedTarget.parentElement.classList.contains("type-selection")) ? setShowValueTypeSelection("") : null}
          /> */}
          <Input
            className="h-8 w-14 text-center"
            placeholder="$0"
            type="text"
            value={value}
            onChange={(e) => { handleChange(rowIndex, { 'feeSubtotal': +e.target.value }); handleFeeSubtotal(+e.target.value, serviceNo, rowIndex) }}
            onMouseEnter={() => setShowValueTypeSelection(`feeSubtotal-${rowIndex + 1 + serviceNo}`)}
            onMouseLeave={(e) => !(e.relatedTarget && e.relatedTarget.parentElement && e.relatedTarget.parentElement.classList && e.relatedTarget.parentElement.classList.contains("type-selection")) ? setShowValueTypeSelection("") : null}
          />
        </div>
        // return <div className="w-full flex justify-center align-center">
        //   <Input
        //     className="h-8 w-14 text-center"
        //     placeholder="0"
        //     type="text"
        //     // value={value}
        //     onChange={(e) => handleChange(rowIndex, {'subtotal': +e.target.value})}
        //   />
        // </div>
      }, // Static subtotal display
    },
  ]

  const handlePartCalculation = (type, value, serviceNo, rowIndex) => {
    serviceNo = serviceNo - 1;

    let qty = 0, price = 0, discount = {};

    // Extract relevant data
    const part = servicesTableData[serviceNo]?.parts?.[rowIndex] || {};
    if (part.partQty) qty = part.partQty;
    if (part.partPrice) price = part.partPrice;
    if (part.discount) discount = part.discount;

    // Calculate base total
    let total;
    if (type === "qty") {
      total = value * price;
    } else if (type === "price") {
      total = value * qty;
    } else if (type === "discount") {
      total = qty * price;
    } else {
      console.error("Invalid type specified");
      return;
    }

    // Apply discount if applicable
    const appliedDiscount = type === "discount" ? value : discount;
    if (appliedDiscount?.type && appliedDiscount?.value) {
      if (appliedDiscount.type === "$") {
        total -= appliedDiscount.value;
      } else if (appliedDiscount.type === "%") {
        total -= total * (appliedDiscount.value / 100);
      }
    }
  
    partSubTotalMap.current[serviceNo] = {...partSubTotalMap.current[serviceNo], [rowIndex]: (total || 0)};
    let subtotalArray = Object.values(partSubTotalMap.current[serviceNo]);
    let subtotalSum =  subtotalArray.reduce((sum, value) => sum + (value ? value : 0), 0);
    setPartSubTotal({ ...partSubTotal, [serviceNo]: {...partSubTotal[serviceNo], [rowIndex]: subtotalSum} });
  };


  const partColumns = [
    {
      header: 'Part',
      accessor: 'part',
      render: (value: string, rowIndex: number, handleChange: (index: number, values: object) => void) => (
        <SelectAndButton
          options={allParts}
          addNewButtonLabel="Add New Part"
          value={(value.partName || value.part)}
          placeholder="Add Parts..."
          onChange={(value) => { handleChange(rowIndex, { "part": value.partName, "parthash": value.partSerialNo, "bin": value.bin, "partCost": +value.cost, "partPrice": +value.retail, "technician": value.technician, "partId": value._id }) }}
          addNewClick={() => setAddPartModalOpen(true)}
          className="w-[150px]"
        />
      ),
    },
    {
      header: 'Part #',
      accessor: 'partHash',
      render: (value: string, rowIndex: number, handleChange: (index: number, values: object) => void) => (
        <Input
          className="h-8 w-14 text-center"
          type="text"
          value={value}
          onChange={(e) => handleChange(rowIndex, { 'partHash': e.target.value })}
          placeholder="-"
        />
      ),
    },
    {
      header: 'Bin',
      accessor: 'bin',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void) => (
        <div className="w-full flex justify-center align-center">
          <Input
            className="h-8 w-14 text-center"
            placeholder="-"
            type="text"
            value={value}
            onChange={(e) => handleChange(rowIndex, { 'bin': +e.target.value })}
          />
        </div>
      ),
    },
    {
      header: 'Technician',
      accessor: 'technician',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void) => (
        <div className="flex justify-center align-center">
          <Dropdown
            placement="bottom-end"
            menuStyle={{ marginTop: "8px" }}
            renderTitle={<p className="text-sm whitespace-nowrap text-indigo-600 cursor-pointer hover:text-indigo-400">{value || "Assign Technician"}</p>}
            onSelect={(val) => handleChange(rowIndex, { "technician": val })}
          >
            {technicians.map((item) => (
              <Dropdown.Item key={item.key} eventKey={item.key}>
                {item.name}
              </Dropdown.Item>
            ))}
          </Dropdown>
        </div>
      ),
    },
    {
      header: 'Qty',
      accessor: 'partQty',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void, serviceNo) => (
        <div className="w-full flex justify-center align-center">
          <Input
            className="h-8 w-14 text-center"
            placeholder="0"
            type="text"
            value={value}
            onChange={(e) => { handleChange(rowIndex, { 'partQty': +e.target.value }); handlePartCalculation("qty", +e.target.value, serviceNo, rowIndex) }}
          />
        </div>
      ),
    },
    {
      header: 'Cost',
      accessor: 'partCost',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void, serviceNo) => (
        <div className="w-full flex justify-center align-center">
          <Input
            className="h-8 w-14 text-center"
            placeholder="0"
            type="text"
            value={value}
            onChange={(e) => handleChange(rowIndex, { 'partCost': +e.target.value })}
          />
        </div>
      ),
    },
    {
      header: 'Price',
      accessor: 'partPrice',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void, serviceNo) => (
        <div className="w-full flex justify-center align-center">
          <Input
            className="h-8 w-14 text-center"
            placeholder="0"
            type="text"
            value={value}
            onChange={(e) => { handleChange(rowIndex, { 'partPrice': +e.target.value }); handlePartCalculation("price", +e.target.value, serviceNo, rowIndex); }}
          />
        </div>
      ),
    },
    {
      header: 'Discount',
      accessor: 'discount',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void, serviceNo) => (
        <div className="w-full flex justify-center align-center relative">
          {showValueTypeSelection === (`part-${rowIndex + 1 + serviceNo}`) ? generateTypeTabForHover(handleChange, rowIndex, serviceNo, "discount", "parts") : null}
          <Input
            className="h-8 w-14 text-center"
            placeholder="0%"
            type="text"
            value={(value && value.value) || ""}
            onChange={(e) => { handleChange(rowIndex, { 'discount': { type: value.type || "%", value: +e.target.value } }); handlePartCalculation("discount", { type: value.type || "%", value: +e.target.value }, serviceNo, rowIndex); }}
            onMouseEnter={() => setShowValueTypeSelection(`part-${rowIndex + 1 + serviceNo}`)}
            onMouseLeave={(e) => !(e.relatedTarget && e.relatedTarget.parentElement && e.relatedTarget.parentElement.classList && e.relatedTarget.parentElement.classList.contains("type-selection")) ? setShowValueTypeSelection("") : null}
          />
        </div>
      ),
    },
    {
      header: 'Subtotal',
      accessor: 'partSubtotal',
      render: (value: number, rowIndex: number, _, serviceNo) => {
        let val = 0;
        if (servicesTableData[serviceNo - 1] && servicesTableData[serviceNo - 1]["parts"] && servicesTableData[serviceNo - 1]["parts"][rowIndex]) {
          let data = servicesTableData[serviceNo - 1]["parts"][rowIndex];
          if (data.partQty && data.partPrice) val = data.partQty * data.partPrice;
          if (data.discount.value) {
            let discount = data.discount.type === "%" ? val * (data.discount.value / 100) : data.discount.value;
            val -= discount;
          }
        }

        // setPartSubTotal((partSubTotal || 0) + (val || 0))
        return <span className="block text-center">${(val || 0).toFixed(2)}</span>
      },
    },
  ];

  const handleTireCalculation = (type, value, serviceNo, rowIndex) => {
    serviceNo = serviceNo - 1;

    let qty = 0, price = 0, discount = {};

    // Extract relevant data
    const tire = servicesTableData[serviceNo]?.tires?.[rowIndex] || {};
    if (tire.tireQty) qty = tire.tireQty;
    if (tire.tirePrice) price = tire.tirePrice;
    if (tire.discount) discount = tire.discount;

    // Calculate base total
    let total;
    if (type === "qty") {
      total = value * price;
    } else if (type === "price") {
      total = value * qty;
    } else if (type === "discount") {
      total = qty * price;
    } else {
      console.error("Invalid type specified");
      return;
    }

    // Apply discount if applicable
    const appliedDiscount = type === "discount" ? value : discount;
    if (appliedDiscount?.type && appliedDiscount?.value) {
      if (appliedDiscount.type === "$") {
        total -= appliedDiscount.value;
      } else if (appliedDiscount.type === "%") {
        total -= total * (appliedDiscount.value / 100);
      }
    }


    tireSubTotalMap.current[serviceNo] = {...tireSubTotalMap.current[serviceNo], [rowIndex]: (total || 0)};
    let subtotalArray = Object.values(tireSubTotalMap.current[serviceNo]);
    let subtotalSum =  subtotalArray.reduce((sum, value) => sum + (value ? value : 0), 0);
    setTireSubTotal({ ...tireSubTotal, [serviceNo]: {...tireSubTotal[serviceNo], [rowIndex]: subtotalSum} });
  };

  const tireColumns = [
    {
      header: 'Tire',
      accessor: 'tire',
      render: (value: any, rowIndex: number, handleChange: (index: number, values: object) => void) => {
        return (
          <SelectAndButton
            options={allTires}
            addNewButtonLabel="Add New Tire"
            value={value.tireName}
            placeholder="Add Tires..."
            onChange={(value) => { handleChange(rowIndex, { ...value, tirehash: value.inventoryAndPrice.part, tireCost: value.inventoryAndPrice.cost, tirePrice: value.inventoryAndPrice.retail, "tireId": value._id }) }}
            addNewClick={() => setAddTireModalOpen(true)}
            className="w-[200px]"
          />
        )
      },
    },
    {
      header: 'Tire #',
      accessor: 'tirehash',
      render: (value: string, rowIndex: number, handleChange: (index: number, values: object) => void) => (
        <Input
          className="h-8"
          type="text"
          value={value}
          onChange={(e) => handleChange(rowIndex, { 'tirehash': e.target.value })}
          placeholder="-"
        />
      ),
    },
    // {
    //   header: 'Bin',
    //   accessor: 'bin',
    //   render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void) => (
    //     <div className="w-full flex justify-center align-center">
    //       <Input
    //         className="h-8 w-14 text-center"
    //         placeholder="-"
    //         type="text"
    //         value={value}
    //         onChange={(e) => handleChange(rowIndex, 'bin', +e.target.value)}
    //       />
    //     </div>
    //   ),
    // },
    {
      header: 'Qty',
      accessor: 'tireQty',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void, serviceNo) => (
        <div className="w-full flex justify-center align-center">
          <Input
            className="h-8 w-14 text-center"
            placeholder="0"
            type="text"
            value={value}
            onChange={(e) => { handleChange(rowIndex, { 'tireQty': +e.target.value }); handleTireCalculation("qty", +e.target.value, serviceNo, rowIndex) }}
          />
        </div>
      ),
    },
    {
      header: 'Cost',
      accessor: 'tireCost',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void) => (
        <div className="w-full flex justify-center align-center">
          <Input
            className="h-8 w-14 text-center"
            placeholder="0"
            type="text"
            value={value}
            onChange={(e) => handleChange(rowIndex, { 'tireCost': +e.target.value })}
          />
        </div>
      ),
    },
    {
      header: 'Price',
      accessor: 'tirePrice',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void, serviceNo) => (
        <div className="w-full flex justify-center align-center">
          <Input
            className="h-8 w-14 text-center"
            placeholder="0"
            type="text"
            value={value}
            onChange={(e) => { handleChange(rowIndex, { 'tirePrice': +e.target.value }); handleTireCalculation("price", +e.target.value, serviceNo, rowIndex) }}
          />
        </div>
      ),
    },
    {
      header: 'Discount',
      accessor: 'discount',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void, serviceNo) => (
        <div className="w-full flex justify-center align-center relative">
          {showValueTypeSelection === (`tire-${rowIndex + 1 + serviceNo}`) ? generateTypeTabForHover(handleChange, rowIndex, serviceNo, "discount", "tires") : null}
          <Input
            className="h-8 w-14 text-center"
            placeholder="0%"
            type="text"
            value={(value && value.value) || ""}
            onChange={(e) => { handleChange(rowIndex, { 'discount': { type: value.type || "%", value: +e.target.value } }); handleTireCalculation("discount", { type: value.type || "%", value: +e.target.value }, serviceNo, rowIndex) }}
            onMouseEnter={() => setShowValueTypeSelection(`tire-${rowIndex + 1 + serviceNo}`)}
            onMouseLeave={(e) => !(e.relatedTarget && e.relatedTarget.parentElement && e.relatedTarget.parentElement.classList && e.relatedTarget.parentElement.classList.contains("type-selection")) ? setShowValueTypeSelection("") : null}
          />
        </div>
        // <div className="w-full flex justify-center align-center">
        //   <Input
        //     className="h-8 w-14 text-center"
        //     placeholder="0%"
        //     type="text"
        //     value={value}
        //     onChange={(e) => handleChange(rowIndex, {'tireDisc': +e.target.value})}
        //   />
        // </div>
      ),
    },
    {
      header: 'Subtotal',
      accessor: 'tireSubtotal',
      render: (value: number, rowIndex: number, _, serviceNo) => {
        let val = 0;
        if (servicesTableData[serviceNo - 1] && servicesTableData[serviceNo - 1]["tires"] && servicesTableData[serviceNo - 1]["tires"][rowIndex]) {
          let data = servicesTableData[serviceNo - 1]["tires"][rowIndex];
          if (data.tireQty && data.tirePrice) val = data.tireQty * data.tirePrice;
          if (data.discount && data.discount?.value) {
            let discount = data.discount.type === "%" ? val * (data.discount.value / 100) : data.discount.value;
            val -= discount;
          }
        }

        // setTireSubTotal((tireSubTotal || 0) + (val || 0))
        return <span className="block text-center">${(val || 0).toFixed(2)}</span>
      },
    },
  ];

  const calculateTotalWithDiscount = (price, discount) => {
    if (discount.type && discount.value) {
      if (discount.type === "$") {
        return price - discount.value;
      } else if (discount.type === "%") {
        return price - (price * discount.value / 100);
      }
    }
    return price;
  };

  const updateSubcontractSubTotal = (key, value, serviceNo, rowIndex) => {
    serviceNo = serviceNo - 1

    const subcontractData =
      servicesTableData[serviceNo]?.subcontract?.[rowIndex] || {};

    // Get the base price or discount based on the key
    const basePrice = key === "price" ? value : subcontractData.price || 0;
    const discount = key === "discount" ? value : subcontractData.discount || {};

    // Calculate the total
    const total = calculateTotalWithDiscount(basePrice, discount);
  
    subcontractSubTotalMap.current[serviceNo] = {...subcontractSubTotalMap.current[serviceNo], [rowIndex]: (total || 0)};
    let subtotalArray = Object.values(subcontractSubTotalMap.current[serviceNo]);
    let subtotalSum =  subtotalArray.reduce((sum, value) => sum + (value ? value : 0), 0);
    setSubcontractSubTotal({ ...subcontractSubTotal, [serviceNo]: {...subcontractSubTotal[serviceNo], [rowIndex]: subtotalSum} });
  };

  const handleDiscountCalculation = (value, rowIndex, serviceNo, isPrefill) => {
    serviceNo = serviceNo - 1;
    let labor = ((Object.values(laborSubTotal[isPrefill ? serviceNo+1 : serviceNo] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0);
    let part = ((Object.values(partSubTotal[isPrefill ? serviceNo+1 : serviceNo] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0);
    let tire = ((Object.values(tireSubTotal[isPrefill ? serviceNo+1 : serviceNo] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0);
    let subcontract = ((Object.values(subcontractSubTotal[isPrefill ? serviceNo+1 : serviceNo] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0);
    let fees = ((Object.values(feesSubTotal[isPrefill ? serviceNo+1 : serviceNo] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0);

    let overallTotal = labor + part + tire + subcontract + fees;
    let discountInDollars = 0;
    console.log("--fired", value);
    if (value.type && value.value) {
      if (value.type === "$") discountInDollars = value.value;
      else if (value.type === "%") discountInDollars = (overallTotal * (value.value / 100));
    }

    if (savedTotal[serviceNo + 1] == ((overallTotal) - discountInDollars)) isDicountPreffilled.current = true;
    console.log("discountInDollars", discountInDollars, overallTotal);

    setOverallDiscount({ ...overallDiscount, [isPrefill ? serviceNo + 1 : serviceNo]: {...overallDiscount[serviceNo + 1],[rowIndex]: discountInDollars} });
  }

  const subcontractColumns = [
    {
      header: 'Subcontract',
      accessor: 'subcontractName',
      render: (value: string, rowIndex: number, handleChange: (index: number, values: object) => void) => (
        <Input
          className="h-8"
          type="text"
          value={value}
          onChange={(e) => handleChange(rowIndex, { 'subcontractName': e.target.value })}
          placeholder="Enter subcontract..."
        />
      ),
    },
    {
      header: 'Vendor',
      accessor: 'vendor',
      render: (value: string, rowIndex: number, handleChange: (index: number, values: object) => void) => (
        <Input
          className="h-8"
          type="text"
          value={value}
          onChange={(e) => handleChange(rowIndex, { 'vendor': e.target.value })}
          placeholder="-"
        />
      ),
    },
    // {
    //   header: 'Bin',
    //   accessor: 'bin',
    //   render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void) => (
    //     <div className="w-full flex justify-center align-center">
    //       <Input
    //         className="h-8 w-14 text-center"
    //         placeholder="-"
    //         type="text"
    //         value={value}
    //         onChange={(e) => handleChange(rowIndex, 'bin', +e.target.value)}
    //       />
    //     </div>
    //   ),
    // },
    // {
    //   header: 'Qty',
    //   accessor: 'tireQty',
    //   render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void) => (
    //     <div className="w-full flex justify-center align-center">
    //       <Input
    //         className="h-8 w-14 text-center"
    //         placeholder="0"
    //         type="text"
    //         value={value}
    //         onChange={(e) => handleChange(rowIndex, 'tireQty', +e.target.value)}
    //       />
    //     </div>
    //   ),
    // },
    {
      header: 'Cost',
      accessor: 'cost',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void) => (
        <div className="w-full flex justify-center align-center">
          <Input
            className="h-8 w-14 text-center"
            placeholder="0"
            type="text"
            value={value}
            onChange={(e) => handleChange(rowIndex, { 'cost': +e.target.value })}
          />
        </div>
      ),
    },
    {
      header: 'Price',
      accessor: 'price',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void, serviceNo) => (
        <div className="w-full flex justify-center align-center">
          <Input
            className="h-8 w-14 text-center"
            placeholder="0"
            type="text"
            value={value}
            onChange={(e) => { handleChange(rowIndex, { 'price': +e.target.value }); updateSubcontractSubTotal("price", +e.target.value, serviceNo, rowIndex) }}
          />
        </div>
      ),
    },
    {
      header: 'Discount',
      accessor: 'discount',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void, serviceNo) => (
        <div className="w-full flex justify-center align-center relative">
          {showValueTypeSelection === (`subcontract-${rowIndex + 1 + serviceNo}`) ? generateTypeTabForHover(handleChange, rowIndex, serviceNo, "discount", "subcontract") : null}
          <Input
            className="h-8 w-14 text-center"
            placeholder="0%"
            type="text"
            value={(value && value.value) || ""}
            onChange={(e) => { handleChange(rowIndex, { 'discount': { type: value.type || "%", value: +e.target.value } }); updateSubcontractSubTotal("discount", { type: value.type || "%", value: +e.target.value }, serviceNo, rowIndex) }}
            onMouseEnter={() => setShowValueTypeSelection(`subcontract-${rowIndex + 1 + serviceNo}`)}
            onMouseLeave={(e) => !(e.relatedTarget && e.relatedTarget.parentElement && e.relatedTarget.parentElement.classList && e.relatedTarget.parentElement.classList.contains("type-selection")) ? setShowValueTypeSelection("") : null}
          />
        </div>
        // <div className="w-full flex justify-center align-center">
        //   <Input
        //     className="h-8 w-14 text-center"
        //     placeholder="0%"
        //     type="text"
        //     value={value}
        //     onChange={(e) => handleChange(rowIndex, {'subcontractDisc': +e.target.value})}
        //   />
        // </div>
      ),
    },
    {
      header: 'Subtotal',
      accessor: 'subTotal',
      render: (value: number, rowIndex: number, _, serviceNo) => {
        let val = 0;
        if (servicesTableData[serviceNo - 1] && servicesTableData[serviceNo - 1]["subcontract"] && servicesTableData[serviceNo - 1]["subcontract"][rowIndex]) {
          let data = servicesTableData[serviceNo - 1]["subcontract"][rowIndex];
          if (data.price) val = data.price;
          if (data.discount && data.discount?.value) {
            let discount = data.discount.type === "%" ? val * (data.discount.value / 100) : data.discount.value;
            val -= discount;
          }
        }

        // setSubcontractSubTotal((subcontractSubTotal || 0) + (val || 0))
        return <span className="block text-center">${(val || 0).toFixed(2)}</span>
      },
    },
  ];

  const discountColumns = [
    {
      header: 'Service Discount',
      accessor: 'serviceDiscount',
      render: () => (<span className="ml-3">Discount</span>),
    },
    {
      header: '',
      accessor: '',
      render: (value: string, rowIndex: number, handleChange: (index: number, values: object) => void) => (
        <div className="flex justify-center align-center invisible">
          <Dropdown
            placement="bottom-end"
            menuStyle={{ marginTop: "8px" }}
            renderTitle={<p className="text-sm text-indigo-600 cursor-pointer hover:text-indigo-400">{value || "Assign Technician"}</p>}
            onSelect={(val) => handleChange(rowIndex, { "technician": val })}
          >
            {technicians.map((item) => (
              <Dropdown.Item key={item.key} eventKey={item.key}>
                {item.name}
              </Dropdown.Item>
            ))}
          </Dropdown>
        </div>
        // <span className="text-nowrap text-center block">{value}</span>
      ), // Static label
    },
    // {
    //   header: 'Tags',
    //   accessor: 'tags',
    //   render: (value: string) => <span>{value}</span>, // Static label
    // },
    {
      header: '',
      accessor: '',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void) => (
        <div className="w-full flex justify-center align-center invisible">
          <Input
            className="h-8 w-14 text-center"
            placeholder="0"
            type="text"
            value={value}
            onChange={(e) => handleChange(rowIndex, { 'hours': +e.target.value })}
          />
        </div>
      ),
    },
    {
      header: '',
      accessor: '',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void) => (
        <div className="w-full flex justify-center align-center invisible">
          <Input
            className="h-8 w-14 text-center"
            placeholder="0"
            type="text"
            value={value}
            onChange={(e) => handleChange(rowIndex, { 'rate': +e.target.value })}
          />
        </div>
      ),
    },
    {
      header: '',
      accessor: '',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void) => (
        <div className="w-full flex justify-center align-center invisible">
          <Input
            className="h-8 w-14 text-center"
            placeholder="0%"
            type="text"
            value={value}
            onChange={(e) => handleChange(rowIndex, { 'disc': +e.target.value })}
          />
        </div>
      ),
    },
    {
      header: 'Discount',
      accessor: 'discount',
      render: (value: number, rowIndex: number, handleChange: (index: number, values: object) => void, serviceNo) => (
        <div className="w-full flex justify-center align-center relative">
          {showValueTypeSelection === (`discount-${rowIndex + 1 + serviceNo}`) ? generateTypeTabForHover(handleChange, rowIndex, serviceNo, "discount", "discount") : null}
          <Input
            className="h-8 w-14 text-center"
            placeholder="0%"
            type="text"
            value={(value && value.value) || ""}
            onChange={(e) => {handleChange(rowIndex, { 'discount': { type: value.type || "%", value: +e.target.value } }); handleDiscountCalculation({ type: value.type || "%", value: +e.target.value }, rowIndex, serviceNo)}}
            onMouseEnter={() => setShowValueTypeSelection(`discount-${rowIndex + 1 + serviceNo}`)}
            onMouseLeave={(e) => !(e.relatedTarget && e.relatedTarget.parentElement && e.relatedTarget.parentElement.classList && e.relatedTarget.parentElement.classList.contains("type-selection")) ? setShowValueTypeSelection("") : null}
          />
        </div>
        // <div className="w-full flex justify-center align-center">
        //   <Input
        //     className="h-8 w-14 text-center"
        //     placeholder="0%"
        //     type="text"
        //     value={value}
        //     onChange={(e) => handleChange(rowIndex, {'serviceDisc': +e.target.value})}
        //   />
        // </div>
      ),
    },
    // {
    //   header: 'Subtotal',
    //   accessor: 'subcontractSubtotal',
    //   render: (value: number, rowIndex: number, _, serviceNo) => {
    //     let val = 0;
    //     if (servicesTableData[serviceNo - 1] && servicesTableData[serviceNo]["subcontract"] && servicesTableData[serviceNo]["subcontract"][rowIndex]) {
    //       let data = servicesTableData[serviceNo]["subcontract"][rowIndex];
    //       if (data.subcontractPrice) val = data.subcontractPrice;
    //       if (data.subcontractDisc) {
    //         let discount = val * (data.subcontractDisc/100);
    //         val -= discount;
    //       }
    //     }
    //     return <span className="block text-center">${(val || 0).toFixed(2)}</span>
    //   },
    // },
  ];

  const handleAddPart = async () => {
    if (showPartsTable) partRef.current.addRowExternally();
    else {
      setShowPartsLoader(true);
      let response = await getAllParts();
      if (response && response.data && response.data.status && response.data.status === "success") {
        if (response.data.allParts && response.data.allParts.length) {
          response.data.allParts.forEach((part: any) => {
            part.value = part._id;
            part.label = part.partName;
          });

          setAllParts(response.data.allParts);
          setShowPartsTable(true);
        }
      } else toast.error('Failed to fetch parts.');

      setShowPartsLoader(false);
    }
  }

  const handleAddTire = async () => {
    if (showTiresTable) tireRef.current.addRowExternally()
    else {
      setShowTiresLoader(true);
      let response = await getAllTires();
      if (response && response.data && response.data.status && response.data.status === "success") {
        if (response.data.allTires && response.data.allTires.length) {
          response.data.allTires.forEach((tire: any) => {
            tire.value = tire._id;
            tire.label = tire.brand;
          });

          setAllTires(response.data.allTires);
          setShowTiresTable(true);
        }
      } else toast.error('Failed to fetch parts.');

      setShowTiresLoader(false);
    }
  }

  // console.log("----seveo", servicesTableData);

  const handleLaborTableMount = () => {
    if (laborTableMountedOnce.current || !prefillServicesData || !prefillServicesData.length) return;

    laborTableMountedOnce.current = true;
    prefillServicesData.forEach((service, index) => {
      if (service.labors && service.labors.length) {
        service.labors.forEach((labor, idx) => {
          laborRef.current.addRowExternally(true);
          laborRef.current.handleDataChange(idx, { "laborName": labor.laborName, "technician": labor.technician, "hours": labor.hours, "rate": labor.rate, "discount": { "type": labor.discount.type, "value": labor.discount.value }, "subTotal": labor.subTotal }, true);
          handleLaborCalculation("hours", labor.hours, index + 1, idx);
          handleLaborCalculation("rate", labor.rate, index + 1, idx);
          handleLaborCalculation("discount", { "type": labor.discount.type, "value": labor.discount.value }, index + 1, idx);
        });
      }

      if (service.serviceFee && service.serviceFee.length) {
        service.serviceFee.forEach((fee, idx) => {
          feeRef.current.addRowExternally();
          let feename = fee.fee;
          if (idx === 0) feename = "EPA";
          if (idx === 1) feename = "Shop Supplies";
          feeRef.current.handleDataChange(idx, { "fee": feename, "feeSubtotal": fee.feeSubtotal, "feeSubtotalType": fee.feeSubtotalType || "%" }, true);
          // handleFeeSubtotal(fee.feeSubtotal, index + 1, idx, fee.feeSubtotalType);
        });
      }

      if (service.discount && service.discount.length) {
        service.discount.forEach((disc, idx) => {
          serviceDiscountRef.current.handleDataChange(idx, { 'discount': { type: disc.discount.type || "%", value: disc.discount.value } });
          // handleDiscountCalculation({ type: disc.discount.type || "%", value: disc.discount.value });
        })
      }

      if (service.parts && service.parts.length) handleAddPart();
      if (service.tires && service.tires.length) handleAddTire();
      if (service.subcontract && service.subcontract.length) setShowSubTable(true);
    });
  }

  useEffect(() => {
    if (prefillServicesData && prefillServicesData.length) {
      //  
      prefillServicesData.forEach((service: any) => {
        if (service.discount && service.discount.length) {
          setShowDiscountTable(true);
        }
      })
      setServices([...prefillServicesData]);
      setServicesTableData([...prefillServicesData]);
    }
  }, [prefillServicesData]);

  const handlePartTableMount = () => {
    if (partTableMountedOnce.current) return;

    if (!prefillServicesData || !prefillServicesData.length) return;
    partTableMountedOnce.current = true;
    prefillServicesData.forEach((service, index) => {
      if (service.parts && service.parts.length) {
        service.parts.forEach((part, idx) => {
          partRef.current.addRowExternally();
          partRef.current.handleDataChange(idx, { "part": part, "partHash": part.partHash, "bin": part.bin, "partCost": +part.partCost, "partPrice": +part.partPrice, "technician": part.technician, "partId": part.partId, "partQty": part.partQty, "discount": { type: part.discount.type, value: part.discount.value }, "partSubtotal": part.partSubtotal }, true);
          handlePartCalculation("qty", part.partQty, index + 1, idx);
          handlePartCalculation("price", part.partPrice, index + 1, idx);
          handlePartCalculation("discount", { type: part.discount.type, value: part.discount.value }, index + 1, idx);
        });
      }
    });
  }


  const handleTireTableMount = () => {
    if (tireTableMountedOnce.current) return;

    if (!prefillServicesData || !prefillServicesData.length) return;
    tireTableMountedOnce.currrent = true;

    prefillServicesData.forEach((service: any, index: any) => {
      if (service.tires && service.tires.length) {
        service.tires.forEach((tire: any, idx: any) => {
          tireRef.current.addRowExternally();
          tireRef.current.handleDataChange(idx, { "tire": tire, 'tirehash': tire.tirehash, "tireCost": tire.tireCost, "tireDisc": tire.tireDisc, "tirePrice": +tire.tirePrice, "tireQty": +tire.tireQty, "tireSubtotal": tire.tireSubtotal, "tireId": tire._id, "discount": { type: tire.discount.type, value: tire.discount.value } }, true);
          handleTireCalculation("qty", tire.tireQty, index + 1, idx);
          handleTireCalculation("price", tire.tirePrice, index + 1, idx);
          handleTireCalculation("discount", { type: tire.discount.type, value: tire.discount.value }, index + 1, idx);
        });
      }
    });
  }


  const handleAddSubContractMount = () => {
    if (subcontractTableMountedOnce.current) return;

    if (!prefillServicesData || !prefillServicesData.length) return;
    subcontractTableMountedOnce.current = true;

    prefillServicesData.forEach((service: any, index: any) => {
      if (service.subcontract && service.subcontract.length) {
        service.subcontract.forEach((contract: any, idx: any) => {
          subcontractRef.current.addRowExternally();
          subcontractRef.current.handleDataChange(idx, { "subcontractName": contract.subcontractName, "vendor": contract.vendor, "cost": contract.cost, "price": contract.price, "discount": { type: contract.discount.type, value: contract.discount.value }, "subTotal": contract.subTotal }, true);
          updateSubcontractSubTotal("price", contract.price, index + 1, idx);
          updateSubcontractSubTotal("discount", { type: contract.discount.type, value: contract.discount.value }, index + 1, idx);
        });
      }
    });
  }


  return (
    <div>
      <div className="w-full h-full mt-5">
        <Card header="Comments & Recommendations">
          <div className="flex">
            <Input value={comment} onChange={(e) => onCommentChange(e.target.value)} className="bg-gray-100 text-black mr-2" placeholder="Enter customer comments..." textArea />
            <Input value={recommendation} onChange={(e) => onRecommendatioChange(e.target.value)} className="bg-gray-100 text-black ml-2" placeholder="Enter recommendations..." textArea />
          </div>
        </Card>

        <Button className="bg-[#f0f1fa] text-indigo-600 mt-4 mb-4 new-service-btn" onClick={handleAddService}>
          New Service
        </Button>

        {services.length > 0 ? (
          <Menu>
            <div>
              {services.map((service, idx) => {
                return (
                  <Card key={idx} className="mb-4">
                    <Menu.MenuCollapseArrowStart expanded={true} labelClass="w-full" label={
                      <div className="flex justify-between align-center w-full">
                        <Input
                          className="text-lg mr-10 h-9 py-0"
                          placeholder="Enter Service Title..."
                          value={service.serviceTitle}
                          onChange={(e) => {
                            handleInputChange(idx, e.target.value, "serviceTitle", idx + 1)
                          }}
                        />
                        <Tag className="text-white bg-indigo-600 border-0">{estimateData.status}</Tag>
                        <Dropdown
                          placement="bottom-end"
                          menuStyle={{ marginTop: "8px" }}
                          renderTitle={dropdownRenderButton}
                        >
                          <Dropdown.Item onClick={() => handleRemoveService(idx)}>Remove</Dropdown.Item>
                        </Dropdown>
                      </div>} >

                      <p className="text-indigo-600 mt-6 mb-5 cursor-pointer" onClick={() => setShowNoteField(true)}>
                        {
                          showNoteField ? <>
                            <Input className="rounded-xl resize-none" placeholder="Add note..." onChange={(e) => handleInputChange(idx, e.target.value, "note", idx + 1)} value={service.note} onBlur={() => !service.note ? setShowNoteField(false) : null} textArea />
                          </> : <>Add Note</>
                        }
                      </p>
                      <TableCommon servicesTableData={servicesTableData} setActiveServiceNo={setActiveServiceNo} onTableMount={handleLaborTableMount} ref={laborRef} className={"mb-4"} serviceNo={idx + 1} tableName={"labors"} updateParentData={handleDataUpdate} columns={columns} initialData={initialData} addRowLabel="Add Labor" />

                      {showPartsTable ? <TableCommon servicesTableData={servicesTableData} setActiveServiceNo={setActiveServiceNo} onTableMount={handlePartTableMount} ref={partRef} className={"mb-4"} serviceNo={idx + 1} tableName={"parts"} updateParentData={handleDataUpdate} columns={partColumns} initialData={initialPartsData} addRowLabel="Add Parts" /> : null}
                      {showTiresTable ? <TableCommon servicesTableData={servicesTableData} setActiveServiceNo={setActiveServiceNo} onTableMount={handleTireTableMount} ref={tireRef} className={"mb-4"} serviceNo={idx + 1} tableName={"tires"} updateParentData={handleDataUpdate} columns={tireColumns} initialData={initialTiresData} addRowLabel="Add Tires" /> : null}
                      {showSubTable ? <TableCommon servicesTableData={servicesTableData} setActiveServiceNo={setActiveServiceNo} onTableMount={handleAddSubContractMount} ref={subcontractRef} className={"mb-4"} serviceNo={idx + 1} tableName={"subcontract"} updateParentData={handleDataUpdate} columns={subcontractColumns} initialData={initialSubcontractData} addRowLabel="Add Subcontract" /> : null}
                      {showDiscountTable ? <TableCommon servicesTableData={servicesTableData} setActiveServiceNo={setActiveServiceNo} ref={serviceDiscountRef} className={"mb-4"} serviceNo={idx + 1} tableName={"discount"} updateParentData={handleDataUpdate} columns={discountColumns} initialData={initialDiscountData} /> : null}

                      <TableCommon servicesTableData={servicesTableData} setActiveServiceNo={setActiveServiceNo} ref={feeRef} className={"mb-4"} serviceNo={idx + 1} tableName={"serviceFee"} updateParentData={handleDataUpdate} columns={feeColumns} initialData={initialFeeData} addRowLabel="Add Service Fee" />
                      <div className="toggle-tables flex justify-between items-center mt-3 -mb-3">
                        <div className="flex justify-start items-center">
                          <p className="mr-3">Add</p>
                          <Button onClick={() => laborRef.current.addRowExternally()} className="text-indigo-600 mr-2 flex items-center" variant="plain"><PiWrenchLight className="mr-1" />Labor</Button>
                          <Button onClick={() => handleAddPart()} className="text-indigo-600 mr-2 flex items-center" variant="plain">
                            {showPartsLoader ? <Spinner className="mr-1" size={20} /> : <CiBoxes className="mr-1" />}
                            Parts
                          </Button>
                          <Button onClick={() => handleAddTire()} className="text-indigo-600 mr-2 flex items-center" variant="plain">
                            {showTiresLoader ? <Spinner className="mr-1" size={20} /> : <GiCarWheel className="mr-1" />}
                            Tires
                          </Button>
                          <Button onClick={() => { showSubTable ? subcontractRef.current.addRowExternally() : setShowSubTable(true) }} className="text-indigo-600 mr-2 flex items-center" variant="plain"><HiOutlineDocumentText className="mr-1" />Sub</Button>
                          <Button disabled={showDiscountTable} onClick={() => { showDiscountTable ? null : setShowDiscountTable(true) }} className={`mr-2 flex items-center ${showDiscountTable ? "text-gray-600" : "text-indigo-600"}`} variant="plain"><GoTag className="mr-1" />Discount</Button>
                          <Button onClick={() => feeRef.current.addRowExternally()} className="text-indigo-600 mr-2 flex items-center" variant="plain"><AiOutlineDollar className="mr-1" />Fee</Button>
                        </div>
                        <div>
                          <p>
                            ${(
                              (
                                ((Object.values(laborSubTotal[idx] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0) +
                                ((Object.values(partSubTotal[idx] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0) +
                                ((Object.values(tireSubTotal[idx] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0) +
                                ((Object.values(subcontractSubTotal[idx] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0) +
                                ((Object.values(feesSubTotal[idx] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0)
                              ) -
                              ((Object.values(overallDiscount[idx] || {}).reduce((sum, value) => sum + (value ? value : 0), 0)) || 0)
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </Menu.MenuCollapseArrowStart>
                  </Card>
                )
              })}
            </div>
          </Menu>
        ) : (
          <div className="bg-white w-full h-[268px] rounded-lg border flex flex-col justify-center align-center text-center">
            <h4 className="text-gray-500">There are no services yet.</h4>
            <p>Add a pre-configured service or start one from scratch.</p>
          </div>
        )}
      </div>
      {addPartModalOpen ? <AddNewPartModal handleButtonClick={() => setAddPartModalOpen(!addPartModalOpen)} /> : null}
      {addFeeModalOpen ? <AddNewFeeModal handleButtonClick={() => setAddFeeModalOpen(!addFeeModalOpen)} /> : null}
      {addTireModalOpen ? <AddNewTireModal handleButtonClick={() => setAddTireModalOpen(!addTireModalOpen)} /> : null}
    </div>
  );
};

export default ServicesTab;
// laborSubTotal + partSubTotal + tireSubTotal + subcontractSubTotal + feesSubTotal
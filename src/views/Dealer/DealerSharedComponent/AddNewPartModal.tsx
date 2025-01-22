import { Button } from '@/components/ui'
import BasicInfo from '../DealerInventory/PartsForm/BasicInfo'
import { Formik, Form } from 'formik'
import PartsImage from '../DealerInventory/PartsForm/PartsImage'
import { cloneDeep } from 'lodash'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { apiNewPart } from '../DealerLists/Services/DealerInventoryServices'
import { useAppDispatch, useAppSelector } from '../Workflow/store'
import AddNewBrandModal from './AddNewBrandModal'
import NewDealerModal from './NewVendorModal'
import AddNewCategoryModal from './AddNewCategoryModal'
import { useCallback, useEffect, useState } from 'react'
import { getParts } from '../DealerInventory/store'
import { validationSchema } from '../DealerInventory/parts/PartsStatistics'

const AddNewPartModal = ({ handleButtonClick }:any) => {

    const initialValues = {
        partName: '',
        note: '',
        partSerialNo: 0,
        partSku: '',
        url: '',
        quantity: 0,
        minQuantity: 0,
        maxQuantity: 0,
        vendor: '',
        bin: '',
        cost: 0,
        retail: 0,
        category: '',
        brand: '',
    }
    const dispatch = useAppDispatch()
    const filterData = useAppSelector((state) => state.inventory.filterData);
    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.dealer.tableData
    );
    const [AddBrandModelOpen, setAddBrandModelOpen] = useState(false)
    const [AddVendorModelOpen, setAddVendorModelOpen] = useState(false)
    const [AddCategoryModelOpen, setAddCategoryModelOpen] = useState(false)

    const [allPartDetail, setallPartDetail] = useState({
        total: 0,
        totalCost: 0,
        totalValue: 0
    })

    const fetchData = useCallback(() => {
        dispatch(getParts({ pageIndex, pageSize, sort, query, filterData }))
    }, [pageIndex, pageSize, sort, query, filterData, dispatch])

    const data = useAppSelector((state) => state.inventory.allParts);
    const { totalCost, totalValue } = data.reduce(
        (acc: any, part: any) => ({
            totalCost: acc.totalCost + (part.cost || 0),
            totalValue: acc.totalValue + (part.retail || 0)
        }),
        { totalCost: 0, totalValue: 0 }
    );
    useEffect(() => {
      setallPartDetail({
          total: data.length,
          totalCost: totalCost,
          totalValue: totalValue
      });
    }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[650px] h-[600px] rounded-lg shadow-lg relative border border-gray-200">
          <div className="flex justify-between items-center p-3 border-b">
              <h3 className="text-base font-semibold">New Part</h3>
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
                  onSubmit={async (values, { resetForm }) => {
                      const formData = cloneDeep(values)
                      try {
                          const response = await apiNewPart(values)
                          fetchData();
                          const data = useAppSelector((state) => state.inventory.allParts);
                          const { totalCost, totalValue } = data.reduce(
                              (acc: any, part: any) => ({
                                  totalCost: acc.totalCost + (part.cost || 0),
                                  totalValue: acc.totalValue + (part.retail || 0)
                              }),
                              { totalCost: 0, totalValue: 0 }
                          );
                          setallPartDetail({
                              total: data.length,
                              totalCost: totalCost,
                              totalValue: totalValue
                          })
                          toast.push(
                              <Notification title="Success" type="success">
                                  New Part Saved Successfully
                              </Notification>,
                          )
                          resetForm()
                      } catch (error: any) {
                          console.error(
                              'Error saving form:',
                              error.message,
                          )
                          toast.push(
                              <Notification title="Error" type="danger">
                                  {error.message ? error.message : "Server Error"}
                              </Notification>,

                          )
                      }
                  }}
              >
                  {({ touched, errors, handleSubmit, setFieldValue }) =>
                  (
                      <Form onSubmit={handleSubmit}>
                          {/* Pass the touched and errors to BasicInfo */}
                          <BasicInfo
                              touched={touched}
                              errors={errors}
                              setFieldValue={setFieldValue}
                              setAddBrandModelOpen={setAddBrandModelOpen}
                              setAddVendorModelOpen={setAddVendorModelOpen}
                              setAddCategoryModelOpen={setAddCategoryModelOpen}
                          />
                          <PartsImage />

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
                                  Save
                              </Button>
                          </div>
                      </Form>
                  )}
              </Formik>
              {AddBrandModelOpen && (
                  <AddNewBrandModal
                      isOpen={AddBrandModelOpen}
                      onClose={() => setAddBrandModelOpen(false)}
                  />
              )}
              {AddVendorModelOpen && (
                  <NewDealerModal
                      isOpen={AddVendorModelOpen}
                      onClose={() => setAddVendorModelOpen(false)}
                  />
              )}
              {AddCategoryModelOpen && (
                  <AddNewCategoryModal
                      isOpen={AddCategoryModelOpen}
                      onClose={() => setAddCategoryModelOpen(false)}
                  />
              )}
          </div>
      </div>
    </div>
  )
}

export default AddNewPartModal

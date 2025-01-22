import { useState, ChangeEvent } from 'react'
import Switcher from '@/components/ui/Switcher'
import Input from '@/components/ui/Input' // Assuming you have an Input component
import { Select } from '@/components/ui'

const FeesInfo = () => {
    const [isTaxExempt, setIsTaxExempt] = useState(false)
    const [hasDiscount, setHasDiscount] = useState(false)
    const [hasLaborRateOverride, setHasLaborRateOverride] = useState(false)
    const [hasLaborMatrixOverride, setHasLaborMatrixOverride] = useState(false)
    const [hasPricingOverride, setHasPricingOverride] = useState(false)

    const onSwitcherToggle = (val: boolean, e: ChangeEvent) => {
    }

    return (
        <div className="space-y-4 mt-6">
            {/* Is customer tax exempt */}
            <div>
                <Switcher
                    defaultChecked={isTaxExempt}
                    onChange={() => setIsTaxExempt(!isTaxExempt)}
                />
                <span className="font-medium text-gray-700 ml-3">Is this customer tax exempt?</span>
                {/* {isTaxExempt && (
                    // <Input
                    //     placeholder="Tax exemption details"
                    //     className="mt-2"
                    // />
                )} */}
            </div>

            {/* Does customer receive a discount */}
            <div>
                <Switcher
                    defaultChecked={hasDiscount}
                    onChange={() => setHasDiscount(!hasDiscount)}
                />
                <span className="font-medium text-gray-700 ml-3">Does this customer receive a discount?</span>
                {hasDiscount && (
                    <Input placeholder="0%" className="bg-slate-50 mt-2 ml-14 w-40" />
                )}
            </div>

            {/* Does customer have a labor rate override */}
            <div>
                <Switcher
                    defaultChecked={hasLaborRateOverride}
                    onChange={() => setHasLaborRateOverride(!hasLaborRateOverride)}
                />
                <span className="font-medium text-gray-700 ml-3">Does this customer have a labor rate override?</span>
                {hasLaborRateOverride && (
                   <Select className="mt-2 ml-14 w-80">
                   <option value="">Select Labor Rate</option>
                   <option value="rate1">Labor Rate 1</option>
                   <option value="rate2">Labor Rate 2</option>
                   <option value="rate3">Labor Rate 3</option>
                   {/* Add more options as needed */}
               </Select>
                )}
            </div>

            {/* Does customer have a labor matrix override */}
            <div>
                <Switcher
                    defaultChecked={hasLaborMatrixOverride}
                    onChange={() => setHasLaborMatrixOverride(!hasLaborMatrixOverride)}
                />
                <span className="font-medium text-gray-700 ml-3">Does this customer have a labor matrix override?</span>
                {hasLaborMatrixOverride && (
                      <Select className="mt-2 ml-14 w-80">
                      <option value="" disabled>Select Labor Rate</option>
                      <option value="rate1">Labor Rate 1</option>
                      <option value="rate2">Labor Rate 2</option>
                      <option value="rate3">Labor Rate 3</option>
                      {/* Add more options as needed */}
                  </Select>
                )}
            </div>

            {/* Does customer have a pricing override */}
            <div>
                <Switcher
                    defaultChecked={hasPricingOverride}
                    onChange={() => setHasPricingOverride(!hasPricingOverride)}
                />
                <span className="font-medium text-gray-700 ml-3">Does this customer have a pricing override?</span>
                {hasPricingOverride && (
                      <Select className="mt-2 ml-14 w-80">
                      <option value="">Select Labor Rate</option>
                      <option value="rate1">Labor Rate 1</option>
                      <option value="rate2">Labor Rate 2</option>
                      <option value="rate3">Labor Rate 3</option>
                      {/* Add more options as needed */}
                  </Select>
                )}
            </div>
        </div>
    )
}

export default FeesInfo

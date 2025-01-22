
import Dropdown from '@/components/ui/Dropdown'
import Button from '@/components/ui/Button'
import { HiOutlineClock, HiOutlinePlus } from 'react-icons/hi'

const AddToggle = () => {
    const Toggle = <HiOutlinePlus className="text-2xl text-gray-600" />

    return (
        <div>
            <Dropdown renderTitle={Toggle}>
                <Dropdown.Item eventKey="a">Item A</Dropdown.Item>
                <Dropdown.Item eventKey="b">Item B</Dropdown.Item>
                <Dropdown.Item eventKey="c">Item C</Dropdown.Item>
                <Dropdown.Item eventKey="d">Item D</Dropdown.Item>
            </Dropdown>
        </div>
    )
}

export default AddToggle


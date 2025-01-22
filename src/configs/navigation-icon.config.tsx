import {
    HiOutlineColorSwatch,
    HiOutlineDesktopComputer,
    HiOutlineTemplate,
    HiOutlineViewGridAdd,
    HiOutlineHome,
    HiOutlineCalendar,
    HiOutlineClock,
    HiOutlineTruck,
    HiOutlineClipboardList,
    HiOutlineViewBoards,
} from 'react-icons/hi'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    home: <HiOutlineHome />,
    singleMenu: <HiOutlineViewGridAdd />,
    collapseMenu: <HiOutlineTemplate />,
    groupSingleMenu: <HiOutlineDesktopComputer />,
    groupCollapseMenu: <HiOutlineColorSwatch />,
    dealerDashboard: <HiOutlineViewBoards />,
    dealerWorkflow: <HiOutlineColorSwatch />,
    dealerCalendar: <HiOutlineCalendar />,
    dealerTimeClocks: <HiOutlineClock />,
    dealerPurchasing: <HiOutlineTruck />,
    dealerLists: <HiOutlineClipboardList />,
}

export default navigationIcon

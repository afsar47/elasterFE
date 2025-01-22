import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import _Menu, { MenuProps } from './Menu'
import MenuItem from './MenuItem'
import MenuCollapse from './MenuCollapse'
import MenuGroup from './MenuGroup'
import MenuCollapseArrowStart from './MenuCollapseArrowStart'

export type { MenuProps } from './Menu'
export type { MenuCollapseProps } from './MenuCollapse'
export type { MenuCollapseArrowStartProps } from './MenuCollapseArrowStart'
export type { MenuGroupProps } from './MenuGroup'
export type { MenuItemProps } from './MenuItem'

type CompoundedComponent = ForwardRefExoticComponent<
    MenuProps & RefAttributes<HTMLElement>
> & {
    MenuItem: typeof MenuItem
    MenuCollapse: typeof MenuCollapse
    MenuCollapseArrowStart: typeof MenuCollapseArrowStart
    MenuGroup: typeof MenuGroup
}

const Menu = _Menu as CompoundedComponent

Menu.MenuItem = MenuItem
Menu.MenuCollapse = MenuCollapse
Menu.MenuCollapseArrowStart = MenuCollapseArrowStart
Menu.MenuGroup = MenuGroup

export { Menu }

export default Menu

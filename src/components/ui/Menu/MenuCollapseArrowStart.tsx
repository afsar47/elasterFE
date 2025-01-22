import { useState, useEffect, useContext } from 'react'
import { useConfig } from '../ConfigProvider'
import { CollapseContextProvider } from './context/collapseContext'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import MenuContext from './context/menuContext'
import { HiChevronDown } from 'react-icons/hi'
import type { CommonProps } from '../@types/common'
import type { ReactNode, MouseEvent } from 'react'

export interface MenuCollapseArrowStartProps extends CommonProps {
    eventKey?: string
    expanded?: boolean
    label?: string | ReactNode
    labelClass?: string
    onToggle?: (expanded: boolean, e: MouseEvent<HTMLDivElement>) => void
}

const MenuCollapseArrowStart = (props: MenuCollapseArrowStartProps) => {
    const {
        children,
        className,
        eventKey,
        expanded = false,
        label = null,
        labelClass,
        onToggle,
    } = props

    const [isExpanded, setIsExpanded] = useState(expanded)

    const { menuItemHeight, variant, sideCollapsed, defaultExpandedKeys } =
        useContext(MenuContext)

    const { direction } = useConfig()

    useEffect(() => {
        if ((defaultExpandedKeys as string[]).includes(eventKey as string)) {
            setIsExpanded(true)
        }
        if (expanded !== isExpanded) {
            setIsExpanded(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [expanded, onToggle, eventKey, defaultExpandedKeys])

    const toggleCollapse = (e: MouseEvent<HTMLDivElement>) => {
        if (typeof onToggle === 'function') {
            onToggle(!isExpanded, e)
        }
        setIsExpanded(!isExpanded)
    }

    const menuCollapseArrowStartItemClass = classNames(
        'menu-collapse-item',
        `menu-collapse-item-${variant}`,
        className
    )

    return (
        <div className="menu-collapse">
            <div
                className={menuCollapseArrowStartItemClass}
                role="presentation"
                onClick={toggleCollapse}
            >
                {!sideCollapsed && (
                    <motion.span
                        className="text-lg mt-1 mr-2"
                        initial={{ transform: 'rotate(0deg)' }}
                        animate={{
                            transform: isExpanded
                                ? 'rotate(-180deg)'
                                : 'rotate(0deg)',
                        }}
                        transition={{ duration: 0.15 }}
                    >
                        <HiChevronDown />
                    </motion.span>
                )}
                <span className={`flex items-center ${labelClass}`}>{label}</span>
            </div>
            <CollapseContextProvider value={isExpanded}>
                <motion.ul
                    className={direction === 'rtl' ? 'mr-5' : 'ml-5'}
                    initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                    animate={{
                        opacity: isExpanded ? 1 : 0,
                        height: isExpanded ? 'auto' : 0,
                    }}
                    transition={{ duration: 0.15 }}
                >
                    {children}
                </motion.ul>
            </CollapseContextProvider>
        </div>
    )
}

MenuCollapseArrowStart.displayName = 'menuCollapseArrowStartArrowStart'

export default MenuCollapseArrowStart

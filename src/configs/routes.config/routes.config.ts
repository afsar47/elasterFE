import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]


export const protectedRoutes = [
    {
        key: 'superAdminBase',
        path: '/super-admin',
        authority: ['superAdmin'],
        meta: {
            title: 'Super Admin Home'
        },
    },
    {
        key: 'superAdminHome',
        path: '/super-admin/home', // Final route will be /super-admin/home
        component: lazy(() => import('@/views/SuperAdmin/SuperAdminHome')),
        meta: { title: 'Super Admin Home' },
        authority: ['superAdmin'],
    },
    {
        key: 'collapseMenu.item1',
        path: '/super-admin/create-dealer', // Final route will be /super-admin/create-dealer
        component: lazy(() => import('@/views/demo/CollapseMenuItemView1')),
        meta: { title: 'Super Admin Create Dealer' },
        authority: ['superAdmin'],
    },
    {
        key: 'superAdminAllDealers',
        path: '/super-admin/all-dealers', // Final route will be /super-admin/create-dealer
        component: lazy(() => import('@/views/demo/CollapseMenuItemView1')),
        meta: { title: 'Super Admin Get All Dealers' },
        authority: ['superAdmin'],
    },
    // Add more superAdmin-specific routes here


    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },
    /** Example purpose only, please remove */
    {
        key: 'singleMenuItem',
        path: '/super-admin/single-menu-view',
        component: lazy(() => import('@/views/demo/SingleMenuView')),
        authority: ['superAdmin'],
    },
    // {
    //     key: 'collapseMenu.item1',
    //     path: '/create-dealer',
    //     component: lazy(() => import('@/views/demo/CollapseMenuItemView1')),
    //     authority: ['superAdmin'],
    // },
    {
        key: 'collapseMenu.item2',
        path: '/view-all-dealers',
        component: lazy(() => import('@/views/demo/CollapseMenuItemView2')),
        authority: ['superAdmin'],
    },
    {
        key: 'groupMenu.single',
        path: '/group-single-menu-item-view',
        component: lazy(() =>
            import('@/views/demo/GroupSingleMenuItemView')
        ),
        authority: ['superAdmin'],
    },
    {
        key: 'groupMenu.collapse.item1',
        path: '/group-create-dealer',
        component: lazy(() =>
            import('@/views/demo/GroupCollapseMenuItemView1')
        ),
        authority: ['superAdmin'],
    },
    {
        key: 'groupMenu.collapse.item2',
        path: '/group-view-all-dealers',
        component: lazy(() =>
            import('@/views/demo/GroupCollapseMenuItemView2')
        ),
        authority: ['dealer'],
    },
    {
        key: 'superAdminHome',
        path: '/super-admin/home',
        component: lazy(() => import('@/views/Home')),
        authority: ['superAdmin'],
    },

    // Dealer Routes
    {
        key: 'dealerDashboard',
        path: '/dealer/dashboard',
        component: lazy(() => import('@/views/Dealer/DealerDashboard')),
        authority: ['dealer'],
    },
    {
        key: 'dealerWorkflow',
        path: '/dealer/workflow',
        component: lazy(() => import('@/views/Dealer/Workflow/Workflow')),
        authority: ['dealer'],
    },
    {
        key: 'newEstimate',
        path: '/dealer/workflow/order/:id',
        component: lazy(() => import('@/views/Dealer/Workflow/NewEstimate/NewEstimate')),
        authority: ['dealer'],
    }, {
        key: 'dealerCalendar',
        path: '/dealer/calendar',
        component: lazy(() => import('@/views/Dealer/DealerCalendar')),
        authority: ['dealer'],
    }, {
        key: 'dealerTimeClocks',
        path: '/dealer/time-clocks',
        component: lazy(() => import('@/views/Dealer/DealerTimeClocks')),
        authority: ['dealer'],
    },
    {
        key: 'dealerInventory.item1',
        path: '/dealer/inventory/parts',
        component: lazy(() => import('@/views/Dealer/DealerInventory/parts/Parts')),
        authority: ['dealer'],
    },
    {
        key: 'dealerInventory.item2',
        path: '/dealer/inventory/tires',
        component: lazy(() => import('@/views/Dealer/DealerInventory/Tires/Tires')),
        authority: ['dealer'],
    },
    {
        key: 'dealerInventory.item3',
        path: '/dealer/lists/labor',
        component: lazy(() => import('@/views/Dealer/DealerLists/Item1')), // Ensure this is the component for Lists > Labor
        authority: ['dealer'],
        redirect: '/dealer/lists/labor'  // Redirect path to match Lists > Labor
    },
    {
        key: 'dealerInventory.item4',
        path: '/dealer/lists/fees',
        component: lazy(() => import('@/views/Dealer/DealerLists/Fees/Fees')), // Ensure this is the component for Lists > Labor
        authority: ['dealer'],
        redirect: '/dealer/lists/fees'  // Redirect path to match Lists > Labor
    },
    {
        key: 'dealerInventory.item5',
        path: '/dealer/lists/vendors',
        component: lazy(() => import('@/views/Dealer/DealerLists/Dealers/Vendors')), // Ensure this is the component for Lists > Labor
        authority: ['dealer'],
        redirect: '/dealer/lists/vendors'  // Redirect path to match Lists > Labor
    },
    {
        key: 'dealerInventory.item6',
        path: '/dealer/lists/categories',
        component: lazy(() => import('@/views/Dealer/DealerInventory/Categories/Categories')),
        authority: ['dealer'],
        redirect: '/dealer/lists/categories'  // Redirect path to match Lists > Labor
    },
    {
        key: 'dealerPurchasing.item1',
        path: '/dealer/purchasing/purchase-orders',
        component: lazy(() => import('@/views/Dealer/Purchasing/PurchaseOrder/PurchaseOrder')),
        authority: ['dealer'],
    },
    {
        key: 'dealerPurchasing.item2',
        path: '/dealer/purchasing/returns',
        component: lazy(() => import('@/views/Dealer/Purchasing/Returns/Returns')),
        authority: ['dealer'],
    },
    {
        key: 'dealerPurchasing.item3',
        path: '/dealer/lists/vendors',
        component: lazy(() => import('@/views/Dealer/DealerLists/Dealers/Vendors')),
        authority: ['dealer'],
    },

    // ... Lists
    {
        key: 'dealerLists.item1',
        path: '/dealer/lists/customers',
        component: lazy(() => import('@/views/Dealer/DealerLists/Customers/Customers')),
        authority: ['dealer'],
    }, {
        key: 'dealerLists.item2',
        path: '/dealer/lists/fleets',
        component: lazy(() => import('@/views/Dealer/DealerLists/Fleets/Fleets')),
        authority: ['dealer'],
    }, {
        key: 'dealerLists.item3',
        path: '/dealer/lists/vehicles',
        component: lazy(() => import('@/views/Dealer/DealerLists/Vehicles/Vehicles')),
        authority: ['dealer'],
    }, {
        key: 'dealerLists.item4',
        path: '/dealer/lists/vendors',
        component: lazy(() => import('@/views/Dealer/DealerLists/Dealers/Vendors')),
        authority: ['dealer'],
    },  {
        key: 'dealerLists.item5',
        path: '/dealer/lists/inspection-templates',
        component: lazy(() => import('@/views/Dealer/DealerLists/Item1')),
        authority: ['dealer'],
    }, {
        key: 'dealerLists.item6',
        path: '/dealer/lists/canned-services',
        component: lazy(() => import('@/views/Dealer/DealerLists/Item1')),
        authority: ['dealer'],
    }, {
        key: 'dealerLists.item7',
        path: '/dealer/lists/categories',
        component: lazy(() => import('@/views/Dealer/DealerLists/Item1')),
        authority: ['dealer'],
    }, {
        key: 'dealerLists.item8',
        path: '/dealer/lists/labor',
        component: lazy(() => import('@/views/Dealer/DealerLists/Item1')),
        authority: ['dealer'],
    }, {
        key: 'dealerLists.item9',
        path: '/dealer/lists/fees',
        component: lazy(() => import('@/views/Dealer/DealerLists/Item1')),
        authority: ['dealer'],
    },
    // ... other routes

]
export type AppConfig = {
    apiPrefix: string
    authenticatedEntryPath: string
    unAuthenticatedEntryPath: string
    tourPath: string
    locale: string
    enableMock: boolean
    superAdminEntryPath: string
    dealerEntryPath: string
}

const appConfig: AppConfig = {
    apiPrefix: '/elstar-local',
    authenticatedEntryPath: '/',
    unAuthenticatedEntryPath: '/sign-in',
    tourPath: '/',
    locale: 'en',
    enableMock: false,
    superAdminEntryPath: '/super-admin/home',
    dealerEntryPath: '/dealer/home',
}

export default appConfig

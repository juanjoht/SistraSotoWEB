export const Constants = {
    apiLogin: '/auth/login',
    apiCustomer: '/cliente',
    apiParamStaticDept: '/parametroEstatico/departamentos',
    apiParamStaticCitiesByDept: '/parametroEstatico/municipiosPorDepartamento',
    apiParamsByType: '/parametro/tipo',
    apiCustomerCommercialInfo: '/informacionComercial',
    apiCustomerBuilding: '/obra/cliente',
    apiBuilding: '/obra',
    apiTransportersByClient:'/transportador/cliente',
    apiShippingRateByClient: '/tarifaFlete/cliente',
    apiShippingRateByTransporter: '/tarifaFlete/transportador',
    apiRoutesByTransporter: '/ruta/Transportador',
    apiDocsByTransporter: '/documento/documentosTransportador',
    apiVehiclesByTransporter: '/vehiculo/transportador',
    apiDriversByTransporter: '/conductor/Transportador',
    apiRateShipping: '/tarifaFlete',
    apiCustomerRateShipping: '/tarifaFlete/cliente',
    apiTransporterRateShipping: '/tarifaFlete/transportador',
    apiTransporter: '/transportador',
    apiLinkClientTransporter:'/cliente/linkClienteTransportador',
    apiTransporterRoute: '/ruta/transportador',
    apiRoute: '/ruta',
    apiVehicle: '/vehiculo',
    apiLinkTransporterVehicle:'/vehiculo/transportador',
    apiLinkTransporterDriver:'/conductor/linkConductorTransportador',
    apiDriver: '/conductor',
    apiDriverGeneralInfo: '/conductor/infoGeneral',
    apiTransporterDocument: '/documento/documentoTransportador',
    apiDriverDocument: '/documento/documentoConductor',
    apiDocsByDriver: '/documento/documentosConductor',
    apiDriverIsRelated: '/conductor/esRelacionado',
    apiDeleteTransporterDriver: '/conductor/eliminarConductorTransportador',
    apiThirdParty: '/tercero/numeroDocumento',
    apiAllThirdParties: '/tercero',
    apiThirdPartyPersonalInfo: '/tercero/infoPersonal',
    apiUploadTransporterDoc: '/upload/transportador/documento',
    apiUploadDriverDoc: '/upload/Conductor/documento',
    apiUploadDriverImage: '/upload/Conductor/imagen',
    apiAuthRegister: '/auth/registro',
    apiAuthUsers: '/auth/usuario',
    apiAuthResetPassword: '/auth/cambiarContrasena',
    apiAuthProfiles: '/auth/perfil',
    apiAuthProfileModule: '/modulo/perfil',
    apiAuthProfileModulePut: '/modulo/perfilModulo',
    apiDownloadDoc: '/download/documento',
    pathHome: 'home',
    undefinedCallBack: 'Metodo no definido.',
    undefinedErrorCallBack: 'Metodo error no definido.',
    dataSuccess: 'Se obtuvieron los datos con éxito',
    pathLogin: 'login',
    tbUsername: 'Usuario',
    tbPassword: 'Contraseña',
    expiredMsg : 'El tiempo de sesión ha expirado',
    nameLocationId: 'locationId',
    msgWelcome : 'Bienvenido ',
    msgEventSave : 'Evento almacenado con éxito',
    msgEventUpdate : 'Evento actualizado con éxito',
    msgEventDelete : 'Evento eliminado con éxito',
    msgPublicationSave : 'Publicación almacenada con éxito',
    msgPublicationUpdate : 'Publicación actualizado con éxito',
    msgPublicationDelete : 'Publicación eliminada con éxito',
    msgMarketSave : 'Producto almacenada con éxito',
    msgMarketUpdate : 'Producto actualizado con éxito',
    msgMarketDelete : 'Producto eliminado con éxito',
    msgUserSave : 'Usuario almacenado con éxito',
    msgUserUpdate : 'Usuario actualizado con éxito',
    msgUserDelete : 'Usuario eliminado con éxito',
    msgBookingSave : 'Reservación almacenada con éxito',
    msgBookingUpdate : 'Reservación actualizada con éxito',
    msgBookingDelete : 'Reservación eliminada con éxito',
    msgPQRSUpdate : 'PQRS actualizada con éxito',
    msgStaffSave : 'Persona almacenada con éxito',
    msgStaffUpdate : 'Persona actualizada con éxito',
    msgStaffDelete : 'Persona eliminada con éxito',
    msgFilesUpdate : 'Archivos actualizados con éxito',
    userNameField: 'userName',
    questionField: 'question',
    empty: '',
    numRowMax: 2147483647
};

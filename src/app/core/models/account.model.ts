export interface AccountRequest {
    // se coloca los mismos
    // REQUEST
    // que en el backend para mayor fluidez
    // los tipos de variable cambian
    // String = string
    // Long = number
    // Bool = boolean
    // Date = Date
    id:number;
    customerName:string;
    // esto es un ejemplo
}

export interface AccountResponse {
    // Aca se coloca el DTO RESPONSE
    // Cada campo se agrega
}
export type Address = {
    street: string
    suite?: string
    city: string
    zipcode: string
  }
  
  export type Company = {
    name: string
    catchPhrase?: string
    bs?: string
  }
  
  export type User = {
    id: number
    name: string
    email: string
    phone: string
    company: Company
    address?: Address
    username?: string
    website?: string
  }
  
declare interface ClientConfig {
  secret: string
  domain: string
  port: number
  scheme: 'http' | 'https' | undefined
}

declare type PhonebookEntryData = {
  ref: {
    value: {
      id: string
    }
  }
  data: {
    firstName: string
    lastName?: string
    number: string
  }
  ts: number
}

declare type FindPhonebookResponse = {
  data: PhonebookEntryData[]
}

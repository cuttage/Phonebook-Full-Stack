declare interface ClientConfig {
  secret: string
  domain: string
  port: number
  scheme: 'http' | 'https' | undefined
}

declare type EntryData = {
  firstName: string
  lastName?: string
  number: string
}

declare interface FormValues extends EntryData {
  [key: string]: string
}

declare type PhonebookEntryData = {
  ref: {
    value: {
      id: string
    }
  }
  data: EntryData
  ts: number
}

declare type FindPhonebookResponse = {
  data: PhonebookEntryData[]
}

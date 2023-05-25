import { Expr, Client } from 'faunadb'

const secret = process.env.REACT_APP_FAUNA_SECRET as string
const port = parseInt(process.env.REACT_APP_FAUNA_PORT as string, 10)
const scheme = process.env.REACT_APP_FAUNA_SCHEME as
  | 'http'
  | 'https'
  | undefined
const domain = process.env.REACT_APP_FAUNA_DOMAIN as string

export class CustomClient {
  private client: Client

  constructor(config: ClientConfig) {
    this.client = new Client({
      secret: config.secret,
      domain: config.domain,
      port: config.port,
      scheme: config.scheme,
    })
  }

  async query<T>(
    query: Expr,
    variables?: { [key: string]: unknown }
  ): Promise<{ data: T }> {
    const response = await this.client.query<T>(query, variables)
    return { data: response }
  }
}

const clientConfig: ClientConfig = {
  secret: secret,
  domain: domain,
  port: port,
  scheme: scheme,
}

const client = new CustomClient(clientConfig)

export default client

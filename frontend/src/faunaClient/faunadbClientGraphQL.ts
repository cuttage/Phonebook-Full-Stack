/* I won't use this in this project
but it is useful to see how to set up
a GraphQL FaunaDB Client */

import { GraphQLClient, Variables } from 'graphql-request'

const secret = process.env.REACT_APP_FAUNA_SECRET as string
const scheme = process.env.REACT_APP_FAUNA_SCHEME as
  | 'http'
  | 'https'
  | undefined
const domain = process.env.REACT_APP_FAUNA_DOMAIN as string

export class CustomClient {
  private client: GraphQLClient

  constructor(config: ClientConfig) {
    this.client = new GraphQLClient(
      `${config.scheme}://${config.domain}:${config.port}/graphql`,
      {
        headers: {
          Authorization: `Bearer ${config.secret}`,
        },
      }
    )
  }

  async query<T>(query: string, variables?: Variables): Promise<{ data: T }> {
    const response = await this.client.request<T>(query, variables)
    return { data: response }
  }
}

const clientConfig: ClientConfig = {
  secret: secret,
  domain: domain,
  port: 8084,
  scheme: scheme,
}

const client = new CustomClient(clientConfig)

export default client

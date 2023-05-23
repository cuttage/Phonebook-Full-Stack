# Phonebook-Full-Stack

Vite, React, FaunaDB, GraphQL Full Stack Phonebook App

## Backend Setup

1. Run the Docker daemon

2. In a terminal window, run:

```bash
docker run -p 8084:8084 -p 8443:8443 fauna/faunadb
```

3. In another terminal window, run:

```bash
npm i -g fauna-shell
```

```bash
fauna create-database test --secret=secret --domain=127.0.0.1 --port=8443 --scheme=http
```

```bash
fauna create-key test --secret=secret --domain=127.0.0.1 --port=8443 --scheme=http
```

```bash
fauna create-key test --secret=secret --domain=127.0.0.1 --port=8443 --scheme=http
```

The above will generate the response:

```bash
creating key for database 'test' with role 'admin'

  created key for database 'test' with role 'admin'.
  secret: <generated-secret>

  To access 'test' with this key, create a client using
  the driver library for your language of choice using
  the above secret.
```

4. Create a schema.gql file with the following content:

```typescript
type Phonebook {
  entries: [PhonebookEntry!]! @relation
}
type PhonebookEntry {
  firstName: String!
  lastName: String
  number: String!
  phonebook: Phonebook!
}
```

5. In the same window where you ran the previous commands, run the following by resplacing `<generated-secret>` with the actual value:

```bash
curl -u <generated-secret>: http://localhost:8084/import --data-binary "@schema.gql"
```

The response will be:

```bash
Schema imported successfully.
Use the following HTTP header to connect to the FaunaDB GraphQL API:
{ "Authorization": "Bearer <generated-secret>" }
```

6. Now in the same terminal window you can start a shell with your new FaunaDB database:

```bash
fauna shell test --secret=secret --domain=127.0.0.1 --port=8443 --scheme=http
```

7. Show available collections by running:

```bash
Paginate(Collections())
```

Response should be:

```bash
{ data: [ Collection("PhonebookEntry"), Collection("Phonebook") ] }
```

8. Write a document by running:

```bash
Create(
...   Collection('Phonebook'),
...   {
.....     data: {
.......       firstName: 'Test Name',
.......       number: 'Test Number',
.......     },
.....   },
... )
```

Response is:

```bash
{
  ref: <your-ref>,
  ts: <timestamp>,
  data: { firstName: 'Test Name', number: 'Test Number' }
}
```

9. Get collection by running:

```bash
Get(Collection('Phonebook'))
```

10. Get created document by running:

```bash
Get(<your-ref>)
```

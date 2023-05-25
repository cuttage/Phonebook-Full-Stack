# Phonebook-Full-Stack

TypeScript, Vite, React, Docker, FaunaDB (with the possibility to use GraphQL), MaterialUI, TanStack Query Full Stack Phonebook App

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

The above will generate the response:

```
creating key for database 'test' with role 'admin'

  created key for database 'test' with role 'admin'.
  secret: <generated-secret>

  To access 'test' with this key, create a client using
  the driver library for your language of choice using
  the above secret.
```

4. Create a schema.gql file with the following content. This will be used by the Fauna GraphQL API exposed at port 8084 and not by the Fauna Http API exposed at port 8443. Please note that data are not in sync between the two (in the project I will work with the Http API):

```
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

```
Schema imported successfully.
Use the following HTTP header to connect to the FaunaDB GraphQL API:
{ "Authorization": "Bearer <generated-secret>" }
```

6. Now in the same terminal window you can start a shell with your new FaunaDB database:

```bash
fauna shell test --secret=secret --domain=127.0.0.1 --port=8443 --scheme=http
```

7. Show available collections by running:

```
Paginate(Collections())
```

Response should be:

```
{ data: [ Collection("PhonebookEntry"), Collection("Phonebook") ] }
```

8. Write a document by running:

```
Create(Collection('PhonebookEntry'), {
   data: {
     firstName: 'Test Name',
     lastName: 'Test Last Name',
     number: 'Test Number',
   },
})
```

Response is:

```
{
  ref: <your-ref>,
  ts: <timestamp>,
  data: {
    firstName: 'Test Name',
    lastName: 'Test Last Name',
    number: 'Test Number'
  }
}
```

9. Get collection by running:

```
Get(Collection('PhonebookEntry'))
```

10. Get created document by running:

```
Get(<your-ref>)
```

Note: `<your-ref>` looks something like this:

```
Ref(Collection("PhonebookEntry"), <id>)
```

## Frontend Setup

1. Create a `.env` file in the root of your project with the following values:

```
REACT_APP_FAUNA_SECRET=<generated-secret>
REACT_APP_FAUNA_PORT=8443
REACT_APP_FAUNA_SCHEME=http
REACT_APP_FAUNA_DOMAIN=127.0.0.1
REACT_APP_FAUNA_COLLECTION=PhonebookEntry
REACT_APP_FAUNA_DOCUMENT_ID_TEST=<id>
```

Remember to change `<generated-secret>` and `<id>` as needed.

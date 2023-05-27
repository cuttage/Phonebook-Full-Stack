# Phonebook Full Stack App

This is the documentation for the Phonebook Full Stack application. The application is built using TypeScript, Vite, React, Docker, FaunaDB (with the option to use GraphQL), MaterialUI, and TanStack Query.

## Backend Setup

1. Make sure the Docker daemon is running on your machine.

2. Open a terminal window and run the following command to start the FaunaDB container:

```bash
docker run -p 8084:8084 -p 8443:8443 fauna/faunadb
```

3. Open another terminal window and install the `fauna-shell` package globally by running the following command:

```bash
npm i -g fauna-shell
```

4. Create a FaunaDB database and set up a key for connecting to the database by running the following commands:

```bash
fauna create-database test --secret=secret --domain=127.0.0.1 --port=8443 --scheme=http
```

```bash
fauna create-key test --secret=secret --domain=127.0.0.1 --port=8443 --scheme=http
```

These commands will create a database named "test" and generate a connection key.

```
creating key for database 'test' with role 'admin'

  created key for database 'test' with role 'admin'.
  secret: <generated-secret>

  To access 'test' with this key, create a client using
  the driver library for your language of choice using
  the above secret.
```

5. Create a `schema.gql` file with the following content. This will be used by the Fauna GraphQL API exposed at port `8084` and not by the Fauna Query Language API exposed at port `8443`. Please note that by default data are not in sync between the two (in the project I will work with the Fauna Query Language API):

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

6. Import the `schema.gql` file into FaunaDB by running the following command by replacing `<generated-secret>` with the actual connection key generated in step 4:

```bash
curl -u <generated-secret>: http://localhost:8084/import --data-binary "@schema.gql"
```

This command will import the GraphQL schema into FaunaDB and make it available for the application.

```
Schema imported successfully.
Use the following HTTP header to connect to the FaunaDB GraphQL API:
{ "Authorization": "Bearer <generated-secret>" }
```

7. Now you can start a FaunaDB shell for your new database by running the following command:

```bash
fauna shell test --secret=secret --domain=127.0.0.1 --port=8443 --scheme=http
```

This will open a shell where you can interact with your FaunaDB database.

8. Show available collections by running:

```
Paginate(Collections())
```

Response should be:

```
{ data: [ Collection("PhonebookEntry"), Collection("Phonebook") ] }
```

9. Write a document by running:

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

10. Get collection by running:

```
Get(Collection('PhonebookEntry'))
```

11. Get created document by running:

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

Remember to change `<generated-secret>` and `<id>` as needed. These variables will be used to configure the connection to FaunaDB in the frontend.

2. Start your frontend development server and run the Phonebook Full Stack application. Make sure you are in the `frontend` directory and run:

```bash
npm i
```

```bash
npm run dev
```

### Usage

The Phonebook Full Stack application allows users to manage phonebook entries through a user interface.

#### Main View

The main view of the application displays a list of phonebook entries. Users can perform various actions from this view, such as sorting the list, searching for entries, and adding new entries.

##### Sorting

To sort the list of phonebook entries, click on the "Sort by First Name" or "Sort by Last Name" buttons.

##### Searching

To search for specific entries, enter a search query in the search input field at the top of the page. The list will automatically update to display only the entries that match the search query.

##### Adding a New Entry

To add a new phonebook entry, click on the "Add" button. This will open a form where you can enter the details of the new entry, including the first name, last name, and phone number. Once you have entered the information, click the "Create" button to add the entry to the phonebook.

#### Detail View

The detail view can be accessed by clicking on the list item we want to visualize in detail. From here, you can update or delete the entry if you want.

##### Editing an Entry

Click on the edit pencil button. This will open a form pre-filled with the entry's details. Make any necessary changes and click the "Update" button to update the entry.

##### Deleting an Entry

Click on the bin button. Click "Delete" to delete the entry permanently.

## Testing

The Phonebook Full Stack application includes tests to ensure the functionality of the backend database operations. These tests are written using Jest. To run the tests, follow these steps:

1. Open a terminal window.

2. Navigate to the root directory of the project (make sure you are in the `frontend` directory).

3. Run the following command to install the required dependencies:

```bash
npm i
```

4. Run the following command to execute the tests:

```bash
npm run test
```

The tests will run and provide feedback on the success or failure of each test case. The tests cover the creation, retrieval, update, and deletion of documents in the PhonebookEntry collection using FaunaDB queries. The tests are located in the `__tests__` directory.

## Logging

The Phonebook Full Stack application incorporates logging capabilities to track important events and provide useful information for debugging purposes. The application uses the Loglevel library for logging.

Logging is configured based on the environment in which the application is running. In production mode, the logging level is set to ERROR, which means only errors will be logged. In other environments, such as development or testing, the logging level is set to INFO, which logs both errors and informational messages. By default, logging output is displayed in the browser's console.

## Available Scripts

Please note that you need to have the FaunaDB container running and the required environment variables set up to run the application and tests successfully.

In the project directory (`frontend`), you can run the following scripts:

1. `npm run dev`

Runs the app in development mode.

2. `npm run build`

Builds the app for production to the `dist` folder.
It bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed.

2. `npm run lint`

Lints the source code using ESLint.

3. `npm run preview`

Builds and serves the app from the `dist` folder for previewing the production build.

4. `npm run test`

Runs the tests using Jest.

## Browser and Node Versions

The Phonebook Full Stack application was developed and tested using the following versions:

### Browser Version

The application was tested and visualized using Google Chrome `Version 112.0.5615.137 (Official Build) (x86_64)`. It is recommended to use a modern web browser that supports ECMAScript 6 (ES6) and the latest web standards for optimal performance and compatibility.

### Node Version

The application was developed and tested using Node.js version `v16.14.2`. It is recommended to have Node.js installed on your machine with a compatible version to ensure the proper functioning of the application.

Please make sure your browser and Node.js versions are compatible with the ones mentioned above to ensure a smooth experience when running and visualizing the Phonebook Full Stack application.

import { query as q } from 'faunadb'
import client from '../faunaClient/faunadbClientFauna'

const collection = process.env.REACT_APP_FAUNA_COLLECTION!
let documentId: string

describe('Database Tests', () => {
  test('Create a document in PhonebookEntry collection', async () => {
    const newData = {
      firstName: 'Fake First Name',
      lastName: 'Fake Last Name',
      number: '123456789',
    }

    try {
      const createdDocument = await client.query<PhonebookEntryData>(
        q.Create(q.Collection(collection), { data: newData })
      )

      expect(createdDocument).toBeDefined()
      expect(createdDocument.data.ref).toBeDefined()
      expect(createdDocument.data.ref.value.id).toBeDefined()

      documentId = createdDocument.data.ref.value.id
    } catch (error) {
      console.error('Failed to create document:', error)
      throw error
    }
  })

  test('Read a document from PhonebookEntry collection', async () => {
    try {
      const retrievedDocument = await client.query<PhonebookEntryData>(
        q.Get(q.Ref(q.Collection(collection), documentId))
      )

      expect(retrievedDocument).toBeDefined()
      expect(retrievedDocument.data.ref).toBeDefined()
      expect(retrievedDocument.data).toBeDefined()
    } catch (error) {
      console.error('Failed to retrieve document:', error)
      throw error
    }
  })

  test('Update a document in PhonebookEntry collection', async () => {
    const updatedData = {
      firstName: 'Updated First Name',
      lastName: 'Updated Last Name',
      number: '987654321',
    }

    try {
      const updatedDocument = await client.query<PhonebookEntryData>(
        q.Update(q.Ref(q.Collection(collection), documentId), {
          data: updatedData,
        })
      )

      expect(updatedDocument).toBeDefined()
      expect(updatedDocument.data.ref).toBeDefined()
      expect(updatedDocument.data.data.firstName).toEqual(updatedData.firstName)
      expect(updatedDocument.data.data.lastName).toEqual(updatedData.lastName)
      expect(updatedDocument.data.data.number).toEqual(updatedData.number)
    } catch (error) {
      console.error('Failed to update document:', error)
      throw error
    }
  })

  test('Delete a document from PhonebookEntry collection', async () => {
    try {
      await client.query(q.Delete(q.Ref(q.Collection(collection), documentId)))

      const documentExists = await client.query<boolean>(
        q.Exists(q.Ref(q.Collection(collection), documentId))
      )

      expect(documentExists.data).toBe(false)
    } catch (error) {
      console.error('Failed to delete document:', error)
      throw error
    }
  })
})

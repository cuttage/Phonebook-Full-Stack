import './App.css'
import PhonebookComponent from './components/PhonebookComponent'
import PhonebookEntryComponent from './components/PhonebookEntryComponent'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<PhonebookComponent />} />
          <Route path="/entry/:id" element={<PhonebookEntryComponent />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { useState } from 'react';
import client from './lib/apolloClient';
import NavBar from './components/NavBar';
import TopBar from './components/TopBar';
import HomePage from './pages/HomePage';
import BookPage from './pages/BookPage';
import LoginPage from './pages/LoginPage';
import MyCheckoutsPage from './pages/MyCheckoutsPage';
import AdminPage from './pages/AdminPage';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <div className="flex">
            <NavBar />
            <div className="flex-1 ml-64 flex flex-col">
              <TopBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
              <main className="flex-1 p-6 pt-24">
                <div className="max-w-7xl mx-auto">
                  <Routes>
                    <Route path="/" element={<HomePage searchTerm={searchTerm} />} />
                    <Route path="/book/:id" element={<BookPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/my-checkouts" element={<MyCheckoutsPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                  </Routes>
                </div>
              </main>
            </div>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;

import { useParams } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useState } from 'react';

const BOOK_QUERY = gql`
  query Book($id: ID!) {
    book(id: $id) {
      id
      title
      author
      isbn
      description
      genre
      coverImage
      editions {
        id
        format
        publisher
        year
        totalCopies
        availableCopies
      }
    }
  }
`;

const ME_QUERY = gql`
  query Me {
    me {
      id
    }
  }
`;

const MY_CHECKOUTS_QUERY = gql`
  query MyCheckouts {
    myCheckouts {
      id
    }
  }
`;

const CHECKOUT_MUTATION = gql`
  mutation CheckoutEdition($editionId: ID!) {
    checkoutEdition(editionId: $editionId) {
      id
      dueDate
      checkoutDate
      status
      edition {
        id
        availableCopies
      }
    }
  }
`;

function BookPage() {
  const { id } = useParams();
  const [checkoutError, setCheckoutError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { loading, error, data } = useQuery(BOOK_QUERY, {
    variables: { id },
  });

  const { data: userData } = useQuery(ME_QUERY, {
    errorPolicy: 'ignore',
  });

  const [checkoutEdition, { loading: checkoutLoading }] = useMutation(CHECKOUT_MUTATION, {
    refetchQueries: [
      { query: BOOK_QUERY, variables: { id } },
      { query: MY_CHECKOUTS_QUERY }
    ],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      const dueDateString = data.checkoutEdition.dueDate;
      let dueDate = 'Invalid Date';
      
      try {
        // Parse the date - it could be ISO string or timestamp
        const parsedDate = new Date(dueDateString);
        if (!isNaN(parsedDate.getTime())) {
          dueDate = parsedDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          });
        }
      } catch (e) {
        console.error('Error parsing date:', e);
      }
      
      setSuccessMessage(`Book checked out! Due date: ${dueDate}`);
      setCheckoutError('');
      setTimeout(() => setSuccessMessage(''), 5000);
    },
    onError: (error) => {
      setCheckoutError(error.message);
      setSuccessMessage('');
    },
  });

  if (loading) return <div className="text-center text-xl">Loading book details...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  const book = data?.book;
  const isLoggedIn = !!userData?.me;

  if (!book) return <div className="text-center">Book not found</div>;

  const handleCheckout = (editionId) => {
    if (!isLoggedIn) {
      setCheckoutError('Please login to checkout books');
      return;
    }
    checkoutEdition({ variables: { editionId } });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid md:grid-cols-[200px_1fr] gap-8">
          <div className="flex justify-center md:justify-start">
            {book.coverImage && (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-48 h-64 object-cover rounded-lg shadow-md"
              />
            )}
          </div>
          
          <div>
            <h1 className="text-4xl font-bold mb-4 text-gray-800">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
            
            {book.genre && (
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full mb-4">
                {book.genre}
              </span>
            )}
            
            {book.isbn && (
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">ISBN:</span> {book.isbn}
              </p>
            )}
            
            {book.description && (
              <p className="text-gray-700 mb-6">{book.description}</p>
            )}
          </div>
        </div>

        {/* Editions */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Available Editions</h2>
          
          {checkoutError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {checkoutError}
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}

          <div className="grid gap-4">
            {book.editions.map(edition => (
              <div
                key={edition.id}
                className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-lg text-gray-800">{edition.format}</p>
                  {edition.publisher && (
                    <p className="text-gray-600">Publisher: {edition.publisher}</p>
                  )}
                  {edition.year && (
                    <p className="text-gray-600">Year: {edition.year}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    {edition.availableCopies} of {edition.totalCopies} copies available
                  </p>
                </div>
                
                <button
                  onClick={() => handleCheckout(edition.id)}
                  disabled={edition.availableCopies === 0 || checkoutLoading}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    edition.availableCopies > 0 && !checkoutLoading
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {checkoutLoading ? 'Checking out...' : 'Checkout'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookPage;

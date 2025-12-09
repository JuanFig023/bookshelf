import { useQuery, useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const MY_CHECKOUTS_QUERY = gql`
  query MyCheckouts {
    myCheckouts {
      id
      dueDate
      returnDate
      status
      renewCount
      edition {
        id
        format
        book {
          id
          title
          author
          coverImage
        }
      }
    }
  }
`;

const RETURN_MUTATION = gql`
  mutation ReturnCheckout($checkoutId: ID!) {
    returnCheckout(checkoutId: $checkoutId) {
      id
      returnDate
      status
    }
  }
`;

const RENEW_MUTATION = gql`
  mutation RenewCheckout($checkoutId: ID!) {
    renewCheckout(checkoutId: $checkoutId) {
      id
      dueDate
      renewCount
    }
  }
`;

function MyCheckoutsPage() {
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useQuery(MY_CHECKOUTS_QUERY, {
    onError: () => {
      navigate('/login');
    },
  });

  const [returnCheckout] = useMutation(RETURN_MUTATION, {
    onCompleted: () => refetch(),
    onError: (error) => alert(error.message),
  });

  const [renewCheckout] = useMutation(RENEW_MUTATION, {
    onCompleted: () => {
      refetch();
      alert('Checkout renewed successfully!');
    },
    onError: (error) => alert(error.message),
  });

  if (loading) return <div className="text-center text-xl">Loading your checkouts...</div>;
  if (error) return <div className="text-center text-red-500">Please login to view your checkouts</div>;

  const checkouts = data?.myCheckouts || [];
  const activeCheckouts = checkouts.filter(c => c.status === 'ACTIVE');
  const returnedCheckouts = checkouts.filter(c => c.status === 'RETURNED');

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      console.error('Error formatting date:', dateString, e);
      return 'Invalid Date';
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">My Checkouts</h1>

      {/* Active Checkouts */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Active Checkouts</h2>
        {activeCheckouts.length === 0 ? (
          <p className="text-gray-500">You don't have any active checkouts</p>
        ) : (
          <div className="grid gap-4">
            {activeCheckouts.map(checkout => (
              <div
                key={checkout.id}
                className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                  isOverdue(checkout.dueDate) ? 'border-red-500' : 'border-blue-500'
                }`}
              >
                <div className="flex gap-6">
                  {checkout.edition.book.coverImage && (
                    <img
                      src={checkout.edition.book.coverImage}
                      alt={checkout.edition.book.title}
                      className="w-20 h-28 object-cover rounded flex-shrink-0"
                    />
                  )}
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {checkout.edition.book.title}
                    </h3>
                    <p className="text-gray-600 mb-2">by {checkout.edition.book.author}</p>
                    <p className="text-gray-600 mb-2">Format: {checkout.edition.format}</p>
                    
                    <div className="mt-4">
                      <p className={`font-semibold ${isOverdue(checkout.dueDate) ? 'text-red-600' : 'text-gray-700'}`}>
                        Due: {formatDate(checkout.dueDate)}
                        {isOverdue(checkout.dueDate) && ' (OVERDUE)'}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Renewals: {checkout.renewCount}/2
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => returnCheckout({ variables: { checkoutId: checkout.id } })}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    >
                      Return Book
                    </button>
                    <button
                      onClick={() => renewCheckout({ variables: { checkoutId: checkout.id } })}
                      disabled={checkout.renewCount >= 2}
                      className={`px-4 py-2 rounded transition ${
                        checkout.renewCount < 2
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Renew
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Checkout History */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Checkout History</h2>
        {returnedCheckouts.length === 0 ? (
          <p className="text-gray-500">No checkout history</p>
        ) : (
          <div className="grid gap-4">
            {returnedCheckouts.map(checkout => (
              <div
                key={checkout.id}
                className="bg-gray-50 rounded-lg shadow p-6 border-l-4 border-gray-400"
              >
                <div className="flex gap-6">
                  {checkout.edition.book.coverImage && (
                    <img
                      src={checkout.edition.book.coverImage}
                      alt={checkout.edition.book.title}
                      className="w-20 h-28 object-cover rounded opacity-75 flex-shrink-0"
                    />
                  )}
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-700 mb-2">
                      {checkout.edition.book.title}
                    </h3>
                    <p className="text-gray-600 mb-2">by {checkout.edition.book.author}</p>
                    <p className="text-gray-600 mb-2">Format: {checkout.edition.format}</p>
                    
                    <div className="mt-4">
                      <p className="text-gray-600">Returned: {formatDate(checkout.returnDate)}</p>
                      <p className="text-gray-600 text-sm">
                        Was due: {formatDate(checkout.dueDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCheckoutsPage;

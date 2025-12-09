import { useQuery, useMutation, gql } from '@apollo/client';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Pencil, Trash2, Plus, X, BookOpen } from 'lucide-react';

const ME_QUERY = gql`
  query Me {
    me {
      id
      role
    }
  }
`;

const BOOKS_QUERY = gql`
  query Books {
    books {
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

const CREATE_BOOK_MUTATION = gql`
  mutation CreateBook(
    $title: String!
    $author: String!
    $isbn: String
    $description: String
    $genre: String
    $coverImage: String
  ) {
    createBook(
      title: $title
      author: $author
      isbn: $isbn
      description: $description
      genre: $genre
      coverImage: $coverImage
    ) {
      id
      title
      author
    }
  }
`;

const UPDATE_BOOK_MUTATION = gql`
  mutation UpdateBook(
    $id: ID!
    $title: String
    $author: String
    $isbn: String
    $description: String
    $genre: String
    $coverImage: String
  ) {
    updateBook(
      id: $id
      title: $title
      author: $author
      isbn: $isbn
      description: $description
      genre: $genre
      coverImage: $coverImage
    ) {
      id
      title
      author
    }
  }
`;

const DELETE_BOOK_MUTATION = gql`
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id)
  }
`;

const CREATE_EDITION_MUTATION = gql`
  mutation CreateEdition(
    $bookId: ID!
    $format: Format!
    $publisher: String
    $year: Int
    $totalCopies: Int!
  ) {
    createEdition(
      bookId: $bookId
      format: $format
      publisher: $publisher
      year: $year
      totalCopies: $totalCopies
    ) {
      id
      format
    }
  }
`;

const DELETE_EDITION_MUTATION = gql`
  mutation DeleteEdition($id: ID!) {
    deleteEdition(id: $id)
  }
`;

export default function AdminPage() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [showEditionForm, setShowEditionForm] = useState(null);
  const [editionFormData, setEditionFormData] = useState({
    format: 'PAPERBACK',
    publisher: '',
    year: new Date().getFullYear(),
    totalCopies: 1,
  });
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    genre: '',
    coverImage: '',
  });

  const { data: userData } = useQuery(ME_QUERY, {
    onCompleted: (data) => {
      if (!data.me || data.me.role !== 'ADMIN') {
        navigate('/');
      }
    },
    onError: () => navigate('/login'),
  });

  const { data, loading, error, refetch } = useQuery(BOOKS_QUERY);

  const [createBook] = useMutation(CREATE_BOOK_MUTATION, {
    onCompleted: () => {
      refetch();
      resetForm();
    },
    onError: (error) => alert(error.message),
  });

  const [updateBook] = useMutation(UPDATE_BOOK_MUTATION, {
    onCompleted: () => {
      refetch();
      resetForm();
    },
    onError: (error) => alert(error.message),
  });

  const [deleteBook] = useMutation(DELETE_BOOK_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => alert(error.message),
  });

  const [createEdition] = useMutation(CREATE_EDITION_MUTATION, {
    onCompleted: () => {
      refetch();
      setShowEditionForm(null);
      setEditionFormData({
        format: 'PAPERBACK',
        publisher: '',
        year: new Date().getFullYear(),
        totalCopies: 1,
      });
    },
    onError: (error) => alert(error.message),
  });

  const [deleteEdition] = useMutation(DELETE_EDITION_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (error) => alert(error.message),
  });

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      description: '',
      genre: '',
      coverImage: '',
    });
    setEditingBook(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingBook) {
      updateBook({
        variables: {
          id: editingBook.id,
          ...formData,
        },
      });
    } else {
      createBook({
        variables: formData,
      });
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn || '',
      description: book.description || '',
      genre: book.genre || '',
      coverImage: book.coverImage || '',
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this book? This will also delete all its editions and checkouts.')) {
      deleteBook({ variables: { id } });
    }
  };

  const handleAddEdition = (bookId) => {
    setShowEditionForm(bookId);
  };

  const handleSubmitEdition = (e, bookId) => {
    e.preventDefault();
    createEdition({
      variables: {
        bookId,
        ...editionFormData,
        year: parseInt(editionFormData.year),
        totalCopies: parseInt(editionFormData.totalCopies),
      },
    });
  };

  const handleDeleteEdition = (editionId) => {
    if (window.confirm('Are you sure you want to delete this edition?')) {
      deleteEdition({ variables: { id: editionId } });
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error.message}</div>;
  if (!userData?.me || userData.me.role !== 'ADMIN') return null;

  const books = data?.books || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin - Manage Books</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add New Book'}
        </Button>
      </div>

      {/* Book Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Book title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <Input
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Author name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ISBN
                  </label>
                  <Input
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    placeholder="ISBN number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Genre
                  </label>
                  <Input
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    placeholder="Fiction, Non-fiction, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Book description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image URL
                </label>
                <Input
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit">
                  {editingBook ? 'Update Book' : 'Create Book'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Books List */}
      <div className="grid gap-4">
        {books.map((book) => (
          <Card key={book.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex gap-4 flex-1">
                  {book.coverImage && (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{book.title}</h3>
                    <p className="text-gray-600 mb-2">by {book.author}</p>
                    {book.genre && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {book.genre}
                      </span>
                    )}
                    {book.isbn && (
                      <p className="text-sm text-gray-500 mt-2">ISBN: {book.isbn}</p>
                    )}
                    {book.description && (
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                        {book.description}
                      </p>
                    )}
                    
                    {/* Editions */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold text-sm text-gray-900">
                          Editions ({book.editions.length})
                        </h4>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddEdition(book.id)}
                          className="gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add Edition
                        </Button>
                      </div>
                      
                      {showEditionForm === book.id && (
                        <form onSubmit={(e) => handleSubmitEdition(e, book.id)} className="bg-gray-50 p-3 rounded mb-2 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Format *</label>
                              <select
                                required
                                value={editionFormData.format}
                                onChange={(e) => setEditionFormData({ ...editionFormData, format: e.target.value })}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-600"
                              >
                                <option value="HARDCOVER">Hardcover</option>
                                <option value="PAPERBACK">Paperback</option>
                                <option value="EBOOK">E-book</option>
                                <option value="AUDIOBOOK">Audiobook</option>
                                <option value="CD">CD</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Copies *</label>
                              <Input
                                type="number"
                                required
                                min="1"
                                value={editionFormData.totalCopies}
                                onChange={(e) => setEditionFormData({ ...editionFormData, totalCopies: e.target.value })}
                                className="h-8 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Publisher</label>
                              <Input
                                value={editionFormData.publisher}
                                onChange={(e) => setEditionFormData({ ...editionFormData, publisher: e.target.value })}
                                className="h-8 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
                              <Input
                                type="number"
                                value={editionFormData.year}
                                onChange={(e) => setEditionFormData({ ...editionFormData, year: e.target.value })}
                                className="h-8 text-sm"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button type="submit" size="sm">Add</Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => setShowEditionForm(null)}>Cancel</Button>
                          </div>
                        </form>
                      )}
                      
                      {book.editions.length === 0 ? (
                        <p className="text-xs text-gray-500 italic">No editions yet. Add one to make this book available for checkout.</p>
                      ) : (
                        <div className="space-y-1">
                          {book.editions.map((edition) => (
                            <div key={edition.id} className="flex justify-between items-center bg-gray-50 px-2 py-1 rounded text-xs">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-3 h-3 text-gray-400" />
                                <span className="font-medium">{edition.format}</span>
                                {edition.publisher && <span className="text-gray-600">• {edition.publisher}</span>}
                                {edition.year && <span className="text-gray-600">({edition.year})</span>}
                                <span className="text-gray-600">• {edition.availableCopies}/{edition.totalCopies} available</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteEdition(edition.id)}
                                className="h-6 px-2"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(book)}
                    className="gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(book.id)}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

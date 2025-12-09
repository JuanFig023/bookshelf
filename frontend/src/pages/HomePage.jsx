import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const BOOKS_QUERY = gql`
  query Books {
    books {
      id
      title
      author
      genre
      coverImage
      editions {
        id
        availableCopies
      }
    }
  }
`;

function HomePage({ searchTerm = '' }) {
  const { loading, error, data } = useQuery(BOOKS_QUERY);
  const [genreFilter, setGenreFilter] = useState('');

  if (loading) return <div className="text-center text-gray-500">Loading books...</div>;
  if (error) return <div className="text-center text-red-600">Error: {error.message}</div>;

  const books = data?.books || [];
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !genreFilter || book.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const genres = [...new Set(books.map(b => b.genre).filter(Boolean))];

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Discover</h1>
      </div>

      {/* Genre Categories */}
      {genres.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Categories</h2>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={!genreFilter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGenreFilter('')}
            >
              All
            </Button>
            {genres.map(genre => (
              <Button
                key={genre}
                variant={genreFilter === genre ? 'default' : 'outline'}
                size="sm"
                onClick={() => setGenreFilter(genre)}
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Books Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredBooks.map(book => {
          const totalAvailable = book.editions.reduce((sum, ed) => sum + ed.availableCopies, 0);
          
          return (
            <Link key={book.id} to={`/book/${book.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                {/* Book Cover */}
                <div className="relative w-full aspect-[2/3] bg-muted overflow-hidden">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">📖</span>
                    </div>
                  )}
                </div>
                
                {/* Book Info */}
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2">{book.author}</p>
                  <Badge variant={totalAvailable > 0 ? 'default' : 'destructive'} className="text-xs">
                    {totalAvailable > 0 ? 'Available' : 'Unavailable'}
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center text-muted-foreground py-20">
          <p className="text-lg">No books found</p>
        </div>
      )}
    </div>
  );
}

export default HomePage;

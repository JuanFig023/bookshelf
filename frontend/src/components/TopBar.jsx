import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { Search, User } from 'lucide-react';
import { Input } from './ui/input';

const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      role
    }
  }
`;

export default function TopBar({ searchTerm, onSearchChange }) {
  const { data } = useQuery(ME_QUERY, {
    errorPolicy: 'ignore'
  });
  const user = data?.me;

  return (
    <header className="fixed top-0 right-0 left-64 h-20 bg-white border-b border-gray-200 z-10">
      <div className="h-full px-8 flex items-center justify-between">
        {/* Search Bar - centered */}
        <div className="flex-1 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for your favorite books"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* User Profile - right side */}
        <div className="flex items-center gap-3 ml-6">
          {user && (
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user.name || 'Admin User'}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

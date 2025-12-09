import { Link, useLocation } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Home, BookOpen, Settings, LogOut, LogIn } from 'lucide-react';
import { Button } from './ui/button';

const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      role
    }
  }
`;

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

function NavBar() {
  const location = useLocation();
  const { data } = useQuery(ME_QUERY, { 
    errorPolicy: 'ignore'
  });
  const [logout] = useMutation(LOGOUT_MUTATION, {
    onCompleted: () => {
      window.location.href = '/';
    },
  });

  const user = data?.me;
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">📚</span>
          </div>
          <span className="text-xl font-bold">BookShelf</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/">
          <Button
            variant={isActive('/') ? 'secondary' : 'ghost'}
            className="w-full justify-start gap-3"
          >
            <Home className="w-5 h-5" />
            Discover
          </Button>
        </Link>
        
        {user && (
          <Link to="/my-checkouts">
            <Button
              variant={isActive('/my-checkouts') ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3"
            >
              <BookOpen className="w-5 h-5" />
              My Checkouts
            </Button>
          </Link>
        )}

        {user && user.role === 'ADMIN' && (
          <Link to="/admin">
            <Button
              variant={isActive('/admin') ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3"
            >
              <Settings className="w-5 h-5" />
              Admin Panel
            </Button>
          </Link>
        )}
      </nav>

      {/* Auth Section */}
      <div className="border-t border-gray-200 p-4">
        {user ? (
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => logout()}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        ) : (
          <Link to="/login">
            <Button className="w-full gap-2">
              <LogIn className="w-5 h-5" />
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </aside>
  );
}

export default NavBar;

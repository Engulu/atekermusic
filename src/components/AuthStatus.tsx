// src/components/AuthStatus.tsx
import { useFirebase } from '../contexts/FirebaseContext';

export function AuthStatus() {
  const { currentUser, signOut } = useFirebase();

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      {currentUser ? (
        <div>
          <p>Logged in as: {currentUser.email}</p>
          <button 
            onClick={signOut}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <p>You are not logged in.</p>
      )}
    </div>
  );
}

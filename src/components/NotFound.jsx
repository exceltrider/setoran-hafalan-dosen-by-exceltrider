import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center px-4 text-white">
      <div className="text-center max-w-2xl">
        <h1 className="text-8xl font-bold mb-4 animate-pulse">404</h1>
        <p className="text-2xl font-semibold mb-2">Not Found in the System</p>
        <p className="text-xl text-gray-300 mb-6 italic">"404 A New Error Error"</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all duration-200 font-medium"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};
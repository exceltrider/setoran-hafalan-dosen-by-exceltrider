import { Link } from 'react-router-dom';

export const NotFound = () => {
  const spotifyEmbedUrl = "https://open.spotify.com/embed/track/24rDDbSlFY9OHrlJb48CRh?utm_source=generator";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center px-4 text-white">
      <div className="text-center max-w-2xl">
        <h1 className="text-8xl font-bold mb-4 animate-pulse">404</h1>
        <p className="text-2xl font-semibold mb-2">Not Found in The System</p>
        <p className="text-xl text-gray-300 mb-6 italic">"404 (New Era) KiiiiKiii"</p>

        {/* Embed Spotify */}
        <div className="w-full max-w-md mx-auto mb-8 rounded-xl overflow-hidden shadow-2xl">
          <iframe
            src={spotifyEmbedUrl}
            width="100%"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            title="KiiiiKiii - 404 (New Era)"
            className="rounded-lg"
          ></iframe>
        </div>

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
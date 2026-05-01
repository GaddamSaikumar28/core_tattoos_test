import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-5xl font-bold font-almarena mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-gray-600 max-w-md mb-8">
        The tattoo design, product, or page you are looking for does not exist or has been moved.
      </p>
      <Link 
        href="/" 
        className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
      >
        Return to Homepage
      </Link>
    </div>
  );
}
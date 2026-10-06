import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-[#1A1A1A] p-6 text-center">
      <h1 className="text-6xl font-bold font-heading mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
      <p className="text-[#6E6E6E] max-w-md mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link 
        href="/" 
        className="px-6 py-3 rounded-full bg-[#CCF88E] text-[#1A1A1A] font-bold hover:bg-[#B6EA6C] transition-colors"
      >
        Return to Home Page
      </Link>
    </div>
  );
}

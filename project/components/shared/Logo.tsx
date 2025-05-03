import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <div className="flex items-center">
        <span className="text-xl font-bold" style={{ color: '#0B50A0' }}>Apollo</span>
        <div className="ml-0.5 flex items-center justify-center" style={{ backgroundColor: '#F37F22', padding: '2px 4px', borderRadius: '2px' }}>
          <span className="font-bold text-white text-sm leading-tight">24|7</span>
        </div>
      </div>
    </Link>
  );
}
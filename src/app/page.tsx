import { Db } from '@/lib/db';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="text-center text-green-500 text-3xl">
      some random data
      <div>
        <Db />
      </div>
      <div>
        <Link href={'/event/event'} className="db">
          pages
        </Link>
      </div>
      <div>
        <Link href={'/theme/theme'} className="db">
          Themes
        </Link>
      </div>
    </main>
  );
}

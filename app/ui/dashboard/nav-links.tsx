'use client';
import {
  HomeIcon,
  DocumentDuplicateIcon,
  ShoppingCartIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  {
    name: 'Products',
    href: '/dashboard/products',
    icon: ShoppingCartIcon,
  },
  { name: 'Claims', href: '/dashboard/claims', icon: DocumentDuplicateIcon },
  { name: 'User Products', href: '/dashboard/userproducts', icon: ShoppingBagIcon }
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            passHref
            className={clsx(
              'flex items-center gap-2 rounded-md bg-gray-100 p-3 text-sm font-medium hover:bg-gray-200 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-200 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6 h-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}

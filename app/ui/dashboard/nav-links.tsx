'use client';
import {
  HomeIcon,
  DocumentDuplicateIcon,
  ShoppingCartIcon,
  ShoppingBagIcon,
  UsersIcon,
  ShieldCheckIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

const links = [
  {
    name: 'Products',
    href: '/dashboard/products',
    icon: ShoppingCartIcon,
    roleId: [1],
  },
  {
    name: 'Claims',
    href: '/dashboard/claims',
    icon: DocumentDuplicateIcon,
    roleId: [1, 2],
  },
  {
    name: 'User Products',
    href: '/dashboard/userproducts',
    icon: ShoppingBagIcon,
    roleId: [1, 2],
  },
  { name: 'Users', href: '/dashboard/users', icon: UsersIcon, roleId: [1] },
  {
    name: 'Admins',
    href: '/dashboard/admins',
    icon: ShieldCheckIcon,
    roleId: [1],
  },
  {
    name: 'My Profile',
    href: '/dashboard/profile',
    icon: UserPlusIcon,
    roleId: [1,2],
  }
];

export default function NavLinks() {
  const pathname = usePathname();
  const [roleId, setRoleId] = useState('');

  useEffect(() => {
    const roleIdFromStorage = localStorage.getItem('roleId');
    if (roleIdFromStorage) {
      setRoleId(roleIdFromStorage);
    }
  }, []); // Run only once on component mount

  if (!roleId) {
    return null; // If roleId is not found, return null or handle it differently
  }

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        if (link.roleId.includes(Number(roleId))) {
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
              <LinkIcon className="h-6 w-6" />
              <p className="hidden md:block">{link.name}</p>
            </Link>
          );
        }
      })}
    </>
  );
}

'use client';
import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { PowerIcon } from '@heroicons/react/24/outline';
import InsuranceLogo from '@/app/ui/insurance-logo';
import Swal from 'sweetalert2';

export default function SideNav() {
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your account',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log me out!',
    }).then((result: { isConfirmed: any }) => {
      if (result.isConfirmed) {
        localStorage.clear();
        // Redirect to the login page
        window.location.href = `${window.location.origin}/login`;
      }
    });
  };
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <span className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40">
        <div className="w-32 text-white md:w-40">
          <InsuranceLogo />
        </div>
      </span>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>{' '}
        <button
          onClick={handleLogout}
          className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
        >
          <PowerIcon className="w-6" />
          <div className="hidden md:block">Sign Out</div>
        </button>
      </div>
    </div>
  );
}

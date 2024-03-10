'use client';
import { useState } from 'react';
import axios from 'axios';
import {
  DocumentCheckIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    Username: '',
    Password: '',
    CellphoneNo: '',
    Email: '',
    Name: '',
    Address: '',
  });

  const { Username, Password, CellphoneNo, Email, Name, Address } = formData;

  const onChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    const data = {
      Username,
      Password,
      CellphoneNo,
      Email,
      Name,
      Address,
      RoleID: 1,
    };

    try {
      const response = await axios.post(
        'https://insurance-claim-server.vercel.app/api/user/signup/',
        data,
      );
      if (response.status === 200) {
        Swal.fire({
          text: `Account created successfully!`,
          icon: 'success',
          showConfirmButton: false,
          timer: 3000,
        });
        router.push('/dashboard/admins');
      } else {
        Swal.fire({
          text: 'Something went wrong.',
          icon: 'error',
          showConfirmButton: false,
          timer: 3000,
        });
        console.error('Error updating profile:', response);
      } // Handle response as needed
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  };
  return (
    <form onSubmit={onSubmit} className="rounded-md bg-gray-50 p-4 md:p-6">
      <div className="mb-4">
        <label htmlFor="username" className="mb-2 block text-sm font-medium">
          Username
        </label>
        <div className="relative mt-2 rounded-md">
          <input
            id="username"
            type="text"
            name="Username"
            value={Username}
            onChange={onChange}
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            required
          />
          <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="username" className="mb-2 block text-sm font-medium">
          Password
        </label>
        <div className="relative mt-2 rounded-md">
          <input
            id="Password"
            type="password"
            name="Password"
            value={Password}
            onChange={onChange}
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            required
          />
          <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="cellphone" className="mb-2 block text-sm font-medium">
          Cellphone Number
        </label>
        <div className="relative mt-2 rounded-md">
          <input
            id="cellphone"
            type="text"
            name="CellphoneNo"
            value={CellphoneNo}
            onChange={onChange}
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            required
          />
          <PhoneIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email address
        </label>
        <div className="relative mt-2 rounded-md">
          <input
            id="email"
            type="email"
            name="Email"
            value={Email}
            onChange={onChange}
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            required
          />
          <EnvelopeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          Name
        </label>
        <div className="relative mt-2 rounded-md">
          <input
            id="name"
            type="text"
            name="Name"
            value={Name}
            onChange={onChange}
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            required
          />
          <DocumentCheckIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="address" className="mb-2 block text-sm font-medium">
          Address
        </label>
        <div className="relative mt-2 rounded-md">
          <input
            id="address"
            type="text"
            name="Address"
            value={Address}
            onChange={onChange}
            className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
            required
          />
          <GlobeAltIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button
          type="submit"
          className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </form>
  );
}

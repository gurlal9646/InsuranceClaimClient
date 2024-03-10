'use client';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  DocumentCheckIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const roleId = localStorage.getItem('roleId');

        if (token) {
          const response = await axios.get(
            roleId === '2'
              ? 'https://insurance-claim-server.vercel.app/api/user/list/' +
                  userId
              : 'https://insurance-claim-server.vercel.app/api/user/adminlist/' +
                  userId,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (response.data) {
            const user = {
              Username: response.data.Username,
              CellphoneNo: response.data.CellphoneNo,
              Email: response.data.Email,
              Name: response.data.Name,
              Address: response.data.Address,
            };
            setFormData(user);
          } else {
            console.error('Error fetching data:', response);
          }
        } else {
          console.error('Token not found in localStorage');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData(); // Call the fetchData function when the component mounts
  }, []);

  const [formData, setFormData] = useState({
    Username: '',
    CellphoneNo: '',
    Email: '',
    Name: '',
    Address: '',
  });

  const { Username, CellphoneNo, Email, Name, Address } = formData;

  const onChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();


    const data = {
      Username,
      CellphoneNo,
      Email,
      Name,
      Address,
    };

    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'https://insurance-claim-server.vercel.app/api/user/update/' + userId,
        data,
        {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
      );
      if (response.status === 200) {
        Swal.fire({
          text: response.data,
          icon: 'success',
          showConfirmButton: false,
          timer: 3000,
        });
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

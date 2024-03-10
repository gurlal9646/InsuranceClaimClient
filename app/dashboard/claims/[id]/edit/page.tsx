'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CalendarIcon,
  DocumentPlusIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { object, string } from 'zod';
import Swal from 'sweetalert2';

const schema = object({
  UserProductId: string().min(1, { message: 'User Product is required.' }),
  Description: string().min(1, { message: 'Description  is required.' }),
  DateOfClaim: string().min(1, { message: 'DateOfClaim must be provided' }),
});

const delay = (delayInms: number | undefined) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

export default function Page({ params }: { params: { id: string } }) {
  const [userProducts, setUserProducts] = useState([]);
  // Fetch data from the API
  const fetchData = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');

      // Make sure token exists
      if (token) {
        try {
          const response = await axios.get(
            `https://insurance-claim-server.vercel.app/api/userProducts/list`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

          if (response.status === 200) {
            const data = response.data; // Axios already parses JSON
            setUserProducts(data); // Set products data to state
          } else {
            // Handle other HTTP status codes if necessary
            console.error('Error fetching data:', response.statusText);
          }
        } catch (error) {
          // Handle axios errors
          console.error('Error fetching data:', error);
        }
      } else {
        console.error('Token not found in localStorage');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [formData, setFormData] = useState({
    ClaimId: '',
    UserProductId: '',
    Description: '',
    DateOfClaim: getCurrentDate(),
  });

  useEffect(() => {
    const claimData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch(
            `https://insurance-claim-server.vercel.app/api/claims/${params.id}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            return data;
          } else {
            console.error('Error fetching data:', response.statusText);
            return null;
          }
        } else {
          console.error('Token not found in localStorage');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const getclaim = async () => {
      const claimResponse = await claimData();
      if (claimResponse !== null) {
        const updatedFormData = {
          ClaimId: claimResponse.ClaimId,
          UserProductId: claimResponse.UserProductId,
          Description: claimResponse.Description,
          DateOfClaim: new Date(claimResponse.DateOfClaim)
            .toISOString()
            .split('T')[0], // Assuming PurchaseDate is already in the desired format
        };
        setFormData(updatedFormData);
      }
    };

    getclaim();
  }, [params.id]);
  const [formErrors, setFormErrors] = useState<any>({});

  const { ClaimId,UserProductId, Description, DateOfClaim } = formData;

  const onChange = (e: { target: { name: any; value: any } }) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const data = {
        ClaimId,
      UserProductId,
      Description,
      DateOfClaim,
    };

    try {
      schema.parse(formData);

      const token = localStorage.getItem('token');

      const response = await axios.put(
        'https://insurance-claim-server.vercel.app/api/claims/update/'+ClaimId,
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
        let delayres = await delay(3000);
        window.location.href = '/dashboard/claims';
      } else {
        Swal.fire({
          text: 'Something went wrong.',
          icon: 'error',
          showConfirmButton: false,
          timer: 3000,
        });
        console.error('Error adding product:', response);
      }
    } catch (error: any) {
      if (error.errors) {
        setFormErrors(
          error.errors.reduce((acc: any, err: any) => {
            acc[err.path[0]] = err.message;
            return acc;
          }, {}),
        );
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month: any = today.getMonth() + 1; // January is 0!
    let day: any = today.getDate();

    // Append a leading zero if the month or day is a single digit
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    return `${year}-${month}-${day}`;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="product" className="mb-2 block text-sm font-medium">
            Choose Product
          </label>
          <div className="relative">
            <select
              id="UserProductId"
              name="UserProductId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              value={UserProductId}
              onChange={onChange}
            >
              <option value="" disabled>
                Select a product
              </option>
              {userProducts.map((product: any) => (
                <option
                  key={product.UserProductId}
                  value={product.UserProductId}
                >
                  {product.SerialNo}
                </option>
              ))}
            </select>
            <ShoppingCartIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {formErrors['UserProductId'] && (
            <p className="mb-1 text-sm text-red-500">
              {formErrors['UserProductId']}
            </p>
          )}
        </div>

        {/* Serial Number */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Description
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="Description"
                name="Description"
                type="text"
                placeholder="Description"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                value={Description}
                onChange={onChange}
              />
              <DocumentPlusIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {formErrors['Description'] && (
            <p className="mb-1 text-sm text-red-500">
              {formErrors['Description']}
            </p>
          )}
        </div>

        {/* Purchased Date */}
        <div className="mb-4">
          <label htmlFor="claimdate" className="mb-2 block text-sm font-medium">
            Claim Date
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="DateOfClaim"
                name="DateOfClaim"
                type="date"
                placeholder="Select Purchase Date"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                value={DateOfClaim}
                onChange={onChange}
                max={getCurrentDate()}
              />
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {formErrors['DateOfClaim'] && (
            <p className="mb-1 text-sm text-red-500">
              {formErrors['DateOfClaim']}
            </p>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/claims"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="hover flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors"
        >
          Save
        </button>
      </div>
    </form>
  );
}

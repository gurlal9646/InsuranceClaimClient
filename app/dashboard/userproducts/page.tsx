'use client';
import { formatDateToLocal } from '@/app/lib/utils';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Page() {
  const [products, setProducts] = useState([]);
  const [roleId, setRoleId] = useState('0'); // Add roleId state

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
            setProducts(data); // Set products data to state
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
    const userRoleId = localStorage.getItem('roleId');
    if (userRoleId) {
      setRoleId(userRoleId);
    }
  }, []);

  const handleDelete = async (userProductId: any) => {
    // Show a confirmation dialog using SweetAlert
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this user product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Get token from localStorage
          const token = localStorage.getItem('token');

          // Make sure token exists
          if (token) {
            // Call the API to delete the user product
            const response = await axios.delete(
              `https://insurance-claim-server.vercel.app/api/userProducts/delete/${userProductId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (response.status === 200) {
              // If the deletion is successful, update the products state to reflect the change
              fetchData();
              Swal.fire(
                'Deleted!',
                'Your user product has been deleted.',
                'success',
              );
            } else {
              Swal.fire(
                'Error!',
                'Failed to delete the user product.',
                'error',
              );
            }
          } else {
            console.error('Token not found in localStorage');
          }
        } catch (error) {
          console.error('Error deleting user product:', error);
          Swal.fire('Error!', 'Failed to delete the user product.', 'error');
        }
      }
    });
  };

  return (
    <div className="rounded-md bg-white p-6 shadow-md">
      <h1 className="mb-4 text-2xl font-bold">User Products</h1>
      {roleId === '2' && (
        <div className="mb-4">
          <Link href="/dashboard/userproducts/create">
            <span className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-500">
              Add Product
            </span>
          </Link>
        </div>
      )}
      <div className="grid grid-cols-3 gap-4">
        {products.map((product: any, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-md bg-gray-100 p-4"
          >
            <div>
              <p className="text-lg font-semibold">
                Serial Number: {product.SerialNo}
              </p>
              <p className="text-sm">
                Purchased Date: {formatDateToLocal(product.PurchaseDate)}
              </p>
              <p className="text-sm">
                Created Date: {formatDateToLocal(product.createdAt)}
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                href={`/dashboard/userproducts/${product.UserProductId}/edit`}
              >
                <PencilIcon className="h-5 w-5" />
              </Link>
              <button
                className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                onClick={() => handleDelete(product.UserProductId)}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

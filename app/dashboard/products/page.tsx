'use client';
import { formatCurrency } from '@/app/lib/utils';
import axios from 'axios';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export default function Page() {
  const [products, setProducts] = useState([]);

  const fetchData = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');

      // Make sure token exists
      if (token) {
        const response = await axios.get(
          `https://insurance-claim-server.vercel.app/api/product/list`,
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

  const handleDelete = async (ProductId: any) => {
    // Show a confirmation dialog using SweetAlert
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this product!',
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
              `https://insurance-claim-server.vercel.app/api/product/delete/${ProductId}`,
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
                'Your product has been deleted.',
                'success',
              );
            } else {
              Swal.fire('Error!', 'Failed to delete the product.', 'error');
            }
          } else {
            console.error('Token not found in localStorage');
          }
        } catch (error) {
          console.error('Error deleting  product:', error);
          Swal.fire('Error!', 'Failed to delete the product.', 'error');
        }
      }
    });
  };

  return (
    <div className="rounded-md bg-white p-6 shadow-md">
      <h1 className="mb-4 text-2xl font-bold">Products Page</h1>
      <div className="mb-4">
        <Link href="/dashboard/products/create">
          <span className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-500">
            Add Product
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product: any, index) => (
          <div
            key={index}
            className="flex flex-col justify-between rounded-md bg-gray-100 p-4"
          >
            <div>
              <h2 className="mb-2 text-lg font-semibold">
                {product.ProductName}
              </h2>
              <p className="mb-2 text-sm">Model: {product.Model}</p>
              <p className="mb-2 text-sm">
                Manufacturer: {product.Manufacturer}
              </p>
              <p className="mb-2 text-sm">Description: {product.Description}</p>
              <p className="mb-2 text-sm">
                Price: {formatCurrency(product.Price)}
              </p>
              <p className="text-sm">
                Warranty Details: {product.WarrantyDetails}
              </p>
            </div>
            <div className="mt-4 flex justify-between">
              <div className="flex space-x-4">
                <button className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                  Edit
                </button>
                <button className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                onClick={() => handleDelete(product.ProductID)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

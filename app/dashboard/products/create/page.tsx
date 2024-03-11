'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DocumentPlusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { number, object, string } from 'zod'; // Import 'string' from zod
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

// Define the new schema for the new fields only
const schema = object({
  ProductName: string().min(1, { message: 'Product name is required.' }),
  Model: string().min(1, { message: 'Model is required.' }),
  Manufacturer: string().min(1, { message: 'Manufacturer is required.' }),
  Description: string().min(1, { message: 'Description is required.' }),
  Price: string().min(1, { message: 'Price is required.' }),
  WarrantyDetails: string().min(1, { message: 'Warranty details are required.' }),
  Availability: string().optional() // Availability can be optional, you can further refine validation
});

const delay = (delayInms: number | undefined) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
};

export default function Page() {
  const [formData, setFormData] = useState({
    ProductId:'',
    ProductName: '',
    Model: '',
    Manufacturer: '',
    Description: '',
    Price: '',
    WarrantyDetails: '',
    Availability: 'Available'
  });
  const [formErrors, setFormErrors] = useState<any>({});

  const { ProductName, Model, Manufacturer, Description, Price, WarrantyDetails, Availability } = formData;

  const onChange = (e: { target: { name: any; value: any; }; }) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      schema.parse(formData);

      const token = localStorage.getItem('token');

      const response = await axios.post(
        'https://insurance-claim-server.vercel.app/api/product/create',
        formData, // Send formData directly
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
          showConfirmButton:false,
          timer:3000
        });
        let delayres = await delay(3000);
        window.location.href="/dashboard/products";
      } else {
        Swal.fire({
          text: 'Something went wrong.',
          icon: 'error',
          showConfirmButton:false,
          timer:3000
        });
        console.error('Error adding product:', response);
      }
    } catch (error:any) {
      if (error.errors) {
        setFormErrors(error.errors.reduce((acc:any, err:any) => {
          acc[err.path[0]] = err.message;
          return acc;
        }, {}));
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} >
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Product Name */}
        <div className="mb-4">
          <label htmlFor="productname" className="mb-2 block text-sm font-medium">
            Product Name
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="ProductName"
                name="ProductName"
                type="text"
                placeholder="Enter Product Name"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                value={ProductName}
                onChange={onChange}
              />
              <DocumentPlusIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {formErrors['ProductName'] && (
            <p className="text-red-500 text-sm mb-1">{formErrors['ProductName']}</p>
          )}
        </div>

        {/* Model */}
        <div className="mb-4">
          <label htmlFor="model" className="mb-2 block text-sm font-medium">
            Model
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="Model"
                name="Model"
                type="text"
                placeholder="Enter Model"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                value={Model}
                onChange={onChange}
              />
              <DocumentPlusIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {formErrors['Model'] && (
            <p className="text-red-500 text-sm mb-1">{formErrors['Model']}</p>
          )}
        </div>

        {/* Manufacturer */}
        <div className="mb-4">
          <label htmlFor="manufacturer" className="mb-2 block text-sm font-medium">
            Manufacturer
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="Manufacturer"
                name="Manufacturer"
                type="text"
                placeholder="Enter Manufacturer"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                value={Manufacturer}
                onChange={onChange}
              />
              <DocumentPlusIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {formErrors['Manufacturer'] && (
            <p className="text-red-500 text-sm mb-1">{formErrors['Manufacturer']}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Description
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="Description"
                name="Description"
                type="text"
                placeholder="Enter Description"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                value={Description}
                onChange={onChange}
              />
              <DocumentPlusIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {formErrors['Description'] && (
            <p className="text-red-500 text-sm mb-1">{formErrors['Description']}</p>
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          <label htmlFor="price" className="mb-2 block text-sm font-medium">
            Price
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="Price"
                name="Price"
                type="text"
                placeholder="Enter Price"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                value={Price}
                onChange={onChange}
              />
              <DocumentPlusIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {formErrors['Price'] && (
            <p className="text-red-500 text-sm mb-1">{formErrors['Price']}</p>
          )}
        </div>

        {/* Warranty Details */}
        <div className="mb-4">
          <label htmlFor="warrantydetails" className="mb-2 block text-sm font-medium">
            Warranty Details
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="WarrantyDetails"
                name="WarrantyDetails"
                type="text"
                placeholder="Enter Warranty Details"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                value={WarrantyDetails}
                onChange={onChange}
              />
              <DocumentPlusIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {formErrors['WarrantyDetails'] && (
            <p className="text-red-500 text-sm mb-1">{formErrors['WarrantyDetails']}</p>
          )}
        </div>

        {/* Availability */}
        <div className="mb-4">
          <label htmlFor="availability" className="mb-2 block text-sm font-medium">
            Availability
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <select
                id="Availability"
                name="Availability"
                className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                value={Availability}
                onChange={onChange}
              >
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
              <DocumentPlusIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/products"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <button type="submit" className='flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover'>Save</button>
      </div>
    </form>
  );
}

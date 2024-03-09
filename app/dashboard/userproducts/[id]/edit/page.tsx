'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { redirect } from 'next/navigation';
import { CalendarIcon,DocumentPlusIcon, ShoppingCartIcon  } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { object, string } from 'zod';
import Swal from 'sweetalert2';



const schema = object({
  ProductId: string()
      .min(1, { message: 'Product is required.' }),
  SerialNo: string()
      .min(1, { message: 'Serial number is required.' }),
  PurchaseDate: string()
      .min(1, { message: 'Purchase date must be provided' }),
});

export default function Page({ params }: { params: { id: string } }) {

  const [formData, setFormData] = useState({
    UserProductId: '',
    ProductId: '',
    SerialNo: '',
    PurchaseDate: getCurrentDate(),
});
const [formErrors, setFormErrors] = useState<any>({});
const [products, setProducts] = useState([]);

useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await axios.get('https://insurance-claim-server.vercel.app/api/product/list', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.data) {
                    setProducts(response.data); // Set products data to state
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

useEffect(() => {
    const productData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await fetch(`https://insurance-claim-server.vercel.app/api/userProducts/getProductById/${params.id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
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

    const getProduct = async () => {
        const productResponse = await productData();
        if (productResponse !== null) {
            const updatedFormData = {
                UserProductId: productResponse.UserProductId,
                ProductId: productResponse.ProductId,
                SerialNo: productResponse.SerialNo,
                PurchaseDate: new Date(productResponse.PurchaseDate).toISOString().split('T')[0], // Assuming PurchaseDate is already in the desired format
              };
            setFormData(updatedFormData);
        }
    };

    getProduct();
}, [params.id]);

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

const {UserProductId, ProductId, SerialNo, PurchaseDate } = formData;

const onChange = (e: { target: { name: any; value: any } }) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

const onSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    const data = {
        UserProductId,
        ProductId,
        SerialNo,
        PurchaseDate,
    };

    try {
        schema.parse(formData);

        const token = localStorage.getItem('token');

        const response = await axios.put(
            'https://insurance-claim-server.vercel.app/api/userProducts/update/'+ UserProductId,
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
                timer: 3000
            });
            redirect('/dashboard/userproducts');
        } else {
            Swal.fire({
                text: 'Something went wrong.',
                icon: 'error',
                showConfirmButton: false,
                timer: 3000
            });
            console.error('Error adding product:', response);
        }
    } catch (error: any) {
        if (error.errors) {
            setFormErrors(error.errors.reduce((acc: any, err: any) => {
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
        <div className="mb-4">
          <label htmlFor="customer" className="mb-2 block text-sm font-medium">
            Choose Product
          </label>
          <div className="relative">
            <select
              id="ProductId"
              name="ProductId"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              value={ProductId}
              onChange={onChange}
            >
              <option value="" disabled>
                Select a product
              </option>
              {products.map((product:any) => (
                <option key={product.ProductId} value={product.ProductId}>
                  {product.ProductName}
                </option>
              ))}
            </select>
            <ShoppingCartIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
          </div>
          {formErrors['ProductId'] && (
            <p className="text-red-500 text-sm mb-1">{formErrors['ProductId']}</p>
          )}
        </div>

        {/* Serial Number */}
        <div className="mb-4">
          <label htmlFor="serialnumber" className="mb-2 block text-sm font-medium">
            Serial Number
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="SerialNo"
                name="SerialNo"
                type="text"
                placeholder="Enter Serial Number"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                value={SerialNo}
                onChange={onChange}

              />
              <DocumentPlusIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {formErrors['SerialNo'] && (
            <p className="text-red-500 text-sm mb-1">{formErrors['SerialNo']}</p>
          )}
        </div>

        {/* Purchased Date */}
        <div className="mb-4">
          <label htmlFor="purchaseddate" className="mb-2 block text-sm font-medium">
            Purchased Date
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="PurchaseDate"
                name="PurchaseDate"
                type="date"
                placeholder="Select Purchase Date"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                value={PurchaseDate}
                onChange={onChange}
                max={getCurrentDate()} 


              />
              <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          {formErrors['PurchaseDate'] && (
            <p className="text-red-500 text-sm mb-1">{formErrors['PurchaseDate']}</p>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/userproducts"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <button type="submit" className='flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover'>Update Product</button>
      </div>
    </form>
  );
}


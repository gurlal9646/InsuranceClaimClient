'use client';
import { formatCurrency } from '@/app/lib/utils';
import Link from 'next/link';
import { useState, useEffect } from 'react';


export default function Page() {
    const [products, setProducts] = useState([]);
    useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
        try {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        // Make sure token exists
        if (token) {
            const response = await fetch('http://localhost:4000/api/product/list', {
                method: 'GET',
                headers: {
                'Authorization': `Bearer ${token}`
            }
            });
            if (response.ok) {
            const data = await response.json();
            setProducts(data); // Set products data to state
            } else {
            // Handle error
            console.error('Error fetching data:', response.statusText);
            }
        } else {
            console.error('Token not found in localStorage');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    };
    fetchData(); // Call the fetchData function when the component mounts
    }, []); // Empty dependency array means this effect runs once after the first render

    return (
        <div className="bg-white shadow-md rounded-md p-6">
            <h1 className="text-2xl font-bold mb-4">Products Page</h1>
            <div className="mb-4">
                <Link href="/dashboard/userproducts/create">
                    <span className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Add Product</span>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product:any, index) => (
                    <div key={index} className="bg-gray-100 rounded-md p-4 flex flex-col justify-between">
                        <div>
                            <h2 className="text-lg font-semibold mb-2">{product.ProductName}</h2>
                            <p className="text-sm mb-2">Model: {product.Model}</p>
                            <p className="text-sm mb-2">Manufacturer: {product.Manufacturer}</p>
                            <p className="text-sm mb-2">Description: {product.Description}</p>
                            <p className="text-sm mb-2">Price: {formatCurrency(product.Price)}</p>
                            <p className="text-sm">Warranty Details: {product.WarrantyDetails}</p>
                        </div>
                        <div className="mt-4 flex justify-between">
                        <div className="flex space-x-4">
                            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Edit</button>
                            <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
                        </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
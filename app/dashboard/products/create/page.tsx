'use client';
import { useState } from 'react';
import axios from 'axios';
import { redirect } from 'next/navigation';

function Create() {
    const [formData, setFormData] = useState({
        ProductName: '',
        Model: '',
        Manufacturer: '',
        Description: '',
        Price: '',
        WarrantyDetails: '',
    });

    const { ProductName, Model, Manufacturer, Description, Price, WarrantyDetails } = formData;

    const onChange = (e:any) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e:any) => {
    e.preventDefault();

    const data = {
        ProductName,
        Model,
        Manufacturer,
        Description,
        Price,
        WarrantyDetails,
    };

    try {
        const token = localStorage.getItem('token');

        const response = await axios.post(
        'http://localhost:4000/api/product/create',
        data,
        {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        },
        );
        console.log(response);
      // Handle success, maybe show a success message
        redirect('/dashboard/userproducts');
    } catch (err) {
        console.error(err);
      // Handle error, maybe show an error message to the user
    }
    };

    return (
    <main className="flex h-screen items-center justify-center bg-gray-50">
        <div id="card" className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow-md">
            <div id="card-title" className="text-center">
                <h2 className="text-2xl font-bold">Add Product</h2>
                <div className="mx-auto mt-2 h-1 w-24 bg-blue-500"></div>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
                <label htmlFor="product-name" className="block">Product Name</label>
                <input
                    id="product-name"
                    type="text"
                    name="ProductName"
                    value={ProductName}
                    onChange={onChange}
                    className="w-full border-b-2 border-blue-500 py-1"
                    required
                />
                <label htmlFor="model" className="block">Model</label>
                <input
                    id="model"
                    type="text"
                    name="Model"
                    value={Model}
                    onChange={onChange}
                    className="w-full border-b-2 border-blue-500 py-1"
                    required
                />
                <label htmlFor="manufacturer" className="block">Manufacturer</label>
                <input
                    id="manufacturer"
                    type="text"
                    name="Manufacturer"
                    value={Manufacturer}
                    onChange={onChange}
                    className="w-full border-b-2 border-blue-500 py-1"
                    required
                />
                <label htmlFor="description" className="block">Description</label>
                <textarea
                    id="description"
                    name="Description"
                    value={Description}
                    onChange={onChange}
                    className="w-full border-b-2 border-blue-500 py-1"
                    rows={4}
                    required
                ></textarea>
                <label htmlFor="price" className="block">Price</label>
                <input
                    id="price"
                    type="number"
                    name="Price"
                    value={Price}
                    onChange={onChange}
                    className="w-full border-b-2 border-blue-500 py-1"
                    required
                />
                <label htmlFor="warranty-details" className="block">Warranty Details</label>
                <input
                    id="warranty-details"
                    type="text"
                    name="WarrantyDetails"
                    value={WarrantyDetails}
                    onChange={onChange}
                    className="w-full border-b-2 border-blue-500 py-1"
                    required
                />
                <div className="text-center">
                    <button type="submit" className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">Add Product</button>
                </div>
            </form>
        </div>
    </main>);
}

export default Create;

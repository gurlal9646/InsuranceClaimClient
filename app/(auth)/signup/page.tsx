'use client';
import { useState, useContext } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
// import AuthContext, { AuthContextType } from '@/context/AuthContext';
// import 'bootstrap/dist/css/bootstrap.min.css';

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
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const data = {
      Username,
      Password,
      CellphoneNo,
      Email,
      Name,
      Address,
    };

    try {
      const response = await axios.post(
        'https://insurance-claim-server.vercel.app/api/user/signup',
        data,
        config,
      );
      console.log('Response:', response.data);
      // Handle response as needed
      router.push('/posts'); // Redirect after successful submission
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  };
  return (
    <main className="flex h-screen items-center justify-center bg-gray-50">
      <div
        id="card"
        className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow-md"
      >
        <div id="card-title" className="text-center">
          <h2 className="text-2xl font-bold">User Registration</h2>
          <div className="mx-auto mt-2 h-1 w-24 bg-blue-500"></div>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <label htmlFor="username" className="block">
            Username
          </label>
          <input
            id="username"
            type="text"
            name="Username"
            value={Username}
            onChange={onChange}
            className="w-full border-b-2 border-blue-500 py-1"
            required
          />
          <label htmlFor="password" className="block">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="Password"
            value={Password}
            onChange={onChange}
            className="w-full border-b-2 border-blue-500 py-1"
            required
          />
          <label htmlFor="cellphone" className="block">
            Cellphone Number
          </label>
          <input
            id="cellphone"
            type="text"
            name="CellphoneNo"
            value={CellphoneNo}
            onChange={onChange}
            className="w-full border-b-2 border-blue-500 py-1"
            required
          />
          <label htmlFor="email" className="block">
            Email address
          </label>
          <input
            id="email"
            type="email"
            name="Email"
            value={Email}
            onChange={onChange}
            className="w-full border-b-2 border-blue-500 py-1"
            required
          />
          <label htmlFor="name" className="block">
            Name
          </label>
          <input
            id="name"
            type="text"
            name="Name"
            value={Name}
            onChange={onChange}
            className="w-full border-b-2 border-blue-500 py-1"
            required
          />
          <label htmlFor="address" className="block">
            Address
          </label>
          <input
            id="address"
            type="text"
            name="Address"
            value={Address}
            onChange={onChange}
            className="w-full border-b-2 border-blue-500 py-1"
            required
          />
          <br />
          <div className="text-center">
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Sign Up
            </button>
          </div>
          <br />
          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500">
              Login
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}

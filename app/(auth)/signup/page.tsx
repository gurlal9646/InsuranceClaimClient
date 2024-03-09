'use client';
import { useState, useContext } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
// import AuthContext, { AuthContextType } from '@/context/AuthContext';
// import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
    // const auth = useContext(AuthContext) as AuthContextType;
    const router = useRouter();
    const [formData2, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
    });

    const { name, email, password, password2 } = formData2;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFormData({ ...formData2, [e.target.name]: e.target.value });

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const data = {
        name: name,
        email: email,
        password: password,
    };
    try {
        const response = await axios.post('http://localhost:5000/api/users', data, config);
        localStorage.setItem('token', response.data.token);

        const decodeddata = jwtDecode(response.data.token);
        console.log(decodeddata);
        // auth.login();
        router.push('/posts');
    } catch (e: any) {
        console.log('error ', e.message);
    }
};
return (
    <div className="container mx-auto mt-5">
        <div className="flex justify-center">
            <div className="w-full md:w-1/2">
                <div className="bg-white shadow-md rounded-md p-6">
                    <h2 className="text-xl font-bold mb-4">User Registration Form</h2>
                    <form>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                            <input type="text" className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:ring-blue-500" id="username" placeholder="Enter username" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:ring-blue-500" id="password" placeholder="Enter password" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="cellphone" className="block text-sm font-medium text-gray-700">Cellphone Number</label>
                            <input type="text" className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:ring-blue-500" id="cellphone" placeholder="Enter cellphone number" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
                            <input type="email" className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:ring-blue-500" id="email" aria-describedby="emailHelp" placeholder="Enter email" />
                            <small id="emailHelp" className="block text-xs text-gray-500">We'll never share your email with anyone else.</small>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                            <input type="text" className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:ring-blue-500" id="name" placeholder="Enter name" />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                            <input type="text" className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring focus:ring-blue-500" id="address" placeholder="Enter address" />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
);
}


export default Register;

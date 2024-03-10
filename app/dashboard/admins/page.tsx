'use client';
import { formatDateToLocal } from '@/app/lib/utils';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Page() {
    const [users, setUsers] = useState([]);
    // Fetch data from the API
    const fetchData = async () => {
        try {
            // Get token from localStorage
            const token = localStorage.getItem('token');

            // Make sure token exists
            if (token) {
                try {
                    const response = await axios.get(`https://insurance-claim-server.vercel.app/api/user/adminlist`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
            
                    if (response.status === 200) {
                        const data = response.data; // Axios already parses JSON
                        setUsers(data); // Set products data to state
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

    const handleDelete = async (userId: any) => {
        // Show a confirmation dialog using SweetAlert
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this admin!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Get token from localStorage
                    const token = localStorage.getItem('token');
                    
                    // Make sure token exists
                    if (token) {
                        // Call the API to delete the user product
                        const response = await axios.delete(`https://insurance-claim-server.vercel.app/api/user/delete/${userId}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (response.status === 200) {
                            // If the deletion is successful, update the products state to reflect the change
                               fetchData();       
                          Swal.fire('Deleted!', 'Your admin has been deleted.', 'success');
                        } else {
                            Swal.fire('Error!', 'Failed to delete the admin.', 'error');
                        }
                    } else {
                        console.error('Token not found in localStorage');
                    }
                } catch (error) {
                    console.error('Error deleting admin:', error);
                    Swal.fire('Error!', 'Failed to delete the admin.', 'error');
                }
            }
        });
    };

    return (
        <div className="bg-white shadow-md rounded-md p-6">
            <h1 className="text-2xl font-bold mb-4">Admins</h1>
            <div className="mb-4">
                <Link href="/dashboard/admins/create">
                    <span className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-500">Add Admin</span>
                </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {users.map((user:any, index) => (
                    <div key={index} className="bg-gray-100 rounded-md p-4 flex items-center justify-between">
                        <div>
                            <p className="text-lg font-semibold">Name: {user.Name}</p>
                            <p className="text-sm">Username: {user.Username}</p>
                            <p className="text-sm">Email: {user.Email}</p>
                            <p className="text-sm">CellPhone: {user.CellphoneNo}</p>
                            <p className="text-sm">Address: {user.Address}</p>
                            <p className="text-sm">Created Date: {formatDateToLocal(user.createdAt)}</p>

                        </div>
                        <div className="flex space-x-4">
                            <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600" onClick={() => handleDelete(user.UserID)}>
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

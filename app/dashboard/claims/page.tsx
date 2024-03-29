'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Swal from 'sweetalert2';
import axios from 'axios';
import { formatDateToLocal } from '@/app/lib/utils';

export default function Page() {
  const [claims, setClaims] = useState([]);
  const [roleId, setRoleId] = useState('0'); // Add roleId state

  const fetchData = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');

      // Make sure token exists
      if (token) {
        const response = await axios.get(
          'https://insurance-claim-server.vercel.app/api/claims/list',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.status == 200) {
          const data = response.data;
          setClaims(data); // Set claims data to state
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
  useEffect(() => {
    fetchData(); // Call the fetchData function when the component mounts
    // Retrieve roleId from localStorage
    const userRoleId = localStorage.getItem('roleId');
    if (userRoleId) {
      setRoleId(userRoleId);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500 text-white';
      case 'Rejected':
        return 'bg-red-500 text-white';
      case 'Pending':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-500 text-white'; // Default color
    }
  };

  const handleDelete = async (claimId: any) => {
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
              `https://insurance-claim-server.vercel.app/api/claims/delete/${claimId}`,
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

  const handleClaimStatus = async (claimId: any, status: any) => {
    // Show a confirmation dialog using SweetAlert
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to change the status for this claim!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, change it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Get token from localStorage
          const token = localStorage.getItem('token');

          // Make sure token exists
          if (token) {
            const data = { Status: status };
            // Call the API to delete the user product
            const response = await axios.put(
              `https://insurance-claim-server.vercel.app/api/claims/updateClaimStatus/${claimId}`,
              data,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (response.status === 200) {
              // If the deletion is successful, update the products state to reflect the change
              fetchData();
              Swal.fire({
                text: response.data,
                icon: 'success',
                showConfirmButton: false,
                timer: 3000,
              });
            } else {
              Swal.fire(
                'Error!',
                'Failed to change the claim status.',
                'error',
              );
            }
          } else {
            console.error('Token not found in localStorage');
          }
        } catch (error) {
          console.error('Error updating claim status:', error);
          Swal.fire('Error!', 'Failed to change the claim status.', 'error');
        }
      }
    });
  };

  return (
    <div className="rounded-md bg-white p-6 shadow-md">
      <h1 className="mb-4 text-2xl font-bold">Claims</h1>
      {roleId === '2' && (
        <div className="mb-4">
          <Link href="/dashboard/claims/create">
            <span className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-500">
              Add Claim
            </span>
          </Link>
        </div>
      )}

      <div className="overflow-x-auto">
        {claims.map((claim: any, index) => (
          <div
            key={index}
            className={`${
              index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
            } mb-4 flex items-center justify-between rounded-md p-4`}
          >
            <div>
              <p className="text-lg font-semibold">
                Claim Date: {formatDateToLocal(claim.DateOfClaim)}
              </p>
              <p className="text-sm">Description: {claim.Description}</p>
              <p className="text-sm">
                <span
                  className={`inline-block rounded px-2 py-1 uppercase ${getStatusColor(
                    claim.Status,
                  )}`}
                >
                  {claim.Status}
                </span>
              </p>{' '}
            </div>
            {roleId === '2' && (
              <div className="flex space-x-4">
                <Link
                  className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  href={`/dashboard/claims/${claim.ClaimId}/edit`}
                >
                  <PencilIcon className="h-5 w-5" />
                </Link>
                <button
                  className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                  onClick={() => handleDelete(claim.ClaimId)}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
                {/* Approve and Reject buttons */}
              </div>
            )}
            {roleId === '1' && (
              <div className="flex space-x-4">
                {claim.Status === 'Pending' && (
                  <div>
                    <button
                      className="mr-5 rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                      onClick={() =>
                        handleClaimStatus(claim.ClaimId, 'Approved')
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                      onClick={() =>
                        handleClaimStatus(claim.ClaimId, 'Rejected')
                      }
                    >
                      Reject
                    </button>
                  </div>
                )}

                {claim.Status === 'Rejected' && (
                  <button
                    className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                    onClick={() => handleClaimStatus(claim.ClaimId, 'Approved')}
                  >
                    Approve
                  </button>
                )}

                {claim.Status === 'Approved' && (
                  <button
                    className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    onClick={() => handleClaimStatus(claim.ClaimId, 'Rejected')}
                  >
                    Reject
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

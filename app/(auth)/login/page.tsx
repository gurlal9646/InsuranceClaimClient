'use client';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    Username: '',
    Password: '',
  });

  // const auth = useContext(AuthContext) as AuthContextType;
  const { Username, Password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let formValid = true;
    if (Username === '') {
      formValid = false;
    }

    if (formValid) {
      const data = {
        Username: Username,
        Password: Password,
      };
      try {
        const response = await axios.post(
          'https://insurance-claim-server.vercel.app/api/user/login',
          data,
        );
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('roleId', response.data.RoleID);
          localStorage.setItem('userId', response.data.UserID);
          router.push('/dashboard/claims');
        } else {

            // Handle other errors
            Swal.fire({
              text: response.data,
              icon: 'error',
              showConfirmButton: false,
              timer: 3000,
            });
          
        }
      } catch (err: any) {
        if (err.response.status === 401) {
          Swal.fire({
            text: err.response.data,
            icon: 'error',
            showConfirmButton: false,
            timer: 3000,
          });
        } else {
          console.log(err);
          Swal.fire({
            text: 'An error occurred',
            icon: 'error',
            showConfirmButton: false,
            timer: 3000,
          });
        }
      }
    }
  };
  return (
    <main className="flex h-screen items-center justify-center bg-gray-50">
      <div
        id="card"
        className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow-md"
      >
        <div id="card-title" className="text-center">
          <h2 className="text-2xl font-bold">LOGIN</h2>
          <div className="mx-auto mt-2 h-1 w-24 bg-blue-500"></div>
        </div>
        <form onSubmit={(e) => onSubmit(e)} className="space-y-4">
          <label htmlFor="user-email" className="block">
            Email/Username
          </label>
          <input
            id="user-email"
            type="text"
            name="Username"
            value={Username}
            onChange={(e) => onChange(e)}
            className="w-full border-b-2 border-blue-500 py-1"
            required
          />
          <label htmlFor="user-password" className="block">
            Password
          </label>
          <input
            id="user-password"
            type="password"
            name="Password"
            value={Password}
            onChange={(e) => onChange(e)}
            className="w-full border-b-2 border-blue-500 py-1"
            required
          />
          {/* <a href="#" className="text-sm text-blue-500 hover:underline">
            Forgot password?
          </a> */}
          <br />
          <div className="text-center">
            <button
              type="submit"
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              LOGIN
            </button>
          </div>
          <br />
          <p className="text-center text-gray-600">
            Don't have an account yet?
            <a href="/signup" className="text-blue-500">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}

"use client";
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    Username: "",
    Password: "",
  });

  // const auth = useContext(AuthContext) as AuthContextType;
  const { Username, Password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(Username);

    let formValid = true;
    const emailPattern = "";
    if (Username === "") {
      formValid = false;
    }

    if (formValid) {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const data = {
        Username: Username,
        Password: Password,
      };
      console.log(data);
      try {
        const response = await axios.post(
          "https://insurance-claim-server.vercel.app/api/user/login",
          data,
          config
        );
        console.log(response);
        localStorage.setItem("token", response.data);
        router.push("/dashboard"); //<-need to change this later
      } catch (err: any) {
        console.log(err);
      }
    }
  };
  return (
    <main className="h-screen flex items-center justify-center bg-gray-50">
      <div id="card" className="bg-white rounded-lg shadow-md p-8 max-w-md w-full space-y-4">
        <div id="card-title" className="text-center">
          <h2 className="text-2xl font-bold">LOGIN</h2>
          <div className="h-1 w-24 bg-blue-500 mx-auto mt-2"></div>
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
            className="border-b-2 border-blue-500 w-full py-1"
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
            className="border-b-2 border-blue-500 w-full py-1"
            required
          />
          {/* <a href="#" className="text-sm text-blue-500 hover:underline">
            Forgot password?
          </a> */}
          <br/>
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              LOGIN
            </button>
          </div>
          <br/>
          <a href="/signup" className="text-sm text-gray-600">
            Don't have an account yet? Sign up
          </a>
        </form>
      </div>
    </main>
  );
}

export default Login;

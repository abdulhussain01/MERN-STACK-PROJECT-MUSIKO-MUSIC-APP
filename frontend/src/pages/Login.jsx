import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchUser} from "../store/slices/user.slice";
import { toast } from "react-toastify";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateTo = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      navigateTo("/", { replace: true });
      
    }
  }, [isAuthenticated, dispatch]);

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        window.location.href = "/";
        dispatch(fetchUser());
        toast.success(data.message);
      }
    } catch (err) {
   

      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="h-full  flex  flex-col lg:flex-row-reverse items-center  flex-1  ">
      <div className="p-5 m-auto ">
        <img src="/login.svg" alt="" className="w-72 h-72 lg:w-96 lg:h-96" />
      </div>
      <div className="w-full px-10 sm:p-0 sm:max-w-96  m-auto flex flex-col gap-4">
        <h1 className="text-center text-4xl font-bold">Login</h1>
        <div className="relative">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50  border-0 border-b-2 border-gray-300 appearance-none dark:text-commonwhite  focus:outline-none focus:ring-0  peer"
            placeholder=" "
          />
          <label
            htmlFor="email"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Email
          </label>
        </div>
        <div className="relative">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block rounded-lg px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50  border-0 border-b-2 border-gray-300 appearance-none dark:text-commonwhite  focus:outline-none focus:ring-0  peer"
            placeholder=" "
          />
          <label
            htmlFor="password"
            className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4  origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Password
          </label>
        </div>

        <Link to={"/forgotpassword"} className="hover:text-primary">
          {" "}
          Forgot your password ?
        </Link>

        <button
          className="px-4 py-3 bg-primary rounded-lg text-white text-lg font-bold"
          onClick={handleLogin}
        >
          Login
        </button>

        <div className=" flex items-center justify-center gap-2">
          <p>Don&#39;t have an account?</p>
          <Link to={"/signup"} className="hover:text-primary font-bold">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import apiRequest from '../../utils/apiRequest';
import useAuthStore from '../../store/authStore';

const Login = () => {
    const { loginUser, setToken } = useAuthStore();
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        apiRequest
            .get('/auth/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                loginUser(res.data);
                navigate('/');
            })
            .catch((err) => console.log(err));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email').required('This field is required'),
            password: Yup.string()
                .min(6, 'Requires at least 6 characters')
                .max(12, 'Does not exceed 12 characters')
                .required('This field is required'),
        }),
        onSubmit: (values) => {
            toast.promise(apiRequest.post('/auth/admin/login', { ...values }), {
                loading: 'Login...',
                success: (res) => {
                    loginUser(res.data.user);
                    setToken(res.data.token);
                    return <span>{res.data.message}</span>;
                },
                error: (error) => {
                    return <span>{error.response.data.error}</span>;
                },
            });
        },
    });

    return (
        <div className="flex h-screen w-screen items-center">
            <div className="flex h-[70%] w-full flex-1 items-center justify-center">
                <div className="flex h-full min-w-[60%] flex-col justify-center">
                    <form onSubmit={formik.handleSubmit} className="w-full">
                        <div className="mb-10">
                            <h2 className="text-center text-2xl font-semibold">Admin Login</h2>
                            <p className="text-center text-sm">Enter your email and password to login</p>
                        </div>
                        <div className="mb-4">
                            <label className="relative block pb-4 pt-4">
                                <input
                                    type="email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Email"
                                    className="w-full border-b py-2 pl-2 outline-none transition-colors duration-500 placeholder:font-light focus:border-b-black"
                                />
                                {formik.errors.email && (
                                    <span className="absolute left-0 top-0 text-sm text-[#d10202dc]">
                                        {formik.errors.email}
                                    </span>
                                )}
                            </label>
                            <label className="relative block pb-2 pt-4">
                                <div className="relative">
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full border-b py-2 pl-2 outline-none transition-colors duration-500 placeholder:font-light focus:border-b-black [&:not(:placeholder-shown)+span]:block"
                                    />
                                    <span
                                        className="absolute right-4 top-1/2 hidden -translate-y-1/2 cursor-pointer"
                                        onClick={() => setShowPass(!showPass)}
                                    >
                                        {showPass ? (
                                            <i className="fa-light fa-eye"></i>
                                        ) : (
                                            <i className="fa-light fa-eye-slash"></i>
                                        )}
                                    </span>
                                </div>
                                {formik.errors.password && (
                                    <span className="absolute left-0 top-0 text-sm text-[#d10202dc]">
                                        {formik.errors.password}
                                    </span>
                                )}
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="block w-full border border-black bg-black p-4 text-sm uppercase text-white transition-colors hover:bg-white hover:text-black "
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
            <div className="h-full w-1/2">
                <img
                    src="https://demos.creative-tim.com/material-tailwind-dashboard-react/img/pattern.png"
                    alt=""
                    className="h-full w-full object-cover"
                />
            </div>
        </div>
    );
};

export default Login;

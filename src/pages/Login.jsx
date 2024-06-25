import apiRequest from '../utils/apiRequest';
import useAuthStore from '../store/authStore';
import { Link, useLocation, useNavigate, useNavigation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import nProgress from 'nprogress';

const Login = () => {
    const { currentUser, loginUser, setToken } = useAuthStore();
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const navigation = useNavigation();

    useEffect(() => {
        if (currentUser?._id) {
            navigate('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    console.log('LOGIN PAGE');

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            remember: false,
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email').required('This field is required'),
            password: Yup.string()
                .min(6, 'Requires at least 6 characters')
                .max(12, 'Does not exceed 12 characters')
                .required('This field is required'),
            remember: Yup.bool(),
        }),
        onSubmit: (values) => {
            nProgress.start();
            toast.promise(
                apiRequest.post('/auth/login', { ...values }),
                {
                    loading: 'Login...',
                    success: (res) => {
                        nProgress.done();
                        loginUser(res.data.user);
                        setToken(res.data.token);
                        if (location.state?.from) {
                            navigate(location.state.from);
                        }
                        return res.data.message;
                    },
                    error: (error) => {
                        return error.response.data.error;
                    },
                },
                {
                    success: {
                        icon: '👏',
                    },
                },
            );
        },
    });

    useEffect(() => {
        if (navigation.state == 'loading') {
            nProgress.start();
        } else {
            nProgress.done();
        }
    }, [navigation.state]);

    return (
        <div className="flex h-screen w-screen items-center">
            <div className="relative h-full w-1/2">
                <div className="absolute left-[10%] top-[15%]">
                    <h3 className="text-3xl font-bold text-white">Turn your ideas into reality</h3>
                    <p className="mb-2 text-white">Good design is good business.</p>
                </div>
                <img
                    src="https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1527&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt=""
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="flex h-[70%] w-full flex-1 items-center justify-center">
                <div className="flex h-full min-w-[60%] flex-col justify-between">
                    <Link to="/" className="w-32">
                        <img src="/images/logo.png" alt="" className="w-full object-cover" />
                    </Link>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-10">
                            <h2 className="text-2xl font-semibold">Login</h2>
                            <p className="text-sm">Welcome back! Please enter your account</p>
                        </div>
                        <div className="mb-4">
                            <label className="relative block pb-2 pt-4">
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
                        <label className="mb-4 flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                name="remember"
                                value={formik.values.remember}
                                onChange={formik.handleChange}
                                className="size-4 rounded-none accent-black outline-none"
                            />
                            <span className="text-sm">Remember me for 30 days</span>
                        </label>
                        <button
                            type="submit"
                            className="block w-full border border-black bg-black p-4 text-sm uppercase text-white transition-colors hover:bg-white hover:text-black "
                        >
                            Login
                        </button>
                    </form>
                    <span className="block text-center text-sm">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="hover-text-effect">
                            Sign up
                        </Link>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;

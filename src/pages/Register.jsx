import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import apiRequest from '../utils/apiRequest';
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [file, setFile] = useState();
    const previewAvatar = useRef();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            dateOfBirth: '',
            // avatar: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email').required('This field is required'),
            password: Yup.string()
                .min(6, 'Requires at least 6 characters')
                .max(12, 'Does not exceed 12 characters')
                .required('This field is required'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Password must match')
                .required('This field is required'),
            firstName: Yup.string().required('This field is required'),
            lastName: Yup.string().required('This field is required'),
            phoneNumber: Yup.string().required('This field is required'),
            dateOfBirth: Yup.date(),
            // avatar: Yup.mixed().required(),
        }),
        onSubmit: (values) => {
            const formData = new FormData();
            for (const key in values) {
                if (key != 'confirmPassword') formData.append(key, values[key]);
            }
            formData.append('avatar', file);
            toast.promise(apiRequest.post('/auth/register', formData), {
                loading: 'Registering...',
                success: (res) => {
                    toast.success("You'r ready to login");
                    navigate('/login');
                    return res.data.message;
                },
                error: (err) => {
                    console.log(err);
                    return err.response.data.error || 'Something went wrong';
                },
            });
        },
    });

    return (
        <div className="relative flex h-screen w-screen items-center justify-center">
            <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
                className="absolute left-0 top-0 -z-10 h-full w-full object-cover"
            />
            <div className="min-h-[90%] w-2/3 bg-white shadow-xl">
                <Link to="/" className="mx-auto mb-6 block w-40 py-8">
                    <img src="src/assets/images/logo.png" alt="" />
                </Link>
                {/* <h3 className="text-center text-2xl font-semibold">Registration</h3>
                <p className="mb-4 text-center text-sm">Welcome to Fixtures</p> */}
                <form onSubmit={formik.handleSubmit} className="mx-auto w-2/3">
                    <div className="flex items-center gap-10">
                        <label className="relative block flex-1 pb-2 pt-4">
                            <input
                                type="text"
                                name="firstName"
                                value={formik.values.firstName}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                placeholder="First name"
                                className="w-full border-b py-2 pl-2 outline-none transition-colors duration-500 placeholder:font-light focus:border-b-black"
                            />
                            {formik.errors.firstName && (
                                <span className="absolute left-0 top-0 text-sm text-[#d10202dc]">
                                    {formik.errors.firstName}
                                </span>
                            )}
                        </label>
                        <label className="relative block flex-1 pb-2 pt-4">
                            <input
                                type="text"
                                name="lastName"
                                value={formik.values.lastName}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                placeholder="Last name"
                                className="w-full border-b py-2 pl-2 outline-none transition-colors duration-500 placeholder:font-light focus:border-b-black"
                            />
                            {formik.errors.lastName && (
                                <span className="absolute left-0 top-0 text-sm text-[#d10202dc]">
                                    {formik.errors.lastName}
                                </span>
                            )}
                        </label>
                    </div>
                    <div className="flex items-center gap-10">
                        <label className="relative block flex-1 pb-2 pt-4">
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formik.values.phoneNumber}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                placeholder="Phone number"
                                className="w-full border-b py-2 pl-2 outline-none transition-colors duration-500 placeholder:font-light focus:border-b-black"
                            />
                            {formik.errors.phoneNumber && (
                                <span className="absolute left-0 top-0 text-sm text-[#d10202dc]">
                                    {formik.errors.phoneNumber}
                                </span>
                            )}
                        </label>
                        <label className="relative block flex-1 pb-2 pt-4">
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formik.values.dateOfBirth}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                placeholder="Date of birth"
                                className="w-full border-b py-2 pl-2 outline-none transition-colors duration-500 placeholder:font-light focus:border-b-black"
                            />
                            {formik.errors.dateOfBirth && (
                                <span className="absolute left-0 top-0 text-sm text-[#d10202dc]">
                                    {formik.errors.dateOfBirth}
                                </span>
                            )}
                        </label>
                    </div>
                    <div className="flex items-center gap-10">
                        <label className="relative block flex-1 pb-2 pt-4">
                            <input
                                type="email"
                                name="email"
                                value={formik.values.email}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                placeholder="Email"
                                className="w-full border-b py-2 pl-2 outline-none transition-colors duration-500 placeholder:font-light focus:border-b-black"
                            />
                            {formik.errors.email && (
                                <span className="absolute left-0 top-0 text-sm text-[#d10202dc]">
                                    {formik.errors.email}
                                </span>
                            )}
                        </label>
                        <label className="relative block flex-1 pb-2 pt-4">
                            <input
                                type="file"
                                name="avatar"
                                id="avatar"
                                accept="image/*"
                                onChange={(e) => {
                                    previewAvatar.current.src = URL.createObjectURL(e.currentTarget.files[0]);
                                    setFile(e.currentTarget.files[0]);
                                }}
                                className="hidden w-full border-b py-2 pl-2 outline-none transition-colors duration-500 placeholder:font-light focus:border-b-black"
                            />
                            <label htmlFor="avatar" className="flex cursor-pointer items-center gap-2">
                                <span className="size-20 border border-dashed border-black">
                                    <img
                                        ref={previewAvatar}
                                        src="src/assets/images/select-image.png"
                                        alt=""
                                        className="size-full object-contain p-1"
                                    />
                                </span>
                                <span className="text-sm">Select your avatar</span>
                            </label>
                            {formik.errors.avatar && (
                                <span className="absolute left-0 top-0 text-sm text-[#d10202dc]">
                                    {formik.errors.avatar}
                                </span>
                            )}
                        </label>
                    </div>
                    <div className="flex items-center gap-10">
                        <label className="relative block flex-1 pb-2 pt-4">
                            <input
                                type="password"
                                name="password"
                                value={formik.values.password}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                placeholder="Password"
                                className="w-full border-b py-2 pl-2 outline-none transition-colors duration-500 placeholder:font-light focus:border-b-black"
                            />
                            {formik.errors.password && (
                                <span className="absolute left-0 top-0 text-sm text-[#d10202dc]">
                                    {formik.errors.password}
                                </span>
                            )}
                        </label>
                        <label className="relative block flex-1 pb-2 pt-4">
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formik.values.confirmPassword}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                placeholder="Confirm password"
                                className="w-full border-b py-2 pl-2 outline-none transition-colors duration-500 placeholder:font-light focus:border-b-black"
                            />
                            {formik.errors.confirmPassword && (
                                <span className="absolute left-0 top-0 text-sm text-[#d10202dc]">
                                    {formik.errors.confirmPassword}
                                </span>
                            )}
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="mt-6 block w-full border border-black bg-black py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black"
                    >
                        Sign up
                    </button>
                </form>
                <p className="mt-6 text-center text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="hover-text-effect ml-1">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import apiRequest from '../utils/apiRequest';
import { useEffect, useRef } from 'react';
import { Link, useNavigate, useNavigation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import nProgress from 'nprogress';

const Register = () => {
    const previewAvatar = useRef();
    const loginLink = useRef();
    const { currentUser } = useAuthStore();
    const navigate = useNavigate();
    const navigation = useNavigation();

    useEffect(() => {
        if (currentUser?._id) {
            navigate('/');
        }
        document.title = 'Register';
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            avatar: '',
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
            avatar: Yup.mixed(),
        }),
        onSubmit: (values) => {
            const formData = new FormData();
            for (const key in values) {
                if (key != 'confirmPassword') formData.append(key, values[key]);
            }
            toast.promise(apiRequest.post('/auth/register', formData), {
                loading: 'Registering...',
                success: (res) => {
                    loginLink.current.click();
                    toast.success("You'r ready to login");
                    return res.data.message;
                },
                error: (err) => {
                    console.log(err);
                    return err.response.data.error || 'Something went wrong';
                },
            });
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
        <div className="relative flex h-screen w-screen items-center justify-center">
            <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
                className="absolute left-0 top-0 -z-10 h-full w-full object-cover"
            />
            <div className="h-full w-full overflow-y-auto bg-white py-4 shadow-xl lg:h-[90%] lg:w-2/3">
                <Link to="/" className="mx-auto mt-6 block w-24 py-2 lg:w-40 lg:py-8">
                    <img src="/images/logo.png" alt="" />
                </Link>
                {/* <h3 className="text-center text-2xl font-semibold">Registration</h3>*/}
                <p className="mb-4 text-center text-sm">Welcome to Fixtures</p>
                <form onSubmit={formik.handleSubmit} className="mx-auto w-4/5 text-sm lg:w-2/3 lg:text-base">
                    <label className="relative block flex-1 pb-2 pt-4 lg:hidden">
                        <input
                            type="file"
                            name="avatar"
                            id="avatar"
                            accept="image/*"
                            onChange={(e) => {
                                previewAvatar.current.src = URL.createObjectURL(e.currentTarget.files[0]);
                                // setFile(e.currentTarget.files[0]);
                                formik.setFieldValue('avatar', e.currentTarget.files[0]);
                            }}
                            className="hidden w-full border-b py-2 pl-2 outline-none transition-colors duration-500 placeholder:font-light focus:border-b-black"
                        />
                        <label htmlFor="avatar" className="flex cursor-pointer items-center gap-4">
                            <span className="size-32 overflow-hidden rounded-full border">
                                <img
                                    ref={previewAvatar}
                                    src="/images/account-placeholder.jpg"
                                    alt=""
                                    className="size-full object-cover object-center p-1"
                                />
                            </span>
                            <div className="flex flex-col items-center">
                                <i className="fa-light fa-cloud-arrow-up text-xl"></i>
                                <span className="text-sm">Select your avatar</span>
                            </div>
                        </label>
                        {formik.errors.avatar && (
                            <span className="absolute left-0 top-0 text-sm text-[#d10202dc]">
                                {formik.errors.avatar}
                            </span>
                        )}
                    </label>
                    <div className="flex items-center gap-4 lg:gap-10">
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
                    <div className="flex flex-col-reverse items-start justify-between gap-10 lg:flex-row lg:items-center">
                        <div className="w-full flex-1">
                            <label className="relative block w-full flex-1 pb-2 pt-4">
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
                            <label className="relative block  w-full flex-1 pb-2 pt-4">
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
                        </div>
                        <label className="relative hidden flex-1 pb-2 pt-4 lg:block">
                            <input
                                type="file"
                                name="avatar"
                                id="avatar"
                                accept="image/*"
                                onChange={(e) => {
                                    previewAvatar.current.src = URL.createObjectURL(e.currentTarget.files[0]);
                                    // setFile(e.currentTarget.files[0]);
                                    formik.setFieldValue('avatar', e.currentTarget.files[0]);
                                }}
                                className="hidden w-full border-b py-2 pl-2 outline-none transition-colors duration-500 placeholder:font-light focus:border-b-black"
                            />
                            <label htmlFor="avatar" className="flex cursor-pointer items-center gap-4">
                                <span className="size-32 overflow-hidden rounded-full border">
                                    <img
                                        ref={previewAvatar}
                                        src="/images/account-placeholder.jpg"
                                        alt=""
                                        className="size-full object-cover object-center p-1"
                                    />
                                </span>
                                <div className="flex flex-col items-center">
                                    <i className="fa-light fa-cloud-arrow-up text-xl"></i>
                                    <span className="text-sm">Select your avatar</span>
                                </div>
                            </label>
                            {formik.errors.avatar && (
                                <span className="absolute left-0 top-0 text-sm text-[#d10202dc]">
                                    {formik.errors.avatar}
                                </span>
                            )}
                        </label>
                    </div>
                    <div className="flex items-center gap-4 lg:gap-10">
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
                        className="mt-6 block w-full border border-black bg-black py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black lg:text-sm"
                    >
                        Sign up
                    </button>
                </form>
                <p className="mt-6 text-center text-sm">
                    Already have an account?{' '}
                    <Link ref={loginLink} to={`/login` + location.search} className="hover-text-effect ml-1">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;

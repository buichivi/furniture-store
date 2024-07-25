import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="border-t bg-[#fff] pt-20">
            <div className="mb-20 text-center">
                <h3 className="mb-4 text-lg font-bold uppercase tracking-wide lg:mb-[30px] lg:text-2xl">
                    SIGN UP FOR EMAILS
                </h3>
                <p className="mb-[30px] text-sm tracking-wide lg:text-base">
                    Enjoy 15% off* your first order when sign up to our newsletter
                </p>
                <div className="mb-8 flex h-12 justify-center px-12 text-sm lg:h-[50px] lg:px-0 lg:text-base">
                    <input
                        type="email"
                        className="h-full max-w-[500px] flex-1 border-none bg-[#ededed] px-6 caret-slate-400 outline-none placeholder:text-[#868686]"
                        placeholder="Your e-mail address"
                    />
                    <button className="h-full w-[150px] shrink-0 bg-black py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#D10202]">
                        Subcribe
                    </button>
                </div>
            </div>
            <div className="container mx-auto mb-20 grid grid-cols-2 gap-x-4 gap-y-8 px-5 text-sm lg:grid-cols-4 lg:gap-y-4 lg:text-base">
                <div className="flex w-full flex-col gap-2 lg:gap-5 [&>*]:text-[#909090]">
                    <img src="/images/logo.png" alt="" className="mb-4 w-[150px] object-cover lg:w-[200px]" />
                    <span>Phone: (+ 84)826 127 626</span>
                    <span>Mon - Fri: 8 am - 8 pm</span>
                    <span>Sat - Sun: 8 am - 7 pm</span>
                </div>
                <div className="text-right lg:text-left">
                    <h3 className="mb-2 text-lg font-bold uppercase lg:mb-[30px] lg:text-xl">ABOUT</h3>
                    <div className="flex flex-col gap-2 lg:gap-4 [&>*]:capitalize [&>*]:text-[#909090]">
                        <div className="text-right lg:text-left">
                            <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">Our story</Link>
                        </div>
                        <div className="text-right lg:text-left">
                            <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">Careers</Link>
                        </div>
                        <div className="text-right lg:text-left">
                            <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">
                                Influencers
                            </Link>
                        </div>
                        <div className="text-right lg:text-left">
                            <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">
                                Join our team
                            </Link>
                        </div>
                    </div>
                </div>
                <div>
                    <h3 className="mb-2 text-lg font-bold uppercase lg:mb-[30px] lg:text-xl">CUSTOMER SERVICES</h3>
                    <div className="flex flex-col gap-2 lg:gap-4 [&>*]:capitalize [&>*]:text-[#909090]">
                        <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">Contact us</Link>
                        <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">
                            Customer service
                        </Link>
                        <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">Find store</Link>
                        <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">
                            Book appointment
                        </Link>
                        <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">
                            Shipping & returns
                        </Link>
                    </div>
                </div>
                <div className="text-right lg:text-left">
                    <h3 className="mb-2 text-lg font-bold uppercase lg:mb-[30px] lg:text-xl">DESIGN SERVICE</h3>
                    <div className="flex flex-col gap-2 lg:gap-4 [&>*]:capitalize [&>*]:text-[#909090]">
                        <div className="text-right lg:text-left">
                            <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">
                                Interior Design
                            </Link>
                        </div>
                        <div className="text-right lg:text-left">
                            <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">
                                Our Projects
                            </Link>
                        </div>
                        <div className="text-right lg:text-left">
                            <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">
                                Design Chat
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto flex h-auto flex-col items-center justify-between gap-2 border-t px-5 py-2 text-sm lg:h-[60px] lg:flex-row lg:gap-0">
                <div className="flex gap-8 [&>*]:text-lg [&>*]:hover:cursor-pointer lg:[&>*]:text-xl">
                    <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">
                        <i className="fa-brands fa-facebook-f"></i>
                    </Link>
                    <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">
                        <i className="fa-brands fa-x-twitter"></i>
                    </Link>
                    <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">
                        <i className="fa-brands fa-instagram"></i>
                    </Link>
                    <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">
                        <i className="fa-brands fa-pinterest"></i>
                    </Link>
                </div>
                <div className="mt-4 text-sm lg:mt-0 lg:text-base">
                    <span>© Fixtures. All Rights Reserved.</span>
                </div>
                <div>
                    <img src="https://nooni-be87.kxcdn.com/nooni/wp-content/uploads/2022/12/payment.png" alt="" />
                </div>
            </div>
        </div>
    );
};

export default Footer;

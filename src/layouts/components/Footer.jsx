import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <div className="border-t bg-[#fff] pt-20">
            <div className="mb-20 text-center">
                <h3 className="mb-[30px] text-2xl font-bold uppercase tracking-wide">SIGN UP FOR EMAILS</h3>
                <p className="mb-[30px] tracking-wide">
                    Enjoy 15% off* your first order when sign up to our newsletter
                </p>
                <div className="mb-8 flex h-[50px] justify-center">
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
            <div className="container mx-auto mb-20 grid grid-cols-4 gap-4 px-5">
                <div className="flex w-full flex-col gap-5 [&>*]:text-[#909090]">
                    <img src="/images/logo.png" alt="" className="mb-4 w-[70%] object-cover" />
                    <span>Phone: (+ 84)826 127 626</span>
                    <span>Mon - Fri: 8 am - 8 pm</span>
                    <span>Sat - Sun: 8 am - 7 pm</span>
                </div>
                <div>
                    <h3 className="mb-[30px] text-xl font-bold uppercase">ABOUT</h3>
                    <div className="flex flex-col gap-4 [&>*]:capitalize [&>*]:text-[#909090]">
                        <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">Our story</Link>
                        <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">Careers</Link>
                        <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">Influencers</Link>
                        <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">Join our team</Link>
                    </div>
                </div>
                <div>
                    <h3 className="mb-[30px] text-xl font-bold uppercase">CUSTOMER SERVICES</h3>
                    <div className="flex flex-col gap-4 [&>*]:capitalize [&>*]:text-[#909090]">
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
                <div className="">
                    <h3 className="mb-[30px] text-xl font-bold uppercase">DESIGN SERVICE</h3>
                    <div className="flex flex-col gap-4 [&>*]:capitalize [&>*]:text-[#909090]">
                        <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">
                            Interior Design
                        </Link>
                        <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">Our Projects </Link>
                        <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">Design Chat </Link>
                    </div>
                </div>
            </div>
            <div className="container mx-auto flex h-[60px] items-center justify-between border-t px-5 text-sm">
                {/* <div className="flex gap-9 [&>*]:capitalize">
                    <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">Privacy Policy</Link>
                    <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">Help</Link>
                    <Link className="inline-block w-fit transition-colors hover:text-[#D10202]">FAQs</Link>
                </div> */}
                <div className="flex gap-8 [&>*]:text-xl [&>*]:hover:cursor-pointer">
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
                <div>
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

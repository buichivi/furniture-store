import { Slider, SliderCategory } from "../components";

const Home = () => {
    return (
        <div className="">
            <div className="bg-main mb-[70px]">
                <div className="h-screen container mx-auto">
                    <Slider />
                </div>
            </div>
            <div className="container mx-auto mb-[70px]">
                <h3 className="uppercase font-bold text-3xl mb-[30px]">Shop by category</h3>
                <SliderCategory />
            </div>
        </div>
    );
};

export default Home;

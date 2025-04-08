import Image from "next/image";
import { headerData } from "../../data/about";
export default function Header() {
    return (
        <>
            <div className="relative w-full h-[500px]">
                {/* Background Image */}
                <Image
                    src="/images/justice.png"
                    alt="Header Background"
                    layout="fill"
                    objectFit="cover"
                    className="z-0"
                />
            </div>

            <div className="-mt-[350px] z-10 relative px-4 sm:px-8 md:px-16">
                <h1 className="text-5xl font-bold text-center mb-32 text-white text-[94px]">{headerData.title}</h1>
                <div className="bg-white rounded-lg shadow-lg max-w-7xl p-8 mx-auto text-center text-[22px]">
                    <p
                        className="mb-4 mx-auto font-raleway font-normal text-center"
                    >
                        {headerData.description1}
                    </p>

                    <div className="mt-8">
                        <h2 className="text-[64px] font-bold font-raleway text-[#007E7E] text-center">{headerData.subTitle}</h2>
                        <p className="mt-4 font-raleway font-normal text-center">
                            {headerData.description2}
                            <span className="text-teal-600"> read more</span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
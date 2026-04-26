const HelpSection = () => (
    <div className="mt-6 md:mt-8">
        <div className="flex justify-between items-center mb-4 md:mb-5">
            <h3 className="text-lg md:text-xl font-bold">Need Help?</h3>
            <button className="text-blue-400 text-sm md:text-base">Support Center &gt;</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            {/* Live Chat Card */}
            <div className="bg-[#1a1d24] p-5 md:p-6 rounded-2xl border border-gray-800 text-center flex flex-col items-center">
                <div className="bg-blue-900/20 p-3 md:p-4 rounded-xl mb-3 text-blue-500">
                    💬
                </div>
                <p className="font-bold text-sm md:text-base">Live Chat</p>
                <p className="text-gray-500 text-xs md:text-sm mt-1">Get instant help from our team</p>
            </div>

            {/* Email Support Card */}
            <div className="bg-[#1a1d24] p-5 md:p-6 rounded-2xl border border-gray-800 text-center flex flex-col items-center">
                <div className="bg-green-900/20 p-3 md:p-4 rounded-xl mb-3 text-green-500">
                    ✉️
                </div>
                <p className="font-bold text-sm md:text-base">Email Support</p>
                <p className="text-gray-500 text-xs md:text-sm mt-1">Send us a detailed message</p>
            </div>
        </div>
    </div>
);
export { HelpSection }
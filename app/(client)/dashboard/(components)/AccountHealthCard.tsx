const AccountHealthCard = () => (
    <div className="bg-[#1a1d24] p-4 rounded-2xl border border-gray-800">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="text-gray-400 text-sm font-medium">Account Health</h3>
                <p className="text-yellow-500 font-bold">Fair</p>
            </div>
            <div className="text-right">
                <p className="text-gray-400 text-xs">Balance Ratio</p>
                <p className="text-lg font-bold">12.9%</p>
            </div>
        </div>
        <div className="w-full bg-gray-700 h-2 rounded-full mt-4">
            <div className="bg-orange-500 h-2 rounded-full w-[12.9%]"></div>
        </div>
        <p className="text-gray-400 text-xs mt-3">
            <span className="text-white">$64,600.00</span> of $500,000.00 limit
        </p>
    </div>
);
export { AccountHealthCard }
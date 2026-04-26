const Achievements = () => (
    <div className="mt-4">
        <h3 className="text-lg font-bold mb-3">Achievements</h3>
        <div className="bg-[#1a1d24] p-4 rounded-2xl border border-gray-800 flex items-center gap-4">
            <div className="bg-green-900/20 p-3 rounded-xl">
                {/* Trophy Icon */}
                <span className="text-green-500 text-xl">🏆</span>
            </div>
            <div>
                <p className="font-bold text-sm">First Deposit</p>
                <p className="text-gray-400 text-xs">Great start to your financial journey!</p>
            </div>
        </div>
    </div>
);

export { Achievements }
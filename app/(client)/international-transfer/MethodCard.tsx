const MethodCard = ({ title, desc, icon: Icon, onClick }: any) => (
    <button
        onClick={onClick}
        className="w-full bg-[#1a1d24] p-4 rounded-2xl border border-gray-800 flex items-center gap-4 hover:border-blue-500 transition-all text-left group"
    >
        <div className="bg-blue-900/20 p-3 rounded-xl text-blue-500 group-hover:scale-110 transition-transform">
            <Icon size={24} />
        </div>
        <div className="flex-1">
            <h4 className="text-white font-bold text-sm">{title}</h4>
            <p className="text-gray-500 text-[10px] mt-1">{desc}</p>
        </div>
        <div className="text-gray-600 group-hover:text-white">→</div>
    </button>
);

export default MethodCard
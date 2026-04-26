export default function AddButton() {
  return (
    <div className="relative inline-flex items-center justify-center animate-pulse">
      
      {/* Dotted Outer Ring */}
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-blue-400/40 animate-pulse" />

      {/* Main Button */}
      <button
        className="relative w-14 h-14 rounded-full 
        bg-linear-to-br from-blue-500 via-blue-600/20 to-blue-700/20
        shadow-lg shadow-blue-900/40
        flex items-center justify-center
        text-white text-2xl font-light
        hover:scale-105 active:scale-95
        transition-all duration-300"
      >
        +
      </button>
    </div>
  );
}
import { ReactNode } from "react"

interface ButtonInfo {
    color: string,
    icon: ReactNode
    onClick: any
    title: string
}
export default function ButtonRounded({ color, icon, onClick, title }: ButtonInfo) {
    return <div className="flex justify-center flex-col text-center">
        <button
            className={`
                w-12 h-12 rounded-full flex justify-center items-center cursor-pointer
                shadow-[0_0_12px_2px_rgba(59,130,246,0.4)]
                transition-shadow duration-200
                hover:shadow-[0_0_20px_6px_rgba(59,130,246,0.7)]
                ${color}
            `}
            onClick={onClick}
        >
            {icon}
        </button>
        <p className="md:text-sm text-xs font-bold text-gray-200 mt-1">{title}</p>
    </div>
}
import { useNavigate } from "react-router-dom";

interface CardDashboardProps {
    text: string;
    value: number;
    link: string;
}

function CardDashboard({text,value,link}: CardDashboardProps) {
    const navigate = useNavigate();
    return (
        <div 
            onClick={() => navigate(link)} 
            className="flex flex-col cursor-pointer items-center justify-center text-center h-full rounded-xl py-4 px-2 text-white bg-gradient-to-r from-[#0E7E68]/80 to-[#2DCC71]"
        >
                <h2 className="text-sm md:text-xl">{text}</h2>
                <h3 className="text-xl">{value}</h3>
        </div>
    );
}

export default CardDashboard;
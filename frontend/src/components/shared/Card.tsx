interface CardAction {
    label: string;
    icon?: React.ReactNode;
    click?: () => void;
    bgColor: string;
}

interface CardProps {
    title: string;
    subtitle?: string;
    actions?: CardAction[];
    disable?: boolean
    index?: number;
    statusEvaluation?: string;
    wrongCategory?: boolean;
}

function Card({ title, subtitle, actions = [], disable = false, index, statusEvaluation, wrongCategory }: CardProps) {

    return (
        <div className="flex flex-col md:flex-row justify-between items-center w-full bg-[#E6E7E8] p-4 rounded-xl">
            {/* Contenedor izquierdo */}
            <div className="flex flex-col md:flex-row items-center md:items-center w-full md:w-auto">
                {/* Número */}
                {index !== undefined && (
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#00723F] text-white text-2xl font-bold mb-2 md:mb-0 md:mr-4">
                        {index}
                    </div>
                )}
                {/* Título y subtítulo */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                    <h3 className="text-2xl">{title}</h3>
                    <p>{subtitle}</p>
                </div>
            </div>

            {/* Botones */}
            <div className="flex flex-row items-center justify-center space-x-2 mt-3 md:mt-0">
                {wrongCategory && (
                    <div
                        className="flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full font-semibold text-sm"
                        title="Categoría incorrecta"
                    >
                        <h1 className="text-2xl">!</h1>
                        
                    </div>
                )} 
                
                {statusEvaluation && (
                    <div
                        className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full font-semibold text-sm"
                        title="Encuestas contestadas"
                    >
                        {statusEvaluation}
                    </div>
                )}
                {actions.map((action, i) => (
                    <button
                        key={i}
                        onClick={action.click}
                        className={`${action.bgColor} ${disable ? "cursor-not-allowed text-gray-300" : "text-white"
                            } font-medium w-10 h-10 rounded-lg flex items-center justify-center`}
                    >
                        {action.icon}
                    </button>
                ))}
            </div>

        </div>
    );
}

export default Card;
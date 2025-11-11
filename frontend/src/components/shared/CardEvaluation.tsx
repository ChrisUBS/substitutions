interface CardEvaluationProps {
    questionText: String
}

function CardEvaluation({questionText}:CardEvaluationProps) {

    return (
        <div className="flex flex-col md:flex-row justify-between items-center w-full bg-[#E6E7E8] p-4 rounded-xl">
            <div className="flex flex-col items-center md:items-start">
                <h3 className="text-2xl">{questionText}</h3>
            </div>
        </div>
    );
}

export default CardEvaluation;
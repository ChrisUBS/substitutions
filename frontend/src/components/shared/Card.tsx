import { useNavigate } from "react-router-dom";
import type { RequestData } from "../../types/Utils";

interface CardProps {
    request : RequestData
}

function Card( {request} : CardProps) {

    const navigate = useNavigate();

    //Send data to view the requests
    const handleViewRequest = (request: RequestData) => {
    navigate('/requests/view', {
        state: { requestData: request }
    });
};

    return (
        <div className={`flex flex-col md:flex-row justify-between items-center w-full ${request.requestStatus === "pending payment" ? "bg-[#E6E7E8]" : request.requestStatus === "paid" ? "bg-[#10B981]" : "bg-[#D63A39]"} p-4 rounded-xl`}>
            {/* Left container */}
            <div className="flex flex-col md:flex-row items-center md:items-center w-full md:w-auto">
                {/* Request information */}
                <div className={`flex flex-col ${request.requestStatus === "pending payment" ? "text-black" : "text-white"} items-center md:items-start text-center md:text-left`}>
                    <h3 className="text-2xl">{request.professorName}</h3>
                    <p>{request.programName} - {request.courseName} - {request.requestDate}</p>
                </div>
            </div>

            {/* Request status and a button for view the request */}
            <div className="flex flex-row items-center justify-center space-x-2 mt-3 md:mt-0">
                {request.requestStatus && (
                    <div
                        className={`flex items-center justify-center h-10 ${request.requestStatus === "pending payment" ? "text-black" : "text-white"} rounded-full font-thin italic text-sm`}
                        title="Encuestas contestadas"
                    >
                        {request.requestStatus}
                    </div>
                )}

                <button title="Request Info" onClick={() => handleViewRequest(request)} className="text-white font-medium w-10 h-10 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 ${request.requestStatus === "pending payment" ? "text-black" : "text-white"}`} viewBox="0 -960 960 960" fill="currentColor"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                </button>
            </div>

        </div>
    );
}

export default Card;
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import LogoSDGKU from "../../assets/sdgku_logo.webp";

type StatusType = "success" | "invalid" | "expired";

const validStatuses: StatusType[] = ["success", "invalid", "expired"];

const messages: Record<StatusType, string> = {
    success: "Your email has been successfully verified!",
    invalid: "Invalid verification link.",
    expired: "This verification link has expired.",
};

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const status = searchParams.get("status") as StatusType | null;
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        if (!status || !validStatuses.includes(status)) {
            navigate("/", { replace: true });
            return;
        }

        setMessage(messages[status]);
    }, [status, navigate]);

    if (!message) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="flex flex-col items-center space-y-4">
                <svg className="animate-spin h-10 w-10 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <p className="text-gray-600 text-sm">Loading...</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
            {/* Logo */}
            <div className="flex flex-col items-center space-y-2 mb-6">
                <div className="flex justify-center items-center space-x-3">
                    <img
                        src={LogoSDGKU}
                        alt="SDGKU Logo"
                        className="w-20 sm:w-22 md:w-24 h-auto"
                    />
                    <h1 className="text-2xl sm:text-4xl font-bold text-center">
                        SDGKU
                    </h1>
                </div>
                <p className="text-yellow-600 text-lg sm:text-2xl text-center leading-tight font-bold">
                    Faculty Substitution System
                </p>
            </div>
            {/* Message Box */}
            <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full text-center">
                <h1 className="text-2xl font-semibold mb-4">Email Verification</h1>
                {status === "success" ? (
                    <p className="text-green-600 text-lg mb-6">{message}</p>
                ) : (
                    <p className="text-red-600 text-lg mb-6">{message}</p>
                )}
                <div className="flex justify-center">
                    <button
                        onClick={() => navigate("/")}
                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-800 transition"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        </div>
    );
}

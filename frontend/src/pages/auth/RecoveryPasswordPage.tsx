import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoSDGKU from "../../assets/sdgku_logo.webp";
import { authService } from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import Footer from '../../components/footer/Footer';

function RecoveryPasswordPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        // if passwords do not match
        if (!email) {
            alert("Please enter your email!");
            setLoading(false);
            return;
        }

        try {
            await authService.sendRecoveryEmail(email);
            setSuccess("If the email is registered, a recovery email has been sent. Redirecting...");
            setTimeout(() => navigate("/"), 3000);
        } catch (err: any) {
            // setError(err?.response?.data?.message || "An error occurred. Try again later.");
            setSuccess("If the email is registered, a recovery email has been sent. Redirecting...");
            setTimeout(() => navigate("/"), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-white">
            <div className="flex flex-col items-center justify-center bg-gray-100 px-4 py-10 flex-grow">
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

                {/* Form Card */}
                <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Reset Your Password</h2>

                    {error && <p className="text-red-600 text-center mb-3">{error}</p>}
                    {success && <p className="text-green-600 text-center mb-3">{success}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-600"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition font-semibold shadow disabled:opacity-60"
                        >
                            {loading ? "Sending..." : "Send Recovery Email"}
                        </button>
                    </form>
                </div>

                {/* Back to Login Button */}
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 
                                bg-white border border-gray-300 rounded-lg shadow-sm 
                                hover:bg-gray-100 hover:border-gray-400 transition"
                    >
                        <FontAwesomeIcon icon={faArrowCircleLeft} />
                        Back to Login
                    </button>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div >
    );
}

export default RecoveryPasswordPage;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoSDGKU from "../../assets/sdgku_logo.webp";
import { authService } from "../../services/api";
import type { ResetPasswordData } from "../../types/Utils";
import Footer from "../../components/footer/Footer";

function ResetPasswordPage() {
    const navigate = useNavigate();

    const [resetPasswordData, setResetPasswordData] = useState<ResetPasswordData>({
        email: "",
        token: "",
        password: "",
        password_confirmation: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const emailParam = params.get("email");
        const tokenParam = params.get("token");

        if (!emailParam || !tokenParam) {
            navigate("/");
            return;
        }

        setResetPasswordData((prevData) => ({
            ...prevData,
            email: emailParam,
            token: tokenParam,
        }));
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (resetPasswordData.password !== resetPasswordData.password_confirmation) {
            alert("Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            await authService.resetPassword(resetPasswordData);
            setSuccess("Password updated successfully! Redirecting...");
            setTimeout(() => navigate("/"), 2000);
        } catch (err: any) {
            setError(err?.response?.data?.message || "An error occurred. Try again later.");
            setTimeout(() => navigate("/"), 2000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-white">

            {/* Main content */}
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

                        {/* Password Input */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                minLength={8}
                                value={resetPasswordData.password}
                                onChange={(e) =>
                                    setResetPasswordData((prevData) => ({
                                        ...prevData,
                                        password: e.target.value,
                                    }))
                                }
                                required
                                className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-600"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                minLength={8}
                                value={resetPasswordData.password_confirmation}
                                onChange={(e) =>
                                    setResetPasswordData((prevData) => ({
                                        ...prevData,
                                        password_confirmation: e.target.value,
                                    }))
                                }
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
                            {loading ? "Updating..." : "Change Password"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default ResetPasswordPage;

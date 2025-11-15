import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../../components/header/Header";
import Card from "../../components/shared/Card";

function RequestPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const requests = [
        {
            index: 1,
            professorName: "Enrique",
            programName: "FSDI",
            courseName: "Django",
            requestDate: "12-11-2025",
            requestStatus: "paid",
            program: 'Engineering',
            substituteInstructor: 'john',
            date: '2024-11-20',
            course: 'React Advanced',
            session: 'Fall 2024',
            cohort: 'Cohort A',
            absence_details: [
                { date: '2024-11-20', type: 2 },
                { date: '2024-11-22', type: 1 }
            ],
            lesson_plan: 'Introduction to hooks',
            activities: ['Practice useState', 'Build a counter'],
            materials: [
                { title: 'GitHub', link: 'https://github.com/example' },
                { title: 'Docs', link: 'https://react.dev' }
            ],
            special_instructions: 'Please review the homework'
        },
    ]

    return (
        <div className="h-screen flex flex-col">
            <Header />

            {/* Main container */}
            <div className="flex-1 flex flex-col min-h-0 w-full max-w-7xl mx-auto px-3">

                {/* Title and role  */}
                <div className="flex justify-between px-4 pt-6 pb-4">
                    <h1 className="text-3xl font-bold text-center sm:text-left">My requests</h1>
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8" viewBox="0 -960 960 960" fill="url(#grad)">
                            <defs>
                                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#F59E0B" />
                                    <stop offset="100%" stopColor="#D63A39" />
                                </linearGradient>
                            </defs>
                            <path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z" />
                        </svg>
                        <p className="font-semibold">Instructor</p>
                    </div>
                </div>

                {/* SearchBar and button */}
                <div className="flex flex-col sm:flex-row justify-between gap-2 items-center mb-4 px-4 sm:px-12">
                    <div className="w-full max-w-xs">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search request..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-6 py-3 pr-12 text-gray-700 bg-gray-200 rounded-full outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                                aria-label="Buscar"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#565A5C">
                                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <button
                        className="text-white font-medium bg-[#00723F] px-4 py-3 rounded-full hover:bg-green-700 transition-colors flex items-center gap-2"
                        onClick={() => navigate("/requests/create-request")}
                    >
                        <svg className="inline-block" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                        </svg>
                        Add request
                    </button>
                </div>

                {/* Cards List */}
                <div className="flex-1 overflow-y-auto mb-4 min-h-0 px-4 sm:px-12">
                    <div className="space-y-3 pb-6">
                        {requests.map((request, index) => (
                            <Card
                                key={index}
                                request={request}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RequestPage;
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import { projectsService, categoriesService, evaluationsService, judgesService } from "../../../services/api";
import type { Project, Category, EvaluationForm, Judge } from "../../../types/Utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import InfoModal from "../../../components/modals/InfoModal";

interface RatingCirclesProps {
    value: number;
    onChange: (val: number) => void;
    label: string;
    questionId: number;
    options: { value: number; text: string }[];
}

function RatingCircles({
    value,
    onChange,
    label,
    questionId,
    options,
}: RatingCirclesProps) {
    // Controlar la apertura del modal
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    const openInfoModal = () => {
        setIsInfoModalOpen(true);
    };

    const closeInfoModal = () => {
        setIsInfoModalOpen(false);
    };

    return (
        <div className="rounded-xl p-4 bg-[#E6E7E8] space-y-3">
            <div className="flex fl justify-between">
                <h3 className="text-1xl sm:text-1xl md:text-2xl lg:text-3xl font-medium">
                    {questionId}. {label}
                </h3>
                {questionId <= 10 && (
                    <button onClick={openInfoModal}>
                        <FontAwesomeIcon
                            icon={faCircleInfo}
                            className="mr-2 text-sm sm:text-base md:text-lg lg:text-xl"
                        />
                    </button>
                )}
            </div>
            <div className="flex justify-center gap-3 sm:gap-8 md:gap-12 lg:gap-16 my-2">
                {options.map((opt) => (
                    <div key={opt.value} className="flex flex-col items-center">
                        <div
                            key={opt.value}
                            onClick={() => onChange(opt.value)}
                            className={`w-6 h-6 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full font-bold flex items-center ring-3 justify-center 
                        transition-all duration-200 border border-gray-400
                        ${value === opt.value
                                    ? "bg-orange-500 "
                                    : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                        ></div>
                        <div className="text-xs sm:text-sm md:text-base lg:text-lg mt-1 sm:mt-2 text-center">
                            {opt.text}
                        </div>
                    </div>
                ))}
            </div>
            <InfoModal
                isOpen={isInfoModalOpen}
                onClose={closeInfoModal}
                id_question={questionId.toString()}
                label={label}
            />
        </div>
    );
}

function EvaluationDetailsPage() {
    const { id, evaluationId } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState<Project>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [evaluation, setEvaluation] = useState<EvaluationForm>();
    const [judge, setJudge] = useState<Judge>();

    useEffect(() => {
        // Verificar que id y evaluationId no sean undefined
        if (!id || !evaluationId) return;

        const fetchAll = async () => {
            try {
                const [proj, cats, evalForm] = await Promise.all([
                    projectsService.getProjectById(parseInt(id)),
                    categoriesService.getAllCategories(),
                    evaluationsService.getEvaluationById(parseInt(evaluationId)),
                ]);

                const judgeData = await judgesService.getJudgeById(evalForm.id_judge);
                setProject(proj);
                setCategories(cats);
                setEvaluation(evalForm);
                setJudge(judgeData);
            } catch (error) {
                console.error("Error fetching project:", error);
                navigate('/dashboard');
            }
        };

        fetchAll();
    }, [evaluationId, id, navigate]);

    const questions = [
        {
            id: 1,
            questionText: "Identificar el problema",
        },
        {
            id: 2,
            questionText: "Segmento de mercado (Cliente)",
        },
        {
            id: 3,
            questionText: "Ventaja competitiva",
        },
        {
            id: 4,
            questionText: "Análisis de la competencia",
        },
        {
            id: 5,
            questionText: "Validación de propuesta de valor (Solución)",
        },
        {
            id: 6,
            questionText: "Modelo de negocio",
        },
        {
            id: 7,
            questionText: "Ventas y Marketing",
        },
        {
            id: 8,
            questionText: "Viabilidad financiera",
        },
        {
            id: 9,
            questionText: "Compromiso del equipo",
        },
        {
            id: 10,
            questionText: "Calidad general",
        },
    ];

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex flex-col mx-auto mt-8 w-7/8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl sm:text-1xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">
                        Evaluación del juez {judge?.name || ""}
                    </h1>

                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-[#DD971A] hover:bg-[#c48518] text-white px-5 py-2 rounded-full font-medium transition-colors"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                            Regresar
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center space-y-2 mt-2">
                    <div className="flex flex-col items-center sm:flex-row w-3/4 justify-between">
                        <div>
                            <h2 className="text-base md:text-lg lg:text-2xl">
                                Proyecto:{" "}
                                <p className="font-normal inline">
                                    {(
                                        project?.title || "Sin título"
                                    ).toUpperCase()}
                                </p>
                            </h2>
                        </div>
                        <div>
                            <h2 className="text-base md:text-lg lg:text-2xl">
                                Categoría:{" "}
                                <p className="font-normal inline">
                                    {(
                                        categories.find((cat) => cat.id === project?.id_category)?.name || "Sin categoría"
                                    ).toUpperCase()}
                                </p>
                            </h2>
                        </div>
                        <div>
                            <h2 className="text-base md:text-lg lg:text-2xl">
                                Nivel:{" "}
                                <p className="font-normal inline">
                                    {project?.level.toUpperCase()}
                                </p>
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Rating Questions */}
                <div className="flex flex-col min-h-0 overflow-y-auto w-5/6 mx-auto mt-4 space-y-4 pb-4">
                    {questions.map((question) => (
                        <RatingCircles
                            key={question.id}
                            value={evaluation ? (evaluation as any)[`question_${question.id}`] || 0 : 0}
                            onChange={() => { }}
                            label={question.questionText}
                            questionId={question.id}
                            options={[
                                { value: 1, text: "No cumple" },
                                { value: 2, text: "Insuficiente" },
                                { value: 3, text: "Regular" },
                                { value: 4, text: "Bien" },
                                { value: 5, text: "Excelente" },
                            ]}
                        />
                    ))}
                    <RatingCircles
                        key={11}
                        value={evaluation ? (evaluation as any)[`question_11`] : 0}
                        onChange={() => { }}
                        label={"¿El proyecto está en la categoría correcta?"}
                        questionId={11}
                        options={[
                            { value: 1, text: "Sí" },
                            { value: 0, text: "No" },
                        ]}
                    />

                    {(evaluation ? (evaluation as any)[`question_11`] === 0 : false) && (
                        <RatingCircles
                            key={12}
                            value={evaluation ? (evaluation as any)[`id_category`] || 0 : 0}
                            onChange={() => { }}
                            label={"¿A qué categoría debería pertenecer el proyecto?"}
                            questionId={12}
                            options={categories
                                .filter((cat) => cat.id !== project?.id_category)
                                .map((cat) => ({ value: cat.id, text: cat.name }))}
                        />
                    )}
                    <div className="rounded-xl p-4 bg-[#E6E7E8] space-y-3">
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                            Feedback ({evaluation ? (evaluation as any)[`question_11`] !== 0 ? "opcional" : "obligatorio" : "obligatorio"})
                        </label>
                        <textarea disabled
                            placeholder={evaluation ? (evaluation as any)[`question_11`] !== 0 ? "Escribe aquí tu retroalimentación sobre el proyecto..." : "¿Por qué no esta en la categoría correcta?" : "¿Por qué no esta en la categoría correcta?"}
                            className="w-full bg-white  min-h-[120px] p-3 border border-gray-300 rounded-lg resize-none text-gray-700"
                            value={evaluation?.feedback || ""}
                            onChange={() => { }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EvaluationDetailsPage;
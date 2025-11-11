import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from '../../states/AuthContext';
import HeaderEvaluation from "../../components/header/HeaderEvaluation";
import { projectsService, categoriesService, evaluationsService } from "../../services/api";
import type { Project, Category, EvaluationForm } from "../../types/Utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faPaperPlane,
    faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
// Modals
import ConfirmActionModal from "../../components/modals/ConfirmActionModal";
import InfoModal from "../../components/modals/InfoModal";

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

function GradeProjectPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [project, setProject] = useState<Project>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [evaluation, setEvaluation] = useState<EvaluationForm>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        // Verificar que id no sea undefined
        if (!id) return;

        const fetchProject = async () => {
            // Verificar que user no sea undefined
            if (!user) return;

            try {
                const data = await projectsService.getProjectById(parseInt(id));
                setProject(data);
                const categories = await categoriesService.getAllCategories();
                setCategories(categories);

                // Inicializar el formulario de evaluación
                setEvaluation({
                    id_project: data.id!,
                    id_judge: user.id,
                });
            } catch (error) {
                console.error("Error fetching project:", error);
                navigate("/evaluations"); // Redirigir si hay un error
            }
        };

        fetchProject();
    }, [id, user]);

    const handleSubmit = async () => {
        // Validar que el formulario de evaluación esté completo
        if (!evaluation) {
            alert("El formulario de evaluación no está completo.");
            return;
        }

        for (let i = 1; i <= 11; i++) {
            const questionValue = (evaluation as any)[`question_${i}`];
            if (questionValue === undefined) {
                alert(`Por favor, responde todas las preguntas.`);
                return;
            }
        }

        // En caso que la 11 sea "No", validar que haya feedback y categoría seleccionada
        if (evaluation) {
            const question11 = (evaluation as any)[`question_11`];
            if (question11 === 0 && (!evaluation.feedback || !evaluation.id_category)) {
                alert("Por favor, proporciona feedback y selecciona una categoría.");
                return;
            }
        }

        try {
            await evaluationsService.saveEvaluationForm(evaluation);
            navigate("/evaluations");
        } catch (error) {
            console.error("Error saving evaluation:", error);
        }
    };

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

    // Manejo de cambios en las respuestas
    const handleChange = (questionId: number, value: number) => {
        setEvaluation((prev) => ({
            ...((prev ?? {}) as EvaluationForm),
            [`question_${questionId}`]: value,
        }));

        if (questionId === 11 && value === 1) {
            // Si la respuesta a la pregunta 11 es "Sí", limpiar la categoría seleccionada
            setEvaluation((prev) => ({
                ...((prev ?? {}) as EvaluationForm),
                id_category: undefined,
            }));
        }
    };

    // Manejo del modal
    const handleGoBack = () => {
        setIsModalOpen(true);
    };

    const confirmGoBack = () => {
        setIsModalOpen(false);
        navigate("/evaluations");
    };

    const cancelGoBack = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col h-screen">
            <HeaderEvaluation />
            <div className="flex flex-row justify-between mt-5 mx-10">
                <button
                    onClick={handleGoBack}
                    className="bg-[#DD971A] text-white px-5 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Regresar
                </button>
                <button
                    onClick={handleSubmit}
                    className="bg-[#00723F] text-white px-5 py-2 rounded-full font-medium hover:bg-green-800 transition-colors"
                >
                    <FontAwesomeIcon icon={faPaperPlane} />
                    Enviar
                </button>
            </div>
            <div className="flex flex-col items-center space-y-2 mt-6">
                <h1 className="text-2xl sm:text-1xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">
                    {project?.title}
                </h1>
                <div className="flex flex-row w-3/4 justify-between">
                    {/* Nivel */}
                    <div>
                        <h2 className="text-sm sm:text-md md:text-lg lg:text-1xl">
                            Nivel:{" "}
                            <p className="font-normal inline">
                                {project?.level.toUpperCase()}
                            </p>
                        </h2>
                    </div>
                    {/* Categoría */}
                    <div>
                        <h2 className="text-sm sm:text-md md:text-lg lg:text-1xl">
                            Categoría:{" "}
                            <p className="font-normal inline">
                                {(
                                    categories.find((cat) => cat.id === project?.id_category)?.name || "Sin categoría"
                                ).toUpperCase()}
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
                        onChange={(val) => handleChange(question.id, val)}
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
                    onChange={(val) => handleChange(11, val)}
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
                        onChange={(e) =>
                            setEvaluation((prev) => ({
                                ...((prev ?? {}) as EvaluationForm),
                                id_category: e,
                            }))
                        }
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
                    <textarea
                        placeholder={evaluation ? (evaluation as any)[`question_11`] !== 0 ? "Escribe aquí tu retroalimentación sobre el proyecto..." : "¿Por qué no esta en la categoría correcta?" : "¿Por qué no esta en la categoría correcta?"}
                        className="w-full bg-white  min-h-[120px] p-3 border border-gray-300 rounded-lg resize-none text-gray-700"
                        value={evaluation?.feedback || ""}
                        onChange={(e) =>
                            setEvaluation((prev) => ({
                                ...((prev ?? {}) as EvaluationForm),
                                feedback: e.target.value,
                            }))
                        }
                    />
                </div>
            </div>
            <ConfirmActionModal
                isOpen={isModalOpen}
                onConfirm={confirmGoBack}
                onCancel={cancelGoBack}
                message="¿Seguro que quieres regresar?"
                submessage="Se perderán los cambios"
            />
        </div>
    );
}

export default GradeProjectPage;

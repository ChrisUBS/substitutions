import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    id_question: string;
    label: string;
}

// Constante con los textos
const CRITERIA_TEXTS = [
    {
        question: "Identificar el problema",
        levels: [
            { level: "No cumple", text: "La declaración del problema no está, es muy difusa o no se entiende la naturaleza del problema. No hay validación o los datos no sustentan la declaración del problema." },
            { level: "Insuficiente", text: "Hay una declaración del problema, pero es ambigua o difícil de entender. Los datos presentados son pocos, limitados o vagos." },
            { level: "Regular", text: "Se entiende la declaración del problema, pero no está bien definida. Los datos presentados soportan el problema, pero no son concluyentes." },
            { level: "Bien", text: "La declaración está definida, pero no es específica o tiene cierta ambigüedad. Los datos son concluyentes, comprensivos y soportan la declaración del problema." },
            { level: "Excelente", text: "La declaración del problema es clara, específica y sin ambigüedades. Son datos de una investigación profunda que presentan una fuerte evidencia el problema." },
        ],
    },
    {
        question: "Segmento del mercado",
        levels: [
            { level: "No cumple", text: "No hay arquetipo del cliente, está mal elaborado, carece de detalles o no es confiable. No hay una investigación que permita entender al mercado y el segmento elegido." },
            { level: "Insuficiente", text: "Hay un arquetipo del cliente, pero no está bien elaborado y carece de detalles. La investigación es limitada o incompleta sin estimaciones de TAM, SAM y SOM." },
            { level: "Regular", text: "El arquetipo ofrece una idea del mercado, pero carece de datos de segmento y JTBD. La investigación cubre el mercado objetivo, datos de TAM, SAM y SOM pero sin un nicho definido." },
            { level: "Bien", text: "El arquetipo tiene datos del segmento del cliente y ofrece una idea general de los JTBD. La investigación estima el mercado objetivo, nicho y mercado total (TAM), mercado al que se puede servir (SAM) y el mercado que puede conseguir (SOM) con pocas referencias." },
            { level: "Excelente", text: "El arquetipo del cliente ofrece una clara y detallada comprensión del mercado objetivo y los JTBD (tareas a realizar del cliente)." },
        ],
    },
    {
        question: "Ventaja competitiva",
        levels: [
            { level: "No cumple", text: "No existe análisis o es débil." },
            { level: "Insuficiente", text: "El análisis es débil o solo es una comparación simple sin incluir los factores de diferenciación." },
            { level: "Regular", text: "Hay un análisis de la competencia que incluye los factores de diferenciación." },
            { level: "Bien", text: "El análisis es sólido y determina la estrategia de las cuatro acciones." },
            { level: "Excelente", text: "El análisis es claro y muestra la estrategia de diferenciación de cuatro acciones (eliminar, reducir, aumentar, crear)." },
        ],
    },
    {
        question: "Análisis de la competencia",
        levels: [
            { level: "No cumple", text: "No existe análisis o es débil." },
            { level: "Insuficiente", text: "El análisis es débil o solo es una comparación simple." },
            { level: "Regular", text: "Hay un análisis de la competencia." },
            { level: "Bien", text: "El análisis de la competencia es sólido." },
            { level: "Excelente", text: "El análisis es claro y muestra las fortalezas y debilidades de las características del producto." },
        ],
    },
    {
        question: "Validación de la propuesta de valor (Solución)",
        levels: [
            { level: "No cumple", text: "La solución es difícil de entender o no muestra cómo resuelve las penas, ganancias y trabajos. No hay adoptadores tempranos definidos, no hay entrevistas o no hay un proceso de validación." },
            { level: "Insuficiente", text: "La solución muestra de manera incompleta cómo resuelve las penas, ganancias y trabajos del cliente. Hay adoptadores tempranos y el diseño de la entrevista, pero las entrevistas son pocas (<5)" },
            { level: "Regular", text: "Muestra la solución a los problemas del cliente, pero no indica en qué es mejor a la alternativa. Hay adoptadores tempranos, entrevistas limitadas (<10) y datos no concluyentes." },
            { level: "Bien", text: "La solución define claramente cómo resuelve las penas y ganancias del cliente, y está diferenciada. Hay adoptadores, entrevistas suficientes y datos, pero sin retroalimentación efectiva sobre mejoras." },
            { level: "Excelente", text: "La solución es innovadora, está diferenciada y resuelve las penas (riesgos), ganancias (beneficios) y trabajos del cliente (acciones). Hay adoptadores definidos, entrevistas suficientes, información que permite mejorar la solución e interés de compra." },
        ],
    },
    {
        question: "Modelo de negocio",
        levels: [
            { level: "No cumple", text: "Muestra información incoherente." },
            { level: "Insuficiente", text: "Muestra vagamente como se creará valor del mercado, pero no cómo lo va a capturar." },
            { level: "Regular", text: "No expresa claramente como se creará y capturará valor del mercado." },
            { level: "Bien", text: "Muestra cómo se creará y capturará valor del mercado." },
            { level: "Excelente", text: "Muestra información coherente, dice cómo ofrecerá y capturará valor del mercado, se han validado los bloques riesgosos." },
        ],
    },
    {
        question: "Ventas y marketing",
        levels: [
            { level: "No cumple", text: "El emprendimiento no tiene un plan de ventas ni un embudo de adquisición de clientes. No hay declaración de posicionamiento, ni canales definidos para promoción ni retroalimentación." },
            { level: "Insuficiente", text: "Hay un plan de ventas y un embudo de adquisición de clientes deficientes y sin estrategia. Hay una declaración de posicionamiento y canales definidos para promoción y feedback." },
            { level: "Regular", text: "Hay un plan de ventas y un embudo de clientes bien definido sin una estrategia clara. Hay declaración de posicionamiento, canales definidos y presencia en redes sociales o página web." },
            { level: "Bien", text: "Hay plan de ventas y embudo de clientes claros y con estrategias de crecimiento. Hay declaración, canales, presencia en redes y plan de marketing ajustado a embudo de clientes." },
            { level: "Excelente", text: "Hay un plan de ventas y embudo de clientes validados en el mercado y estrategia de crecimiento. Hay declaración, canales bien definidos, presencia digital, plan de marketing ajustado a embudo de clientes e identidad de marca." },
        ],
    },
    {
        question: "Viabilidad financiera",
        levels: [
            { level: "No cumple", text: "No se presenta un plan financiero. No hay un plan de fondeo ni información de métricas (CAC, CLV, ARPU, etc.)" },
            { level: "Insuficiente", text: "Hay un plan financiero, pero está incompleto o no es coherente con los datos del emprendimiento. Hay un plan de fondeo, pero no información de métricas (CAC, CLV, ARPU, etc.)" },
            { level: "Regular", text: "Hay un plan financiero, está completo, proyectado a un año, pero es confuso o poco claro. Hay un plan de fondeo e información de métricas, pero no explica cómo y en qué se usarán los fondos." },
            { level: "Bien", text: "El plan financiero está completo, proyectado, claro, pero no está alineado al plan de crecimiento. Hay un plan de fondeo, métricas claras y explica el destino de los fondos." },
            { level: "Excelente", text: "El plan tiene bien identificados los costos iniciales, gastos, costos unitarios, está proyectado mensualmente a un año y está alineado a los planes de crecimiento del emprendimiento. El plan de fondeo es claro y convincente. Las métricas son sólidas, hay un plan de inversiones bien definido y alineado a los planes del emprendimiento." },
        ],
    },
    {
        question: "Compromiso del equipo",
        levels: [
            { level: "No cumple", text: "El equipo no se ha presentado ni identificado a los miembros ni sus roles." },
            { level: "Insuficiente", text: "El equipo se ha presentado parcialmente, los roles no están bien definidos y está desbalanceado." },
            { level: "Regular", text: "Los miembros se presentan con sus roles y experiencia. Algunos huecos no están cubiertos." },
            { level: "Bien", text: "La presentación del equipo es clara, con roles y experiencia definidos. El equipo está balanceado." },
            { level: "Excelente", text: "El equipo se ha presentado de manera excepcional, mostrando porqué son el equipo adecuado para el emprendimiento, con roles y experiencia definidos. El equipo está bien balanceado." },
        ],
    },
    {
        question: "Calidad general",
        levels: [
            { level: "No cumple", text: "La presentación (pitch deck) está pobremente diseñado, no hay ilación y muchos errores." },
            { level: "Insuficiente", text: "La presentación no muestra orden (colores, tipografía, imágenes, etc.). La historia es confusa." },
            { level: "Regular", text: "Está alineado a la identidad de marca, tiene un diseño ordenado, aunque con algunos errores." },
            { level: "Bien", text: "Está de acuerdo con la imagen de la marca, un diseño estandarizado, sin errores e ilación." },
            { level: "Excelente", text: "La presentación está alineada con la imagen de la empresa, tiene un diseño atractivo y gráfico, cuenta una historia bien hilada acorde con el potencial del emprendimiento, no tiene errores de redacción ni de diseño." },
        ],
    },
];

const InfoModal: React.FC<InfoModalProps> = ({
    isOpen,
    onClose,
    id_question,
    label,
}) => {
    const [currentIndex, setCurrentIndex] = useState(0); // empieza en "No cumple" (índice 0)

    if (!isOpen) return null;

    const parsedIndex = Number(id_question) - 1; // Convertir a número y ajustar a índice base 0
    const safeIndex =
        Number.isInteger(parsedIndex) && parsedIndex >= 0 && parsedIndex < CRITERIA_TEXTS.length
            ? parsedIndex
            : 0;

    const criterion = CRITERIA_TEXTS[safeIndex];
    const levels = criterion.levels;
    const current = levels[currentIndex];

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? levels.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === levels.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-50 px-4 sm:px-0">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm sm:max-w-md md:max-w-lg overflow-hidden animate-fadeIn">

                {/* Header */}
                <div className="bg-[#00723F] text-white text-center py-3">
                    <h2 className="text-1xl sm:text-1xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">
                        {id_question}. {label}
                    </h2>
                </div>

                {/* Content */}
                <div className="p-6 text-center max-h-[90vh] overflow-y-auto">
                    {/* Flechas de navegación */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={handlePrev}
                            className="p-2 border border-gray-400 rounded-full hover:bg-gray-100 transition"
                            aria-label="Anterior"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        <div>
                            <p className="text-base sm:text-md md:text-lg lg:text-1xl xl:text-2xl font-semibold mb-2">
                                {current.level}
                            </p>

                            <p className="mx-5 text-base sm:text-md md:text-lg lg:text-1xl xl:text-2xl italic text-gray-600 mb-6 leading-snug">
                                {current.text}
                            </p>
                        </div>
                        <button
                            onClick={handleNext}
                            className="p-2 border border-gray-400 rounded-full hover:bg-gray-100 transition"
                            aria-label="Siguiente"
                        >
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </div>

                    {/* Botón cerrar */}
                    <div className="flex justify-center">
                        <button
                            onClick={onClose}
                            className="bg-black text-white font-medium px-6 py-2 rounded-md hover:bg-gray-800 transition-colors text-sm sm:text-base"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoModal;
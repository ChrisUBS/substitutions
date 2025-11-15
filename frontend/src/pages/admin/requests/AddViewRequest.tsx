import Header from "../../../components/header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AddAbsenceModal from "../../../components/modals/ModalRequest/AddAbsenceModal";
import AddActivityModal from "../../../components/modals/ModalRequest/AddActivityModal";
import AddMaterialModal from "../../../components/modals/ModalRequest/AddMaterialModal";

import type { FormFieldProps, FormAddOptionsProps, FormSectionProps, AbsenceDetails, MaterialsNeeded } from "../../../types/Utils";

// Individual field component
const FormField: React.FC<FormFieldProps> = ({
    label,
    type = 'text',
    placeholder,
    options,
    value,
    onChange,
    required = false,
    readOnly = false
}) => {
    return (
        <div className="flex flex-col">
            <label className="text-base font-semibold mb-2 text-gray-800">
                {label}
                {required && !readOnly && <span className="text-red-500 ml-1">*</span>}
            </label>

            {type === 'select' ? (
                <select
                    value={value}
                    title="select"
                    onChange={(e) => onChange?.(e.target.value)}
                    className={`px-4 py-3 border-3 border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${readOnly ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                    required={required && !readOnly}
                    disabled={readOnly}
                >
                    <option value="" disabled>
                        {placeholder || `Select ${label.toLowerCase()}...`}
                    </option>
                    {options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    title="input"
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    placeholder={placeholder || `Enter ${label.toLowerCase()}...`}
                    className={`px-4 py-3 border-3 border-gray-300 rounded-2xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${readOnly ? 'bg-gray-100 cursor-not-allowed text-gray-700' : 'bg-white text-gray-700'}`}
                    required={required && !readOnly}
                    readOnly={readOnly}
                />
            )}
        </div>
    );
};

// Generic component to add options
const FormAddOptions = <T,>({
    title,
    openModal,
    modalText,
    items,
    onRemove,
    renderItem,
    viewMode = false
}: FormAddOptionsProps<T>) => {
    return (
        <div className="bg-linear-to-t from-[#BB2626] to-[#F59E0B] rounded-xl mb-8 pl-2 shadow-lg w-full">
            <div className="bg-white pb-4 sm:pb-6 rounded-xl ml-auto">
                <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-6 pt-4 sm:pt-6 px-4 sm:px-6 gap-4 sm:gap-0">
                    {/* Div to center tittle on the container, only on wide screends */}
                    <div className="hidden sm:block sm:w-1/3"></div>

                    {/* Títle */}
                    <div className="w-full sm:w-1/3">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">{title}</h2>
                    </div>

                    {/* Button to add options */}
                    <div className="w-full sm:w-1/3 flex justify-center sm:justify-end">
                        {!viewMode && openModal && modalText && (
                            <button
                                className="text-white font-medium bg-[#00723F] px-4 py-3 rounded-full hover:bg-green-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                                type='button'
                                onClick={openModal}
                            >
                                <svg className="inline-block" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF">
                                    <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                                </svg>
                                {modalText}
                            </button>
                        )}
                    </div>
                </div>

                {/* Items list */}
                {items.length > 0 ? (
                    <div className="space-y-3 mx-4 sm:mx-auto sm:w-5/6 lg:w-2/3">
                        {items.map((item, index) => (
                            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center p-3 sm:p-4 rounded-lg border-2 sm:border-0 border-gray-200 hover:border-gray-300 transition-colors gap-3">
                                <div className="w-full">
                                    {renderItem(item, index)}
                                </div>
                                {!viewMode && onRemove && (
                                    <div className="w-full sm:w-10 flex justify-end sm:justify-center">
                                        <button
                                            type="button"
                                            onClick={() => onRemove(index)}
                                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                            title="Remove item"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                                                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 sm:py-12 bg-gray-50 mx-4 sm:mx-6 rounded-lg">
                        <p className="text-gray-500 font-medium text-sm sm:text-base">No items added yet</p>
                        {!viewMode && modalText && (
                            <p className="text-gray-400 text-xs sm:text-sm mt-1">Click "{modalText}" to add your first item</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Section Component
const FormSection: React.FC<FormSectionProps> = ({
    title,
    fields,
    columns = 3
}) => {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    };

    return (
        <div className="bg-linear-to-t from-[#BB2626] to-[#F59E0B] rounded-xl mb-8 pl-2 shadow-lg w-full">
            <div className="px-4 sm:px-8 pb-4 sm:pb-6 rounded-xl bg-white">
                <h2 className="text-2xl sm:text-3xl text-center font-bold mb-4 sm:mb-6 pt-4 sm:pt-6 text-gray-900">{title}</h2>
                <div className={`grid ${gridCols[columns]} gap-4 sm:gap-6`}>
                    {fields.map((field, index) => (
                        <FormField key={index} {...field} />
                    ))}
                </div>
            </div>
        </div>
    );
};

function AddViewRequest() {
    const location = useLocation();
    const navigate = useNavigate();

    const requestData = location.state?.requestData;

    const isViewMode = !!requestData;

    const [isAddAbsenceModalOpen, setAddAbsenceModal] = useState(false);
    const [isAddActivityModalOpen, setAddActivityModal] = useState(false);
    const [isAddMaterialModalOpen, setAddAMaterialModal] = useState(false);

    const [formData, setFormData] = useState({
        program: '',
        substituteInstructor: '',
        date: '',
        course: '',
        session: '',
        cohort: '',
        absence_details: [] as AbsenceDetails[],
        lesson_plan: '',
        activities: [] as string[],
        materials: [] as MaterialsNeeded[],
        special_instructions: ''
    });

    // Load data with State
    useEffect(() => {
        if (requestData) {
            setFormData({
                program: requestData.program || '',
                substituteInstructor: requestData.substituteInstructor || '',
                date: requestData.date || '',
                course: requestData.course || '',
                session: requestData.session || '',
                cohort: requestData.cohort || '',
                absence_details: requestData.absence_details || [],
                lesson_plan: requestData.lesson_plan || '',
                activities: requestData.activities || [],
                materials: requestData.materials || [],
                special_instructions: requestData.special_instructions || ''
            });
        }
    }, [requestData]);

    // Function to modify values when the input change
    const handleFieldChange = (fieldName: string, value: string) => {
        if (!isViewMode) {
            setFormData(prev => ({ ...prev, [fieldName]: value }));
        }
    };

    //Template to add items
    const handleAddItem = <T,>(
        field: keyof typeof formData,
        newItem: T,
        closeModal: () => void
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] as T[]), newItem]
        }));
        closeModal();
    };

    //Function to eliminate items
    const handleRemoveItem = (
        field: keyof typeof formData,
        index: number
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field] as any[]).filter((_, i) => i !== index)
        }));
    };

    //Functions to add items on differents lists (absence, activities, materials)
    const handleAddAbsence = (date: string, type: number) => {
        handleAddItem('absence_details', { date, type }, () => setAddAbsenceModal(false));
    };

    const handleAddActivity = (activity: string) => {
        handleAddItem('activities', activity, () => setAddActivityModal(false));
    };

    const handleAddMaterial = (title: string, link: string) => {
        handleAddItem('materials', { title, link }, () => setAddAMaterialModal(false));
    };


    // Map type labels
    const getAbsenceTypeLabel = (type: number): string => {
        const typeMap: Record<number, string> = {
            3: '3 hours',
            2: '2 hours',
            1: '1 hour',
            0.5: '30 mins'
        };
        return typeMap[type] || 'Unknown';
    };

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isViewMode) return;

        if (
        !formData.program.trim() ||
        !formData.substituteInstructor ||
        !formData.date ||
        !formData.course.trim() ||
        !formData.session.trim() ||
        !formData.cohort.trim() ||
        formData.absence_details.length === 0 ||
        !formData.lesson_plan.trim() ||
        formData.activities.length === 0 ||
        formData.materials.length === 0
    ) {
        alert("Please complete all required fields and add at least one item to each section.");
        return;
    }

        // try {
        //     console.log('Form data to submit:', formData);

        //     const response = await fetch('/api/requests', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(formData)
        //     });

        //     if (response.ok) {
        //         navigate('/requests', {
        //             state: { message: 'Request created successfully!' }
        //         });
        //     }
        // } catch (error) {
        //     console.error('Error submitting form:', error);
        //     alert('Failed to create request');
        // }

        console.log(formData)
        alert("Sucess!")
    };

    return (
        <div className="h-screen flex flex-col">
            <Header />
            <div className="flex-1 overflow-y-auto">
                <div className="mx-auto px-3 sm:px-4 py-4 sm:py-6 w-full max-w-7xl">
                    {/* Title and button to go back */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            {isViewMode ? 'View Request' : 'Add New Request'}
                        </h1>
                        <button
                            type="button"
                            className="text-white font-medium bg-[#C57307] px-4 py-2 rounded-full hover:bg-orange-800 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                            onClick={() => navigate(-1)}
                        >
                            <svg className="inline-block" xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#FFFFFF">
                                <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
                            </svg>
                            {isViewMode ? 'Back' : 'Cancel'}
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <FormSection
                            title="Instructor Information"
                            columns={3}
                            fields={[
                                {
                                    label: 'Program',
                                    type: 'text',
                                    placeholder: 'Enter a program...',
                                    value: formData.program,
                                    onChange: (val) => handleFieldChange('program', val),
                                    required: true,
                                    readOnly: isViewMode
                                },
                                {
                                    label: 'Substitute instructor',
                                    type: 'select',
                                    placeholder: 'Select a substitute instructor...',
                                    value: formData.substituteInstructor,
                                    onChange: (val) => handleFieldChange('substituteInstructor', val),
                                    required: true,
                                    readOnly: isViewMode,
                                    options: [
                                        { value: 'john', label: 'John Doe' },
                                        { value: 'jane', label: 'Jane Smith' },
                                        { value: 'mike', label: 'Mike Johnson' }
                                    ]
                                },
                                {
                                    label: 'Date',
                                    type: 'date',
                                    value: formData.date,
                                    onChange: (val) => handleFieldChange('date', val),
                                    required: true,
                                    readOnly: isViewMode
                                },
                            ]}
                        />

                        <FormSection
                            title="Class Information"
                            columns={3}
                            fields={[
                                {
                                    label: 'Course',
                                    type: 'text',
                                    placeholder: 'Enter a course...',
                                    value: formData.course,
                                    onChange: (val) => handleFieldChange('course', val),
                                    required: true,
                                    readOnly: isViewMode
                                },
                                {
                                    label: 'Session',
                                    type: 'text',
                                    placeholder: 'Enter a session...',
                                    value: formData.session,
                                    onChange: (val) => handleFieldChange('session', val),
                                    required: true,
                                    readOnly: isViewMode
                                },
                                {
                                    label: 'Cohort',
                                    type: 'text',
                                    placeholder: 'Enter a cohort...',
                                    value: formData.cohort,
                                    onChange: (val) => handleFieldChange('cohort', val),
                                    required: true,
                                    readOnly: isViewMode
                                }
                            ]}
                        />

                        <FormAddOptions<AbsenceDetails>
                            title="Absence Details"
                            openModal={() => setAddAbsenceModal(true)}
                            modalText="Add Absence"
                            items={formData.absence_details}
                            onRemove={(index) => handleRemoveItem('absence_details', index)}
                            viewMode={isViewMode}
                            renderItem={(item) => (
                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-start sm:items-center">
                                    <div className="border-2 w-full sm:w-auto flex-shrink-0 border-[#E6E7E8] rounded-xl px-4 py-3 bg-[#E6E7E8]">
                                        <p className="text-sm sm:text-base text-center text-gray-900 font-semibold whitespace-nowrap">
                                            {new Date(item.date).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="border-2 w-full flex-1 min-w-0 border-[#E6E7E8] rounded-xl px-4 py-3">
                                        <p className="text-sm sm:text-base text-gray-700 truncate">
                                            {getAbsenceTypeLabel(item.type)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        />

                        <FormSection
                            title="Lesson Plan"
                            columns={1}
                            fields={[
                                {
                                    label: 'Topic/Subject to be covered',
                                    type: 'text',
                                    placeholder: 'Type lesson plan...',
                                    value: formData.lesson_plan,
                                    onChange: (val) => handleFieldChange('lesson_plan', val),
                                    required: true,
                                    readOnly: isViewMode
                                },
                            ]}
                        />

                        <FormAddOptions<string>
                            title="Activities and Assignments"
                            openModal={() => setAddActivityModal(true)}
                            modalText="Add Activity"
                            items={formData.activities}
                            onRemove={(index) => handleRemoveItem('activities', index)}
                            viewMode={isViewMode}
                            renderItem={(item) => (
                                <div className="w-full bg-[#E6E7E8] rounded-xl p-4 text-center">
                                    <p className="text-sm sm:text-base text-gray-900 font-medium break-words">
                                        {item}
                                    </p>
                                </div>
                            )}
                        />

                        <FormAddOptions<MaterialsNeeded>
                            title="Materials Needed"
                            openModal={() => setAddAMaterialModal(true)}
                            modalText="Add Material"
                            items={formData.materials}
                            onRemove={(index) => handleRemoveItem('materials', index)}
                            viewMode={isViewMode}
                            renderItem={(item) => (
                                <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-6 items-start sm:items-center">
                                    <div className="border-2 w-full sm:w-[150px] sm:flex-shrink-0 border-[#E6E7E8] rounded-xl px-4 py-3 bg-[#E6E7E8]">
                                        <p className="text-sm sm:text-base text-center text-gray-900 font-semibold break-all">
                                            {item.title}
                                        </p>
                                    </div>
                                    <div className="border-2 w-full overflow-x-auto flex-1 min-w-0 border-[#E6E7E8] rounded-xl px-4 py-3 overflow-x-auto">
                                        <a
                                            className="cursor-pointer underline text-blue-700 hover:text-blue-500 text-sm sm:text-base break-all"
                                            href={item.link}
                                            target='_blank'
                                            rel="noreferrer noopener"
                                            title={item.link}
                                        >
                                            {item.link}
                                        </a>
                                    </div>
                                </div>
                            )}
                        />

                        <FormSection
                            title="Special Instructions"
                            columns={1}
                            fields={[
                                {
                                    label: 'Additional notes',
                                    type: 'text',
                                    placeholder: 'Enter special instructions...',
                                    value: formData.special_instructions,
                                    onChange: (val) => handleFieldChange('special_instructions', val),
                                    required: false,
                                    readOnly: isViewMode
                                },
                            ]}
                        />

                        {/* Submit Button */}
                        {!isViewMode && (
                            <div className="flex justify-center gap-4 mt-6 sm:mt-8 mb-6 sm:mb-8">
                                <button
                                    type="submit"
                                    className="bg-[#00723F] text-white px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto"
                                >
                                    Confirm Request
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* Modals, these will only shows if someone create a new request */}
            {!isViewMode && (
                <>
                    <AddAbsenceModal
                        isOpen={isAddAbsenceModalOpen}
                        onClose={() => setAddAbsenceModal(false)}
                        onSave={handleAddAbsence}
                    />

                    <AddActivityModal
                        isOpen={isAddActivityModalOpen}
                        onClose={() => setAddActivityModal(false)}
                        onSave={handleAddActivity}
                    />

                    <AddMaterialModal
                        isOpen={isAddMaterialModalOpen}
                        onClose={() => setAddAMaterialModal(false)}
                        onSave={handleAddMaterial}
                    />
                </>
            )}
        </div>
    );
}

export default AddViewRequest;
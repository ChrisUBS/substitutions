// types/Utils.ts

//Types for a single field
export interface FormFieldProps {
    label: string;
    type?: 'text' | 'select' | 'date' | 'number' | 'email';
    placeholder?: string;
    options?: { value: string; label: string }[];
    value?: string;
    onChange?: (value: string) => void;
    required?: boolean;
    readOnly?: boolean;
}


// Types of fields from a section form
export interface FormSectionProps {
    title: string;
    accentColor?: string;
    fields: FormFieldProps[];
    columns?: 1 | 2 | 3 | 4;
}

// Types for a component that add and remove items
export interface FormAddOptionsProps<T> {
    title: string;
    openModal?: () => void;
    modalText?: string;
    items: T[];
    onRemove?: (index: number) => void;
    renderItem: (item: T, index: number) => React.ReactNode;
    viewMode?: boolean;
}

// Types about absence 
export interface AbsenceDetails {
    date: string;
    type: number;
}

// Types for materials needed to the session
export interface MaterialsNeeded {
    title: string;
    link: string;
}

// Types of the full request
export interface RequestData {
    index?: number;
    professorName: string;
    programName?: string;
    courseName?: string;
    requestDate?: string;
    requestStatus?: string;
    program: string;
    substituteInstructor: string;
    date: string;
    course: string;
    session: string;
    cohort: string;
    absence_details: AbsenceDetails[];
    lesson_plan: string;
    activities: string[];
    materials: MaterialsNeeded[];
    special_instructions: string;
}
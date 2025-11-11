function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-gray-700 text-gray-100 py-3 text-center text-sm">
            <div className="container mx-auto px-4">
                <p className="leading-tight">
                    CIMATANK © {year}. Todos los derechos reservados.
                </p>
                <p className="text-gray-200 text-xs sm:text-sm">
                    Sistema desarrollado por alumnos de Ingeniería en Software y Tecnologías Emergentes (FCITEC).
                </p>
            </div>
        </footer>
    );
}

export default Footer;
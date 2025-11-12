function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-[#333333] text-white font-medium py-3 text-center text-sm">
            <div className="container mx-auto px-4">
                <p className="leading-tight">
                    San Diego Global Knowledge University © {year}. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
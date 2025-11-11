import LogoSDGKU from '../../assets/sdgku_logo.webp';
import { useAuth } from "../../states/AuthContext";


function HeaderEvaluation() {
    const {logout} = useAuth();

const handleSignOut = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error al cerrar sesión', error);
        }
    };    
    return (
        <div className="flex items-center bg-[#00723F] px-6 justify-between">
            <div>
                <img 
                src={LogoSDGKU} 
                alt="Escudo UABC" 
                className="w-14 sm:w-18 md:w-20 h-auto"
                />
            </div>
            <div className='text-white text-center sm:text-2xl md:text-4xl m-2'>
                <h1 className='font-light'>Evaluación de proyectos</h1>
            </div>
            <div className='cursor-pointer rounded-full flex justify-center gap-2 w-18 sm:w-20 md:w-22 items-center p-2 bg-[#DC1818]' onClick={handleSignOut}>
                <svg className='h-[18px] sm:h-[22px]' xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF"><path d="M360-240 120-480l240-240 56 56-144 144h568v80H272l144 144-56 56Z"/></svg>
                <p className='text-white text-xs sm:text-sm'>Salir</p>
            </div>
        </div>
    );
}

export default HeaderEvaluation;
import LogoSDGKU from '../../assets/sdgku_logo.webp';
import { useAuth } from "../../states/AuthContext";


function HeaderEvaluation() {
    const { logout } = useAuth();

    const handleSignOut = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error Loggin Out', error);
        }
    };
    return (
        <div className="flex items-center bg-white shadow-lg px-6 py-2 justify-between">
            <div>
                <img
                    src={LogoSDGKU}
                    alt="SDGKU Logo"
                    className="w-12 sm:w-14 md:w-18 h-auto"
                />
            </div>
            <div className='text-black text-center sm:text-2xl md:text-4xl m-2'>
                <h1 className='font-bold'>Faculty Substitution System</h1>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className='h-8 sm:h-10 cursor-pointer' onClick={handleSignOut} viewBox="0 -960 960 960" fill="#EF4444"><path d="M200-120q-33 0-56.5-23.5T120-200v-160h80v160h560v-560H200v160h-80v-160q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm220-160-56-58 102-102H120v-80h346L364-622l56-58 200 200-200 200Z" /></svg>
        </div>
    );
}

export default HeaderEvaluation;
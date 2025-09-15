import { useEffect, useState, useRef } from "react";
import AdminCards from "./cards/AdminCards";
import AdminGraph from "./Graphs/AdminGraph";
import AdminGraph2 from "./Graphs/AdminGraph2";

const AdminHome = () => {
    interface User {
        name: string;
        email: string;
        role: {
            type: string;
        };
    }

    const [firstName, setFirstName] = useState<string>('');
    const [cardsHeight, setCardsHeight] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState<string>(
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    );

    const cardsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userData: User = JSON.parse(userStr);
                if (userData.name) {
                    const names = userData.name.split(' ');
                    setFirstName(names[0]);
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    useEffect(() => {
        const updateHeight = () => {
            if (cardsRef.current) {
                setCardsHeight(cardsRef.current.offsetHeight);
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(
                new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            );
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const currentDate = new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="flex flex-col">
            <p className="text-3xl text-blue-400 font-bold mt-4 mb-1 px-4">
                Welcome <span className="text-green-700">{firstName} 👏</span>
            </p>
            <p className="text-[13px] px-4 text-gray-400 mb-6">Your leadership powers the platform.</p>

            <div className="w-full py-6 px-4 bg-gray-50 rounded-lg shadow-sm flex flex-col">
                <div className="flex flex-row gap-10">
                    <div
                        className="hidden md:block relative w-96"
                        style={{ height: cardsHeight ? `${cardsHeight}px` : 'auto' }}
                    >
                        <img
                            src="/assets/images/1.jpg"
                            alt="image"
                            className="w-full h-full object-cover rounded-[10px]"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/40 rounded-[10px] text-center p-2">
                            <p className="text-sm mb-1">{currentTime}</p>
                            <p className="text-2xl font-bold">{currentDate}</p>
                        </div>
                    </div>

                    <div ref={cardsRef} className="flex-1 min-w-0">
                        <AdminCards />
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full h-full">
                    <h2 className="text-xl font-semibold mb-4">Line Chart Example</h2>
                    <AdminGraph />
                </div>
                <div className="w-full h-full">
                    <h2 className="text-xl font-semibold mb-4">Bar Chart Example</h2>
                    <AdminGraph2 />
                </div>
            </div>
        </div>
    );
};

export default AdminHome;

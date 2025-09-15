import { useEffect, useState } from 'react';
import Leftsidebar from "../components/Leftsidebar";
import Topbar from "../components/Topbar";
import NotesSection from "../components/cards/NotesSection";

interface User {
  name: string;
  email: string;
  role: {
    type: string;
  };
}

const Notes = () => {

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  return (
    <div className="flex h-screen w-full overflow-y-auto hide-scrollbar bg-gray-50">
      <div className="hidden md:flex">
        <Leftsidebar />
      </div>

      <div className="flex flex-col flex-1 overflow-x-hidden">
        <div className="sticky top-0 z-50">
          <Topbar userName={user?.name || ''}/>
        </div>

        <div className="w-full">
          <div className="hidden md:block relative w-full mt-4 mb-11 ml-6 mr-6">
            <img
              src="/assets/images/notes.jpg"
              alt="Data illustration"
              className="w-[900px] h-72 rounded-[10px] object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <h1 className="text-3xl font-bold mb-2 text-white mr-20">
                Access Well-Structured Study Notes
              </h1>
              <p className="text-xl text-white font-thin mr-20">
                Review key concepts, summaries, and examples to boost your
                understanding and exam prep.
              </p>
            </div>
          </div>
        </div>
        <NotesSection />
      </div>
    </div>
  );
};

export default Notes;

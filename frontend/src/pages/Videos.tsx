import { useEffect, useState } from 'react';
import VideoSection from "../components/cards/VideoSection";
import Leftsidebar from "../components/Leftsidebar";
import Topbar from "../components/Topbar";

interface User {
  name: string;
  email: string;
  role: {
    type: string;
  };
}

const Videos = () => {

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
    <div className="flex h-screen w-full hide-scrollbar bg-gray-50">
      <div className="hidden md:flex">
        <Leftsidebar />
      </div>

      <div className="flex flex-col flex-1 overflow-x-hidden">
        <div className="sticky top-0 z-50">
          <Topbar userName={user?.name || ''} />
        </div>

        <div className="w-full">
          <div className="hidden md:block relative w-full mt-4 mb-11 ml-6 mr-6">
            <img
              src="/assets/images/video.jpg"
              alt="Data illustration"
              className="w-[900px] h-72 rounded-[10px] object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <h1 className="text-3xl font-bold mb-2 text-white mr-20">
                Dive Into Engaging Video Lessons
              </h1>
              <p className="text-xl text-white font-thin mr-20">
                Learn at your own pace with handpicked videos – anytime,
                anywhere.
              </p>
            </div>
          </div>
        </div>
        <VideoSection/>
      </div>
    </div>
  );
};

export default Videos;

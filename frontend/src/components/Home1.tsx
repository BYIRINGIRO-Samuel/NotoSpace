import { useEffect, useState } from 'react';
import OverviewCards1 from "./cards/OverviewCards1";
import PopularCourse1 from "./cards/PopularCourse1";
import MyCourse1 from "./MyCourse1";

interface User {
  name: string;
  email: string;
  role: {
    type: string;
  };
}

const Home1 = () => {
  const [firstName, setFirstName] = useState<string>('');

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

  return (
    <>
      <p className="text-3xl text-blue-400 font-bold mt-4 mb-6 px-4">Welcome <span className="text-green-700">Tr. {firstName}👏</span></p>
      <div className="w-full py-6 px-4 bg-gray-50 rounded-lg shadow-sm flex flex-col">
        <h1 className="text-2xl text-gray-800 font-bold mb-4">Overview</h1>
        <OverviewCards1 />
        <h2 className="text-2xl text-gray-800 font-bold mb-4 mt-6">Courses Management</h2>
        <PopularCourse1 />
        <h2 className="text-2xl text-gray-800 font-bold mb-4 mt-6">My Progress</h2>
        <MyCourse1 />
      </div>
    </>
  );
};

export default Home1;

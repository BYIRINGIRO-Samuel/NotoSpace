import { useEffect, useState } from "react";
import axios from "axios";

const AdminCards = () => {
  const [stats, setStats] = useState({
    teachers: { total: 0 },
    students: { total: 0 },
    classes: { total: 0 },
    courses: { total: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/users/admins/dashboard-stats", { withCredentials: true });
        if (response.status === 200 && response.data && response.data.stats) {
          setStats({
            teachers: response.data.stats.teachers || { total: 0 },
            students: response.data.stats.students || { total: 0 },
            classes: response.data.stats.classes || { total: 0 },
            courses: response.data.stats.courses || { total: 0 },
          });
        }
      } catch (error) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const carddata = [
    {
      text: "Total Teachers",
      count: stats.teachers.total || 0,
      bgcolor: "bg-blue-400",
    },
    {
      text: "Total Students",
      count: stats.students.total || 0,
      bgcolor: "bg-indigo-700",
    },
    {
      text: "Total Classes",
      count: stats.classes.total || 0,
      bgcolor: "bg-blue-500",
    },
    {
      text: "Total Courses",
      count: stats.courses.total || 0,
      bgcolor: "bg-rose-400",
    },
  ];

  return (
    <div className="flex flex-row gap-4 ml-3 pb-4 overflow-x-auto hide-scrollbar sm:grid sm:[grid-template-columns:repeat(2,max-content)] sm:overflow-x-visible">
      {loading ? (
        <div className="flex justify-center items-center py-8 w-full">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        </div>
      ) : (
        carddata.map((card, index) => (
          <div
            className={`flex flex-col gap-3 border border-blue-200 rounded-[15px] py-6 px-4 ${card.bgcolor} w-52 flex-shrink-0`}
            key={index}
          >
            <p className="text-white font-bold">{card.text}</p>
            <p className="text-white text-[25px]">{card.count}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminCards;

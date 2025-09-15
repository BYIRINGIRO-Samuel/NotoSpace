import Topbar from '../components/Topbar';
import Leftsidebar from '../components/Leftsidebar';
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const initialAssignmentsData = [
  {
    id: 'assign-1',
    title: "Mathematics Homework Set 1",
    description:
      "Complete exercises from chapter 3 on calculus differentiation.",
    instructor: "Dr. Smith",
    dueDate: "2024-04-30",
  },
  {
    id: 'assign-2',
    title: "Physics Lab Report - Experiment 2",
    description:
      "Write a detailed report on the results of the second physics experiment.",
    instructor: "Ms. Davis",
    dueDate: "2024-05-05",
  },
  {
    id: 'assign-3',
    title: "History Essay - World War I",
    description: "Write a 1500-word essay analyzing the causes of World War I.",
    instructor: "Mr. Johnson",
    dueDate: "2024-05-10",
  },
  {
    id: 'assign-4',
    title: "Mathematics Homework Set 1",
    description:
      "Complete exercises from chapter 3 on calculus differentiation.",
    instructor: "Dr. Smith",
    dueDate: "2024-04-30",
  },
  {
    id: 'assign-5',
    title: "Physics Lab Report - Experiment 2",
    description:
      "Write a detailed report on the results of the second physics experiment.",
    instructor: "Ms. Davis",
    dueDate: "2024-05-05",
  },
  {
    id: 'assign-6',
    title: "History Essay - World War I",
    description: "Write a 1500-word essay analyzing the causes of World War I.",
    instructor: "Mr. Johnson",
    dueDate: "2024-05-10",
  },
  {
    id: 'assign-7',
    title: "Mathematics Homework Set 1",
    description:
      "Complete exercises from chapter 3 on calculus differentiation.",
    instructor: "Dr. Smith",
    dueDate: "2024-04-30",
  },
  {
    id: 'assign-8',
    title: "Physics Lab Report - Experiment 2",
    description:
      "Write a detailed report on the results of the second physics experiment.",
    instructor: "Ms. Davis",
    dueDate: "2024-05-05",
  },
  {
    id: 'assign-9',
    title: "History Essay - World War I",
    description: "Write a 1500-word essay analyzing the causes of World War I.",
    instructor: "Mr. Johnson",
    dueDate: "2024-05-10",
  },
];

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructor: string;
  dueDate: string;
}

const Assignments = () => {
  const [assignments] = useState<Assignment[]>(initialAssignmentsData);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Assignment | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const menuContainer = document.querySelector(".menu-container");
      if (menuContainer && !menuContainer.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleMenuClick = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleDeleteClick = (assignment: Assignment) => {
    setItemToDelete(assignment);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      // Here you would typically call an API to delete the assignment
      toast.success(`Assignment "${itemToDelete.title}" deleted.`);
      setShowDeleteModal(false);
      setItemToDelete(null);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:block flex-shrink-0 w-72 bg-white shadow-lg">
        <Leftsidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="sticky top-0 z-40 bg-white border-b">
          <Topbar userName="Student" />
        </header>

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto p-6">
         <div className="flex justify-between items-center mb-6">
           <h2 className="text-2xl font-bold md:hidden">Assignments</h2>
           <div className="flex items-center gap-4">
             <div className="relative w-60">
               <input
                 type="text"
                 placeholder="Search assignments..."
                 className="w-full pl-10 pr-4 py-2 rounded-[8px] bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm border border-gray-200"
               />
               <img
                 src="/assets/icons/search.svg"
                 alt="search"
                 className="absolute top-1/2 left-3 transform -translate-y-1/2 w-4 h-4 text-gray-400"
               />
             </div>
           </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {assignments.map((assignment) => (
             <div
               key={assignment.id}
               className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative"
             >
               <div className="flex justify-between items-start mb-2">
                 <h3 className="font-semibold text-lg line-clamp-1 flex-1 mr-4">
                   {assignment.title}
                 </h3>
                 <div className="relative menu-container">
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       handleMenuClick(assignment.id);
                     }}
                     className="p-1 hover:bg-gray-100 rounded-full"
                   >
                     <svg
                       className="w-5 h-5 text-gray-500"
                       fill="none"
                       stroke="currentColor"
                       viewBox="0 0 24 24"
                       xmlns="http://www.w3.org/2000/svg"
                     >
                       <path
                         strokeLinecap="round"
                         strokeLinejoin="round"
                         strokeWidth={2}
                         d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                       />
                     </svg>
                   </button>
                   {openMenuId === assignment.id && (
                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                       <button
                         onClick={(e) => {
                           e.stopPropagation();
                           handleDeleteClick(assignment);
                         }}
                         className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                       >
                         Delete
                       </button>
                     </div>
                   )}
                 </div>
               </div>
               <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                 {assignment.description}
               </p>
               <div className="flex items-center justify-between text-sm text-gray-500">
                 <div className="flex items-center gap-1">
                   <svg
                     className="w-4 h-4"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                   >
                     <path d="M5.121 17.804A13.939 13.939 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 3a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   <span>{assignment.instructor}</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <svg
                     className="w-4 h-4"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                   >
                     <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
                   <span>Due: {assignment.dueDate}</span>
                 </div>
               </div>
               <div className="absolute bottom-2 right-2">
                 <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors">
                   <img
                     src="/assets/icons/download.svg"
                     alt="Download"
                     className="w-5 h-5"
                   />
                 </button>
               </div>
             </div>
           ))}
         </div>
         {showDeleteModal && itemToDelete && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
             <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
               <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
               <p className="text-gray-600 mb-6">
                 Are you sure you want to delete "{itemToDelete.title}"? This
                 action cannot be undone.
               </p>
               <div className="flex justify-end gap-4">
                 <button
                   onClick={() => {
                     setShowDeleteModal(false);
                     setItemToDelete(null);
                   }}
                   className="px-4 py-2 text-gray-600 hover:text-gray-800"
                 >
                   Cancel
                 </button>
                 <button
                   onClick={handleConfirmDelete}
                   className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                 >
                   Delete
                 </button>
               </div>
             </div>
           </div>
         )}
        </main>
      </div>
    </div>
  );
};

export default Assignments;

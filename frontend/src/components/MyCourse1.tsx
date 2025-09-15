import React from 'react';

interface Course {
  id: number;
  icon: string;
  name: string;
  lessonsProgress: string;
  status: 'Complete' | 'Ongoing';
  level: string;
  category: string;
}

const MyCourse1: React.FC = () => {
  const courses: Course[] = [
    {
      id: 1,
      icon: '/assets/images/monster.jpg',
      name: 'Mastering Design System',
      lessonsProgress: '15/15',
      status: 'Complete',
      level: 's3',
      category: '3D modles',
    },
    {
      id: 2,
      icon: '/assets/images/marketing.jpg', 
      name: 'UI/UX Design',
      lessonsProgress: '12/15',
      status: 'Ongoing',
      level: 'p5',
      category: 'Design',
    },
    {
      id: 3,
      icon: '/assets/images/image2.png', 
      name: 'Learn Data Analyst',
      lessonsProgress: '8/20',
      status: 'Ongoing',
      level: 'year2',
      category: 'Data',
    },
  ];

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      <div className="grid grid-cols-5 gap-4 text-gray-500 text-sm font-medium border-b border-gray-200 pb-2 mb-2">
        <div className="col-span-2 text-purple-950">Course Name</div>
        <div className='text-purple-950'>Lessons</div>
        <div className='text-purple-950'>Status</div>
        <div className='text-purple-950'>Class</div>
      </div>

      <div>
        {courses.map((course) => (
          <div key={course.id} className="grid grid-cols-5 gap-4 items-center border-b border-gray-100 py-3">
            <div className="col-span-2 flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="text-gray-800 font-medium text-sm">{course.name}</span>
            </div>
            <div className="text-gray-700 text-sm">{course.lessonsProgress}</div>
            <div className={`text-xs font-semibold px-2 py-1 rounded-[6px] text-center ${
                course.status === 'Complete' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
              }`}>
              {course.status}
            </div>
            <div className="text-gray-700 text-sm pl-4">{course.level}</div>
            <div className="text-purple-900 text-sm font-bold">{course.category}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourse1;

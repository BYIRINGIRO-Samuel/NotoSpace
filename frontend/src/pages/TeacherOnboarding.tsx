import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// Assuming a type definition for Class and Course might be needed later
// import type { Class, Course } from "../types"; 

interface TeacherClassData {
  className: string;
  courseNames: string[];
}

const TeacherOnboarding = () => {
  const navigate = useNavigate();
  const [teacherClasses, setTeacherClasses] = useState<TeacherClassData[]>([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [availableClasses, setAvailableClasses] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all classes for the teacher's school on mount
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    // const user = JSON.parse(userStr);
    // const schoolId = user?.school?._id;
    // if (!schoolId) return;
    axios.get('/api/users/teachers/list/available-classes', { withCredentials: true })
      .then(res => {
        if (res.status === 200 && Array.isArray(res.data.classes)) {
          setAvailableClasses(res.data.classes);
        } else {
          setAvailableClasses([]);
        }
      })
      .catch(() => setAvailableClasses([]));
  }, []);

  // When a class is selected, set its courses
  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedCourses([]);
    setError("");
    setSuccess("");
    const selectedClass = availableClasses.find(cls => cls._id === classId);
    if (selectedClass && Array.isArray(selectedClass.courses)) {
      setAvailableCourses(selectedClass.courses);
    } else {
      setAvailableCourses([]);
    }
  };

  const handleCourseSelect = (courseName: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseName)
        ? prev.filter(course => course !== courseName)
        : [...prev, courseName]
    );
  };

  const handleAddClassWithCourses = () => {
    setError("");
    setSuccess("");
    if (!selectedClassId) {
      setError("Please select a class.");
      return;
    }
    if (selectedCourses.length === 0) {
      setError("Please select at least one course for the selected class.");
      return;
    }
    const selectedClass = availableClasses.find(cls => cls._id === selectedClassId);
    if (!selectedClass) {
      setError("Selected class not found.");
      return;
    }
    const existingClassIndex = teacherClasses.findIndex(tc => tc.className === selectedClass.name);
    if (existingClassIndex > -1) {
      // If class already exists, update its courses
      const updatedTeacherClasses = [...teacherClasses];
      updatedTeacherClasses[existingClassIndex].courseNames = [
        ...new Set([...updatedTeacherClasses[existingClassIndex].courseNames, ...selectedCourses])
      ];
      setTeacherClasses(updatedTeacherClasses);
      setSuccess(`Updated courses for ${selectedClass.name}.`);
    } else {
      setTeacherClasses(prev => [...prev, { className: selectedClass.name, courseNames: selectedCourses }]);
      setSuccess(`Added ${selectedClass.name} with selected courses.`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await axios.post('/api/users/teachers/onboarding', {
        classId: selectedClassId,
        courseIds: selectedCourses
      }, { withCredentials: true });
      if (res.status === 200) {
        setSuccess('Onboarding data saved successfully!');
        setTimeout(() => {
          navigate('/teacherdashboard');
        }, 1000);
      } else {
        setError('Failed to save onboarding data.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save onboarding data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Teacher Onboarding
          </h1>
          {/* Progress bar can be added here if multiple steps are introduced later */}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded-lg mb-4">
            {success}
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-700">
            Select Classes and Courses
          </h2>
          
          <div className="space-y-4">
            {/* Class Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="classSelect">
                Select Class <span className="text-red-500">*</span>
              </label>
              <select
                id="classSelect"
                value={selectedClassId}
                onChange={(e) => handleClassSelect(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">-- Select a Class --</option>
                {availableClasses.map(cls => (
                  <option key={cls._id} value={cls._id}>{cls.name}</option>
                ))}
              </select>
            </div>

            {/* Course Selection */}
            {availableCourses.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Select Courses for {availableClasses.find(cls => cls._id === selectedClassId)?.name || ""}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {availableCourses.map((course: any) => (
                    <label key={course._id}>
                      <input
                        type="checkbox"
                        value={course._id}
                        checked={selectedCourses.includes(course._id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedCourses([...selectedCourses, course._id]);
                          } else {
                            setSelectedCourses(selectedCourses.filter(id => id !== course._id));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      {course.name}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAddClassWithCourses}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedClassId || selectedCourses.length === 0}
            >
              Add Selected Courses to Class
            </button>
          </div>

          {/* Display Added Classes and Courses */}
          {teacherClasses.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Classes and Courses Added:
              </h3>
              <div className="space-y-4">
                {teacherClasses.map((classItem, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{classItem.className}</h4>
                      {/* Remove button for a class */}
                      <button
                        onClick={() => {
                          setTeacherClasses(teacherClasses.filter((_, i) => i !== index));
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove Class
                      </button>
                    </div>
                    <ul className="space-y-1">
                      {classItem.courseNames.map((course, courseIndex) => (
                        <li
                          key={courseIndex}
                          className="text-sm text-gray-600"
                        >
                          {course}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner" style={{
                border: '2px solid #f3f3f3',
                borderTop: '2px solid #3498db',
                borderRadius: '50%',
                width: 16,
                height: 16,
                animation: 'spin 1s linear infinite',
                display: 'inline-block',
                verticalAlign: 'middle',
                marginRight: 8
              }} />
            ) : 'Complete Onboarding'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default TeacherOnboarding;

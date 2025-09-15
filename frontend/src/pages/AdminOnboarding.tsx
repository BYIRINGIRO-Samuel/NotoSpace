import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Course } from "../constants/courses";
import { primaryCourses, secondaryCourses, advancedLevelCombinations } from "../constants/courses";
import axios from "axios";

interface Class {
  name: string;
  courses: string[];
  academicLevel: string;
}

interface SchoolData {
  name: string;
  email: string;
  profilePicture: string;
  classes: Class[];
}

const AdminOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCourses, setShowCourses] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [manualCourseName, setManualCourseName] = useState("");
  const [loading, setLoading] = useState(false);

  const [schoolData, setSchoolData] = useState<SchoolData>({
    name: "",
    email: "",
    profilePicture: "",
    classes: [],
  });

  const [newClass, setNewClass] = useState<Class>({
    name: "",
    courses: [],
    academicLevel: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSchoolData({
          ...schoolData,
          profilePicture: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClassInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewClass({ ...newClass, name: value });
    
    setSelectedCourses([]);
    setShowCourses(false);
    setError("");
    setNewClass(prevState => ({ ...prevState, academicLevel: "" }));

    const lowerValue = value.trim().toLowerCase();
    let academicLevel = "";
    let coursesToShow: Course[] = [];

    if (lowerValue.startsWith("primary") || lowerValue.match(/^p[1-6]$/)) {
      academicLevel = "primary";
      coursesToShow = [...primaryCourses];
    } else if (lowerValue.match(/^s[1-3]$/)) {
      academicLevel = "secondary";
      coursesToShow = [...secondaryCourses];
    } else if (lowerValue.match(/^s[4-6]/)) {
      academicLevel = "secondary";

      const comboAbbreviationMatch = lowerValue.match(/^s[4-6]\s*([a-z]{3})$/);
      
      let matchedCombo = null;
      if (comboAbbreviationMatch && comboAbbreviationMatch[1]) {
        const abbreviation = comboAbbreviationMatch[1];
        matchedCombo = advancedLevelCombinations.find(combo => 
          combo.name.toLowerCase().startsWith(abbreviation)
        );
      }

       if (!matchedCombo) {
           setError("Please enter a valid advanced level class name (e.g., S4 PCM, S5 HGL, S6 MCB)");
           return;
       }

      coursesToShow = [...matchedCombo.courses];

    }

    if (coursesToShow.length > 0) {
      setSelectedCourses(coursesToShow.map(course => ({...course, selected: false})));
      setShowCourses(true);
      setNewClass(prevState => ({ ...prevState, academicLevel: academicLevel }));
    }
  };

  const handleCourseSelection = (courseName: string) => {
    setSelectedCourses(prevCourses => 
      prevCourses.map(course => 
        course.name === courseName 
          ? { ...course, selected: !course.selected }
          : course
      )
    );
  };

  const handleAddManualCourse = () => {
    setError("");
    setSuccess("");
    if (!manualCourseName.trim()) {
      setError("Manual course name cannot be empty");
      return;
    }

    const newCourse: Course = { name: manualCourseName.trim(), selected: true };
    const isDuplicate = selectedCourses.some(
      course => course.name.toLowerCase() === newCourse.name.toLowerCase()
    );
    if (isDuplicate) {
      setError("Course already exists");
      return;
    }

    setSelectedCourses(prevCourses => [...prevCourses, newCourse]);
    setManualCourseName("");
    setShowCourses(true);
    setSuccess("Custom course added");
  };

  const handleAddClass = () => {
    setError("");
    setSuccess("");

    if (!newClass.name.trim()) {
      setError("Class name is required");
      return;
    }

    const selectedCoursesList = selectedCourses
      .filter(course => course.selected)
      .map(course => course.name);
      
    if (showCourses && selectedCoursesList.length === 0) { 
      setError("Please select at least one course");
      return;
    }

    const isDuplicate = schoolData.classes.some(
      (cls) => cls.name.trim().toLowerCase() === newClass.name.trim().toLowerCase()
    );
    if (isDuplicate) {
      setError("Class name already exists");
      return;
    }

    const newClassWithCourses = {
      ...newClass,
      courses: selectedCoursesList,
    };

    setSchoolData({
      ...schoolData,
      classes: [...schoolData.classes, newClassWithCourses],
    });

    setNewClass({
      name: "",
      courses: [],
      academicLevel: "",
    });
    setSelectedCourses([]);
    setShowCourses(false);
    setSuccess("Class added successfully with selected courses");
  };

  const handleNext = () => {
    setError("");
    if (currentStep === 1) {
      if (!schoolData.name.trim() || !schoolData.email.trim()) {
        setError("School Name and Email are required.");
        return;
      }
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!emailRegex.test(schoolData.email.trim())) {
        setError("Please enter a valid email address.");
        return;
      }
    }

    if (currentStep === 2) {
      if (schoolData.classes.length === 0) {
        setError("Please add at least one class.");
        return;
      }
    }

    setCurrentStep(currentStep + 1);
    setSuccess("");
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    if (!schoolData.name.trim() || !schoolData.email.trim() || schoolData.classes.length === 0) {
      setError("Please complete all required fields and add at least one class.");
      setLoading(false);
       return;
    }

    const classesWithMissingAcademicLevel = schoolData.classes.filter(cls => !cls.academicLevel);
    if (classesWithMissingAcademicLevel.length > 0) {
        setError(`Classes are missing academic level information. Please re-add them, ensuring a valid class name format was used.`);
        setLoading(false);
        return;
    }

    try {
      const dataToSubmit = {
        name: schoolData.name.trim(),
        email: schoolData.email.trim(),
        profilePicture: schoolData.profilePicture,
        classes: schoolData.classes.map(cls => ({
          name: cls.name.trim(),
          courses: cls.courses,
          academicLevel: cls.academicLevel
        }))
      };
      
      console.log("Submitting School Data:", dataToSubmit); 
      const response = await axios.post('/api/schools/create', dataToSubmit);
      
      if (response.status === 201) {
        setSuccess("School setup completed successfully!");
        
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.school = response.data.school || response.data.createdSchool || true;
          localStorage.setItem('user', JSON.stringify(user));
        }
        navigate("/admindashboard", { replace: true });
      } else {
        setError("Failed to submit school data: Received unexpected status code.");
      }
    } catch (error: any) {
      console.error("Error submitting school data:", error);
      setError(error.response?.data?.message || "Failed to submit school data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            School Setup
          </h1>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
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

        {loading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-2 rounded-lg mb-4 flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="schoolName">
                  School Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="schoolName"
                  type="text"
                  value={schoolData.name}
                  onChange={(e) =>
                    setSchoolData({ ...schoolData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter school name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="schoolEmail">
                  School Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="schoolEmail"
                  type="email"
                  value={schoolData.email}
                  onChange={(e) =>
                    setSchoolData({ ...schoolData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter school email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="schoolLogo">
                  School Logo (Optional)
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  {schoolData.profilePicture && (
                    <img
                      src={schoolData.profilePicture}
                      alt="School logo"
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                  )}
                  <input
                    id="schoolLogo"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">
              Add Classes
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="className">
                  Class Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="className"
                  type="text"
                  value={newClass.name}
                  onChange={handleClassInput}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Primary 1, S1, S4 PCM"
                  required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter the class name (e.g., Primary 1-6, S1-S6) to see and select courses, or add custom courses.
                </p>
              </div>

              <div className="border border-gray-300 rounded-lg p-4 space-y-4">
                 <h3 className="text-lg font-medium text-gray-700">Add Custom Course</h3>
                 <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualCourseName}
                      onChange={(e) => setManualCourseName(e.target.value)}
                      className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter custom course name"
                    />
                    <button
                      onClick={handleAddManualCourse}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!manualCourseName.trim()}
                    >
                      Add Course
                    </button>
                 </div>
              </div>

              {showCourses && selectedCourses.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    Select Courses for {newClass.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedCourses.map((course, index) => (
                      <div key={course.name} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`course-${index}`}
                          checked={course.selected || false}
                          onChange={() => handleCourseSelection(course.name)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`course-${index}`}
                          className="text-sm text-gray-700"
                        >
                          {course.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handleAddClass}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newClass.name.trim() || (showCourses && !selectedCourses.some(course => course.selected))}
              >
                Add Class with Selected Courses
              </button>
            </div>

            {schoolData.classes.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Added Classes:
                </h3>
                <div className="space-y-4">
                  {schoolData.classes.map((classItem, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{classItem.name}</h4>
                        <button
                          onClick={() => {
                            setSchoolData({
                              ...schoolData,
                              classes: schoolData.classes.filter(
                                (_, i) => i !== index
                              ),
                            });
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove Class
                        </button>
                      </div>
                      <ul className="space-y-1">
                        {classItem.courses.map((course, courseIndex) => (
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
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">
              Review and Submit
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">School Information</h3>
                <p>Name: {schoolData.name || 'N/A'}</p>
                <p>Email: {schoolData.email || 'N/A'}</p>
                {schoolData.profilePicture && (
                  <img
                    src={schoolData.profilePicture}
                    alt="School logo"
                    className="h-20 w-20 object-cover rounded-lg mt-2"
                  />
                )}
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Classes</h3>
                <div className="space-y-4 mt-2">
                  {schoolData.classes.length > 0 ? (
                    schoolData.classes.map((classItem, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <h4 className="font-medium">{classItem.name}</h4>
                        <ul className="mt-2 space-y-1">
                          {classItem.courses.length > 0 ? (
                            classItem.courses.map((course, courseIndex) => (
                              <li
                                key={courseIndex}
                                className="text-sm text-gray-600"
                              >
                                {course}
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-gray-600">No courses added.</li>
                          )}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">No classes added.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          {currentStep > 1 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Previous
            </button>
          )}
          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentStep === 1 && (!schoolData.name.trim() || !schoolData.email.trim()) || loading}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!schoolData.name.trim() || !schoolData.email.trim() || schoolData.classes.length === 0 || loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOnboarding;

import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import Topbar from '../../components/Topbar';
import Teacherleftsidebar from '../../components/teacherleftsidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface NoteUpload {
  title: string;
  description: string;
  className: string;
  courseName: string;
  file: File | null;
}

interface Class {
  _id: string;
  name: string;
  courses: Course[];
}

interface Course {
  _id: string;
  name: string;
}

const UploadNote = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [noteData, setNoteData] = useState<NoteUpload>({
    title: '',
    description: '',
    className: '',
    courseName: '',
    file: null,
  });

  // Fetch teacher's classes and courses
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('/api/users/teachers/list/classes', { withCredentials: true });
        if (response.status === 200 && Array.isArray(response.data.classes)) {
          setClasses(response.data.classes);
        }
      } catch (error) {
        console.error('Failed to fetch classes:', error);
        toast.error('Failed to fetch classes');
      }
    };
    fetchClasses();
  }, []);

  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    const selectedClassData = classes.find(cls => cls._id === classId);
    if (selectedClassData) {
      setCourses(selectedClassData.courses || []);
      setNoteData(prev => ({ ...prev, className: selectedClassData.name, courseName: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is a document type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain'
      ];
      
      if (allowedTypes.includes(file.type)) {
        setNoteData(prev => ({ ...prev, file }));
      } else {
        toast.error('Please upload a valid document file (PDF, DOC, DOCX, XLS, XLSX, or TXT)');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteData.file || !noteData.title || !noteData.className || !noteData.courseName) {
      toast.error('Please fill in all required fields and select a document');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', noteData.title);
      formData.append('description', noteData.description);
      formData.append('className', noteData.className);
      formData.append('courseName', noteData.courseName);
      formData.append('file', noteData.file);

      const response = await axios.post('/api/notes/create', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        toast.success('Note uploaded successfully!');
        setNoteData({ title: '', description: '', className: '', courseName: '', file: null });
        setSelectedClass('');
        setCourses([]);
        navigate('/teacherdashboard/lessons/uploadnotes');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to upload note. Please try again.';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar - Hidden on mobile, visible on md and up */}
      <div className="hidden md:block w-72 flex-shrink-0 overflow-y-auto hide-scrollbar">
        <Teacherleftsidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden w-full md:w-auto">
        {/* Mobile Header - Visible only on mobile */}
        <div className="md:hidden flex items-center p-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-2">
            <svg
              className="w-8 h-8 text-[#1DA1F2]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 20.5L21 12 3 3.5v7l12 1.5-12 1.5v7z" fill="#1DA1F2" />
            </svg>
            <h1 className="text-xl font-bold text-blue-500">LearnLite</h1>
          </div>
        </div>

        {/* Topbar - Hidden on mobile */}
        <div className="hidden md:block">
          <Topbar />
        </div>
        <div className="border-b border-gray-200"></div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 hide-scrollbar">
          <button 
            onClick={() => navigate('/teacherdashboard/lessons/uploadnotes')}
            className="mb-4 hover:opacity-80 transition-opacity"
          >
            <img src="/assets/icons/back.svg" alt="back" className='h-8 w-8' />
          </button>
          <h1 className="text-2xl text-center md:text-3xl font-bold mb-6 md:mb-8">Upload Note</h1>
          
          <div className="max-w-2xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-lg md:text-xl font-semibold">Upload New Note</h2>
            </div>

            <div className="p-4 md:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Note Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={noteData.title}
                    onChange={(e) => setNoteData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter note title"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                    Class *
                  </label>
                  <select
                    id="class"
                    value={selectedClass}
                    onChange={(e) => handleClassChange(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                    Course *
                  </label>
                  <select
                    id="course"
                    value={noteData.courseName}
                    onChange={(e) => setNoteData(prev => ({ ...prev, courseName: e.target.value }))}
                    required
                    disabled={!selectedClass}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course.name}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={noteData.description}
                    onChange={(e) => setNoteData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter note description"
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="note" className="block text-sm font-medium text-gray-700">
                    Document File *
                  </label>
                  <input
                    id="note"
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                    onChange={handleFileChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-sm text-gray-500">
                    Supported formats: PDF, DOC, DOCX, XLS, XLSX, TXT (Max size: 10MB)
                  </p>
                </div>

                <button
                  type="submit" 
                  disabled={uploading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {uploading ? 'Uploading...' : 'Upload Note'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadNote; 
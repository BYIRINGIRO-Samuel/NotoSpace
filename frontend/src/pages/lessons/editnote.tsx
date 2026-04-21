import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Topbar from '../../components/Topbar';
import Teacherleftsidebar from '../../components/teacherleftsidebar';

interface NoteData {
  title: string;
  class: string;
  description: string;
  fileType: string;
  fileSize: string;
}

const EditNote = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [noteData, setNoteData] = useState<NoteData>({
    title: '',
    class: '',
    description: '',
    fileType: '',
    fileSize: ''
  });

  
  useEffect(() => {
    const fetchNoteData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        // Simulating API call with timeout
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data - replace with actual API response
        const mockNotes = {
          'note-1': {
            title: 'Mathematics Formulas',
            class: 'Class 10',
            description: 'Complete collection of algebra and calculus formulas',
            fileType: 'PDF',
            fileSize: '2.4 MB'
          },
          'note-2': {
            title: 'Physics Laws Summary',
            class: 'Class 11',
            description: 'Comprehensive summary of Newton\'s laws and motion principles',
            fileType: 'DOCX',
            fileSize: '1.8 MB'
          },
          'note-3': {
            title: 'Chemistry Periodic Table',
            class: 'Class 12',
            description: 'Detailed periodic table with element properties',
            fileType: 'PDF',
            fileSize: '3.2 MB'
          },
          'note-4': {
            title: 'Mathematics Formulas (Advanced)',
            class: 'Class 10',
            description: 'Complete collection of algebra and calculus formulas',
            fileType: 'PDF',
            fileSize: '2.4 MB'
          },
          'note-5': {
            title: 'Physics Laws Summary (Advanced)',
            class: 'Class 11',
            description: 'Comprehensive summary of Newton\'s laws and motion principles',
            fileType: 'DOCX',
            fileSize: '1.8 MB'
          },
          'note-6': {
            title: 'Chemistry Periodic Table (Advanced)',
            class: 'Class 12',
            description: 'Detailed periodic table with element properties',
            fileType: 'PDF',
            fileSize: '3.2 MB'
          },
          'note-7': {
            title: 'Mathematics Formulas (Basic)',
            class: 'Class 10',
            description: 'Complete collection of algebra and calculus formulas',
            fileType: 'PDF',
            fileSize: '2.4 MB'
          },
          'note-8': {
            title: 'Physics Laws Summary (Basic)',
            class: 'Class 11',
            description: 'Comprehensive summary of Newton\'s laws and motion principles',
            fileType: 'DOCX',
            fileSize: '1.8 MB'
          },
          'note-9': {
            title: 'Chemistry Periodic Table (Basic)',
            class: 'Class 12',
            description: 'Detailed periodic table with element properties',
            fileType: 'PDF',
            fileSize: '3.2 MB'
          }
        };

        if (!id || !mockNotes[id as keyof typeof mockNotes]) {
          throw new Error('Note not found');
        }

        const noteData = mockNotes[id as keyof typeof mockNotes];
        setNoteData(noteData);
      } catch (error) {
        toast.error('Failed to load note data');
        navigate('/teacherdashboard/lessons/uploadnotes');
      } finally {
        setLoading(false);
      }
    };

    fetchNoteData();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!noteData.title || !noteData.class || !noteData.description) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate API response
      console.log('Updated note data:', {
        id,
        ...noteData
      });

      toast.success('Note updated successfully');
      navigate('/teacherdashboard/lessons/uploadnotes');
    } catch (error) {
      toast.error('Failed to update note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden md:block w-72 flex-shrink-0 overflow-y-auto hide-scrollbar">
        <Teacherleftsidebar />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        
        <div className="flex-1 overflow-y-auto p-6 hide-scrollbar relative">
         
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
               
              </div>
            </div>
          )}

          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => navigate('/teacherdashboard/lessons/uploadnotes')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                disabled={loading}
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold">Edit Note</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
              {/* Form fields with loading state */}
              <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={noteData.title}
                  onChange={(e) => setNoteData({ ...noteData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Enter note title"
                  required
                  disabled={loading}
                />
              </div>

              <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  id="class"
                  value={noteData.class}
                  onChange={(e) => setNoteData({ ...noteData, class: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  required
                  disabled={loading}
                >
                  <option value="">Select a class</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>

              <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={noteData.description}
                  onChange={(e) => setNoteData({ ...noteData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Enter note description"
                  required
                  disabled={loading}
                />
              </div>

              <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current File Information
                </label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
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
                    <div>
                      <p className="font-medium">{noteData.fileType}</p>
                      <p className="text-sm text-gray-500">{noteData.fileSize}</p>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  To change the file, please upload a new note
                </p>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/teacherdashboard/lessons/uploadnotes')}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditNote; 

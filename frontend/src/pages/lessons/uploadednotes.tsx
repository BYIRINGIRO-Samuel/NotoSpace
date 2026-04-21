import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Teacherleftsidebar from '../../components/teacherleftsidebar';
import TrTopbar from '../../components/TrTopbar';

interface Note {
  id: string;
  title: string;
  description: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  downloads: number;
}

const UploadNotes = () => {
  const navigate = useNavigate();
  const [notes] = useState<Note[]>([
    {
      id: 'note-1',
      title: 'Mathematics Formulas',
      description: 'Complete collection of algebra and calculus formulas',
      fileType: 'PDF',
      fileSize: '2.4 MB',
      uploadDate: '2024-03-15',
      downloads: 234
    },
    {
      id: 'note-2',
      title: 'Physics Laws Summary',
      description: 'Comprehensive summary of Newton\'s laws and motion principles',
      fileType: 'DOCX',
      fileSize: '1.8 MB',
      uploadDate: '2024-03-14',
      downloads: 156
    },
    {
      id: 'note-3',
      title: 'Chemistry Periodic Table',
      description: 'Detailed periodic table with element properties',
      fileType: 'PDF',
      fileSize: '3.2 MB',
      uploadDate: '2024-03-13',
      downloads: 289
    },
    {
      id: 'note-4',
      title: 'Mathematics Formulas (Advanced)',
      description: 'Complete collection of algebra and calculus formulas',
      fileType: 'PDF',
      fileSize: '2.4 MB',
      uploadDate: '2024-03-15',
      downloads: 234
    },
    {
      id: 'note-5',
      title: 'Physics Laws Summary (Advanced)',
      description: 'Comprehensive summary of Newton\'s laws and motion principles',
      fileType: 'DOCX',
      fileSize: '1.8 MB',
      uploadDate: '2024-03-14',
      downloads: 156
    },
    {
      id: 'note-6',
      title: 'Chemistry Periodic Table (Advanced)',
      description: 'Detailed periodic table with element properties',
      fileType: 'PDF',
      fileSize: '3.2 MB',
      uploadDate: '2024-03-13',
      downloads: 289
    },
    {
      id: 'note-7',
      title: 'Mathematics Formulas (Basic)',
      description: 'Complete collection of algebra and calculus formulas',
      fileType: 'PDF',
      fileSize: '2.4 MB',
      uploadDate: '2024-03-15',
      downloads: 234
    },
    {
      id: 'note-8',
      title: 'Physics Laws Summary (Basic)',
      description: 'Comprehensive summary of Newton\'s laws and motion principles',
      fileType: 'DOCX',
      fileSize: '1.8 MB',
      uploadDate: '2024-03-14',
      downloads: 156
    },
    {
      id: 'note-9',
      title: 'Chemistry Periodic Table (Basic)',
      description: 'Detailed periodic table with element properties',
      fileType: 'PDF',
      fileSize: '3.2 MB',
      uploadDate: '2024-03-13',
      downloads: 289
    }
  ]);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  const handleMenuClick = (noteId: string) => {
    setOpenMenuId(openMenuId === noteId ? null : noteId);
  };

  const handleDeleteClick = (note: Note) => {
    setNoteToDelete(note);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    
    setDeletingNoteId(noteToDelete.id);
    try {
      // Simulate delete operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Note "${noteToDelete.title}" has been deleted`);
      setDeletingNoteId(null);
      setShowDeleteModal(false);
      setNoteToDelete(null);
    } catch (error) {
      toast.error('Failed to delete note');
      setDeletingNoteId(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <div className="hidden md:block flex-shrink-0 w-72 bg-white shadow-lg">
        <Teacherleftsidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-40 bg-white border-b">
          <TrTopbar userName="Teacher" />
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Delete Confirmation Modal */}
          {showDeleteModal && noteToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0">
                    <svg className="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Delete Note</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Are you sure you want to delete "{noteToDelete.title}"? This action cannot be undone.
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setNoteToDelete(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={deletingNoteId === noteToDelete.id}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    disabled={deletingNoteId === noteToDelete.id}
                  >
                    {deletingNoteId === noteToDelete.id ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Uploaded Notes</h1>

            <button 
              onClick={() => navigate('/teacherdashboard/lessons/uploadnotes/upload')}
              className="relative flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg w-56 hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md group"
            >
              <svg 
                className="h-5 w-5 transition-transform group-hover:scale-110" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="font-medium">Upload New Note</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes.map((note) => (
              <div key={note.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">{note.title}</h3>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <span>{note.fileType}</span>
                        <span className="mx-2">•</span>
                        <span>{note.fileSize}</span>
                      </div>
                    </div>
                    <div className="relative menu-container">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMenuClick(note.id);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>

                      {openMenuId === note.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                          <div className="py-1">
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(null);
                                navigate(`/teacherdashboard/lessons/uploadnotes/edit/${note.id}`);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(note);
                              }}
                              disabled={deletingNoteId === note.id}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 my-3">{note.description}</p>
                </div>
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>{note.downloads.toLocaleString()} downloads</span>
                  </div>
                  <span>{new Date(note.uploadDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>

          {notes.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">No notes uploaded yet</h3>
              <p className="text-gray-500">Upload your first note to get started</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UploadNotes; 

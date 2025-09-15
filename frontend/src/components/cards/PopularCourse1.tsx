import { useState } from "react";
import { toast } from "react-hot-toast";

interface Note {
  id: string;
  title: string;
  description: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  downloads: number;
}

const initialNotes = [
  {
    id: "1",
    title: "Mathematics Formulas",
    description: "Complete collection of algebra and calculus formulas",
    fileType: "PDF",
    fileSize: "2.4 MB",
    uploadDate: "2024-03-15",
    downloads: 234,
  },
  {
    id: "2",
    title: "Physics Laws Summary",
    description: "Comprehensive summary of Newton's laws and motion principles",
    fileType: "DOCX",
    fileSize: "1.8 MB",
    uploadDate: "2024-03-14",
    downloads: 156,
  },
  {
    id: "3",
    title: "Chemistry Periodic Table",
    description: "Detailed periodic table with element properties",
    fileType: "PDF",
    fileSize: "3.2 MB",
    uploadDate: "2024-03-13",
    downloads: 289,
  },
  {
    id: "4",
    title: "Biology Notes",
    description: "Comprehensive biology study materials",
    fileType: "PDF",
    fileSize: "3.5 MB",
    uploadDate: "2024-03-12",
    downloads: 198,
  },
  {
    id: "5",
    title: "English Literature",
    description: "Classic literature analysis and summaries",
    fileType: "DOCX",
    fileSize: "2.1 MB",
    uploadDate: "2024-03-11",
    downloads: 167,
  }
];

const PopularCourse1 = () => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  // State for managing the delete modal and menu
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Note | null>(null);

  // Handlers for menu and delete
  const handleMenuClick = (itemId: string) => {
    setOpenMenuId(openMenuId === itemId ? null : itemId);
  };

  const handleDeleteClick = (item: Note) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      // Simulate delete operation (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Update notes state by filtering out the deleted item
      setNotes(notes.filter(note => note.id !== itemToDelete.id));
      toast.success(`Note "${itemToDelete.title}" has been deleted`);
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error(`Failed to delete note "${itemToDelete.title}"`);
    }
  };

  return (
    <div className="flex flex-row gap-4 ml-3 overflow-x-auto hide-scrollbar">
      {notes.map((note) => (
        <div
          key={note.id}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-visible hover:shadow-md transition-shadow relative cursor-pointer w-80 flex-shrink-0"
        >
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
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
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {note.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {note.fileType} • {note.fileSize}
                  </p>
                </div>
              </div>
              {/* Menu for notes */}
              <div className="relative menu-container">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click from interfering
                    handleMenuClick(note.id);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
                {openMenuId === note.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent menu click from closing immediately
                        handleDeleteClick(note);
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
              {note.description}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>{note.downloads} downloads</span>
              </div>
              <span>{note.uploadDate}</span>
            </div>
          </div>
        </div>
      ))}
      {/* Delete Modal */}
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
    </div>
  );
};

export default PopularCourse1;

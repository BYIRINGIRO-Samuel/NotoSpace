import { useState, useEffect } from "react";
import Topbar from "../components/Topbar";
import { toast } from "react-hot-toast";
import Leftsidebar from "../components/Leftsidebar";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  uploadDate: string;
  views: number;
}

interface Note {
  id: string;
  title: string;
  description: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  downloads: number;
}

interface User {
  name: string;
  email: string;
  role: {
    type: string;
  };
}

const Downloads = () => {
  const [activeTab, setActiveTab] = useState<"videos" | "notes">("videos");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Video | Note | null>(null);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const [videos] = useState<Video[]>([
    {
      id: "1",
      title: "Introduction to Mathematics",
      description: "Basic concepts of algebra and calculus",
      thumbnail: "/assets/images/img1.jpg",
      duration: "45:30",
      uploadDate: "2024-03-15",
      views: 1234,
    },
    {
      id: "2",
      title: "Physics Fundamentals",
      description: "Understanding Newton's laws and motion",
      thumbnail: "/assets/images/img2.jpg",
      duration: "38:15",
      uploadDate: "2024-03-14",
      views: 856,
    },
    {
      id: "3",
      title: "Chemistry Basics",
      description: "Introduction to atomic structure",
      thumbnail: "/assets/images/img3.jpg",
      duration: "52:45",
      uploadDate: "2024-03-13",
      views: 1567,
    },
  ]);

  const [notes] = useState<Note[]>([
    {
      id: "note-1",
      title: "Mathematics Formulas",
      description: "Complete collection of algebra and calculus formulas",
      fileType: "PDF",
      fileSize: "2.4 MB",
      uploadDate: "2024-03-15",
      downloads: 234,
    },
    {
      id: "note-2",
      title: "Physics Laws Summary",
      description:
        "Comprehensive summary of Newton's laws and motion principles",
      fileType: "DOCX",
      fileSize: "1.8 MB",
      uploadDate: "2024-03-14",
      downloads: 156,
    },
    {
      id: "note-3",
      title: "Chemistry Periodic Table",
      description: "Detailed periodic table with element properties",
      fileType: "PDF",
      fileSize: "3.2 MB",
      uploadDate: "2024-03-13",
      downloads: 289,
    },
  ]);

  const handleMenuClick = (itemId: string) => {
    setOpenMenuId(openMenuId === itemId ? null : itemId);
  };

  const handleDeleteClick = (item: Video | Note) => {
    setItemToDelete(item);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      // Simulate delete operation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(
        `${'title' in itemToDelete ? ('duration' in itemToDelete ? "Video" : "Note") : "Item"} "${
          itemToDelete.title
        }" has been deleted`
      );
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error(
        `Failed to delete ${activeTab === "videos" ? "video" : "note"}`
      );
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="hidden md:block w-72 flex-shrink-0 overflow-y-auto hide-scrollbar">
        <Leftsidebar />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar userName={user?.name || ''} />
        <div className="border-b border-gray-200"></div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-10">
              Downloads
            </h1>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("videos")}
                  className={`${
                    activeTab === "videos"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Videos
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`${
                    activeTab === "notes"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Notes
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow">
              {activeTab === "videos" ? (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                      <div
                        key={video.id}
                        className="relative bg-gray-400/20 rounded-xl border border-gray-200 shadow-sm  hover:shadow-md transition-shadow"
                      >
                        <div className="relative aspect-video group">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="bg-white/90 p-4 rounded-full hover:bg-white transition-colors">
                              <img
                                src="/assets/icons/play.svg"
                                alt="Play"
                                className="w-8 h-8"
                              />
                            </button>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                            {video.duration}
                          </div>
                        </div>
                        <div className="p-4 relative">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-lg line-clamp-1 flex-1">
                              {video.title}
                            </h3>
                            {/* Menu for videos */}
                            <div className="relative menu-container">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent card click from interfering
                                  handleMenuClick(video.id);
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
                              {openMenuId === video.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent menu click from closing immediately
                                      handleDeleteClick(video);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-1 line-clamp-2">
                            {video.description}
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
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              <span>{video.views.toLocaleString()} views</span>
                              <span className="mx-1">•</span>
                              <span>
                                {new Date(
                                  video.uploadDate
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="aspect-[4/3] bg-gray-100 rounded-md mb-4 flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">
                            {note.title}
                          </h3>
                          <div className="relative menu-container">
                            <button
                              onClick={() => handleMenuClick(note.id)}
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
                                  onClick={() => handleDeleteClick(note)}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {note.description}
                        </p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-gray-100 rounded">
                              {note.fileType}
                            </span>
                            <span>{note.fileSize}</span>
                          </div>
                          <span>{note.downloads} downloads</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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

export default Downloads;

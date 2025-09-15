import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Teacherleftsidebar from '../../components/teacherleftsidebar';
import TrTopbar from '../../components/TrTopbar';
import axios from 'axios';

interface Video {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  filepublicId: string;
  course?: { name: string };
  class?: { name: string };
  createdAt: string;
  views?: number;
  duration?: number;
  thumbnail?: string;
}

const UploadVideos = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);

  // Fetch teacher's videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/videos/teacher', { withCredentials: true });
        if (response.status === 200 && Array.isArray(response.data.videos)) {
          setVideos(response.data.videos);
        }
      } catch (error) {
        console.error('Failed to fetch videos:', error);
        toast.error('Failed to fetch videos');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const handleMenuClick = (videoId: string) => {
    setOpenMenuId(openMenuId === videoId ? null : videoId);
  };

  const handleDeleteClick = (video: Video) => {
    setVideoToDelete(video);
    setShowDeleteModal(true);
    setOpenMenuId(null);
  };

  const handleConfirmDelete = async () => {
    if (!videoToDelete) return;
    
    setDeletingVideoId(videoToDelete._id);
    try {
      const response = await axios.delete(`/api/videos/${videoToDelete._id}`, { withCredentials: true });
      if (response.status === 200) {
        toast.success(`Video "${videoToDelete.title}" has been deleted`);
        setVideos(prev => prev.filter(video => video._id !== videoToDelete._id));
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete video';
      toast.error(errorMessage);
    } finally {
      setDeletingVideoId(null);
      setShowDeleteModal(false);
      setVideoToDelete(null);
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

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
          {showDeleteModal && videoToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Delete Video</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete "{videoToDelete.title}"?</p>
                <div className="flex justify-end gap-4">
                  <button 
                    onClick={() => setShowDeleteModal(false)} 
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    disabled={deletingVideoId === videoToDelete._id}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirmDelete} 
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    disabled={deletingVideoId === videoToDelete._id}
                  >
                    {deletingVideoId === videoToDelete._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Uploaded Videos</h1>
            <button 
              onClick={() => navigate('/teacherdashboard/lessons/uploadvideos/upload')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <img src="/assets/icons/videos.svg" className="h-5 w-5" alt="Upload icon" />
              <span>Upload New Video</span>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative">
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover"/>
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                    <span className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                      {video.duration ? formatDuration(video.duration) : '00:00'}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-800 line-clamp-2 flex-1 mr-2">{video.title}</h3>
                      <div className="relative menu-container">
                        <button onClick={() => handleMenuClick(video._id)} className="p-1 hover:bg-gray-200 rounded-full">
                          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 5.25a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path></svg>
                        </button>
                        {openMenuId === video._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                            <a
                              href={video.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Watch
                            </a>
                            <button 
                              onClick={() => handleDeleteClick(video)} 
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              disabled={deletingVideoId === video._id}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {video.views || 0} views • {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                    {video.course && (
                      <p className="text-xs text-gray-400 mt-1">
                        Course: {video.course.name}
                      </p>
                    )}
                    {video.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && videos.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 text-gray-300">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">No videos uploaded yet</h3>
              <p className="text-gray-500">Upload your first video to get started</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UploadVideos; 
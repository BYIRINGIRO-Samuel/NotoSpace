import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Topbar from '../../components/Topbar';
import Teacherleftsidebar from '../../components/teacherleftsidebar';

interface VideoData {
  id: string;
  title: string;
  class: string;
  description: string;
  thumbnail: string;
  duration: string;
}

// Mock videos data - in a real app, this would come from an API
const mockVideos: VideoData[] = [
  {
    id: '1',
    title: 'Introduction to Mathematics',
    class: 'Class 10',
    description: 'Basic concepts of algebra and calculus',
    thumbnail: '/assets/images/img1.jpg',
    duration: '45:30'
  },
  {
    id: '2',
    title: 'Physics Fundamentals',
    class: 'Class 11',
    description: 'Understanding Newton\'s laws and motion',
    thumbnail: '/assets/images/img2.jpg',
    duration: '38:15'
  },
  {
    id: '3',
    title: 'Chemistry Basics',
    class: 'Class 12',
    description: 'Introduction to atomic structure',
    thumbnail: '/assets/images/img3.jpg',
    duration: '52:45'
  }
];

const EditVideo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState<VideoData | null>(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Find the video with matching ID
        const video = mockVideos.find(v => v.id === id);
        
        if (!video) {
          toast.error('Video not found');
          navigate('/teacherdashboard/lessons/uploadvideos');
          return;
        }

        setVideoData(video);
      } catch (error) {
        toast.error('Failed to load video data');
        navigate('/teacherdashboard/lessons/uploadvideos');
      }
    };

    if (id) {
      fetchVideoData();
    }
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoData) return;
    
    setLoading(true);

    try {
      if (!videoData.title || !videoData.class || !videoData.description) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Video updated successfully');
      navigate('/teacherdashboard/lessons/uploadvideos');
    } catch (error) {
      toast.error('Failed to update video');
    } finally {
      setLoading(false);
    }
  };

  if (!videoData) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="hidden md:block w-72 flex-shrink-0 overflow-y-auto hide-scrollbar">
          <Teacherleftsidebar />
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="hidden md:block w-72 flex-shrink-0 overflow-y-auto hide-scrollbar">
        <Teacherleftsidebar />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        
        <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => navigate('/teacherdashboard/lessons/uploadvideos')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold">Edit Video</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={videoData.title}
                  onChange={(e) => setVideoData({ ...videoData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter video title"
                  required
                />
              </div>

              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  id="class"
                  value={videoData.class}
                  onChange={(e) => setVideoData({ ...videoData, class: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a class</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={videoData.description}
                  onChange={(e) => setVideoData({ ...videoData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter video description"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Thumbnail
                </label>
                <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={videoData.thumbnail}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  To change the thumbnail, please re-upload the video
                </p>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/teacherdashboard/lessons/uploadvideos')}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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

export default EditVideo; 

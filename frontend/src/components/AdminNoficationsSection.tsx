import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface CreatedBy {
  name: string;
}

interface CreatedFor {
  name: string;
}

interface Notification {
  _id: string;
  createdBy: CreatedBy;
  title: string;
  message: string;
  type: string;
  createdFor: CreatedFor[];
  createdAt: string;
}

const AdminNoficationsSection: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/notifications', { withCredentials: true });
        if (response.status === 200 && response.data && Array.isArray(response.data.notifications)) {
          setNotifications(response.data.notifications);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Filter for approval notifications
  const approvalNotifications = notifications.filter(notification => notification.type === 'approval');

  const handleReviewClick = (notification: Notification) => {
    // Prefer _id if available, fallback to name
    const teacherId = (notification.createdFor[0] as any)?._id || notification.createdFor[0]?.name;
    if (teacherId) {
      navigate(`/admin/teachers?highlight=${encodeURIComponent(teacherId)}`);
    } else {
      navigate('/admin/teachers');
    }
  };

  return (
    <div className="max-w-2xl p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h1>
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </div>
        ) : approvalNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <img src="/assets/images/notfound.jpg" alt="No notifications found" className="w-40 h-40 object-contain mb-4" />
            <p className="text-gray-500 text-lg">No notifications found.</p>
          </div>
        ) : (
          approvalNotifications.map(notification => (
            <div
              key={notification._id}
              className="flex items-start space-x-3 bg-white shadow-md rounded-lg p-4 border border-gray-200 cursor-pointer"
              onClick={() => handleReviewClick(notification)}
            >
              {/* Avatar */}
              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 font-medium text-sm">
                  {notification.createdBy?.name?.split(' ').map(n => n[0]).join('') || ''}
                </span>
              </div>

              {/* Notification Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-semibold text-gray-800">Tr.{notification.createdBy?.name || ''}</div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the card click from firing
                      handleReviewClick(notification);
                    }}
                    className="text-blue-600 hover:text-blue-900 text-xs font-medium focus:outline-none focus:underline"
                  >
                    Review Teacher
                  </button>
                </div>
                <div className="text-gray-700 text-sm">
                  needs approval to join your school
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminNoficationsSection;


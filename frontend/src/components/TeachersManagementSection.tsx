import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

interface Teacher {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  status: 'pending' | 'active' | 'inactive';
}

const TeachersManagementSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const highlight = params.get('highlight');

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/users/admins/list/teachers', { withCredentials: true });
        if (response.status === 200 && response.data && Array.isArray(response.data.users)) {
          setTeachers(response.data.users);
        } else {
          toast.error('Failed to fetch teachers');
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Failed to fetch teachers');
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, []);

  // Filter teachers based on search query and status
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || teacher.status === selectedStatus;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') {
      return -1; // a comes before b
    }
    if (a.status !== 'pending' && b.status === 'pending') {
      return 1; // b comes before a
    }
    // If both have the same pending status or neither are pending, maintain original order (or sort by another criteria if needed)
    return 0;
  });

  const handleConfirmClick = async (teacher: Teacher) => {
    try {
      // Simulate status update
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success(`Teacher "${teacher.name}" has been confirmed`);
    } catch (error) {
      toast.error('Failed to confirm teacher');
    }
  };

  const handleDenyClick = async (teacher: Teacher) => {
    try {
      // Simulate status update
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success(`Teacher "${teacher.name}" has been denied`);
    } catch (error) {
      toast.error('Failed to deny teacher');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Teacher Management</h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <img src="/assets/images/notfound.jpg" alt="No teachers found" className="w-40 h-40 object-contain mb-4" />
              <p className="text-gray-500 text-lg">No teachers found.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher._id} className={`hover:bg-gray-50 ${highlight === teacher._id || highlight === teacher.name ? 'bg-yellow-100' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 font-medium">
                            {teacher.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                          <div className="text-sm text-gray-500">{teacher.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {teacher.createdAt ? new Date(teacher.createdAt).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${teacher.status === 'active' ? 'bg-green-100 text-green-800' : 
                          teacher.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {teacher.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {teacher.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleConfirmClick(teacher)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleDenyClick(teacher)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Deny
                          </button>
                        </>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeachersManagementSection;

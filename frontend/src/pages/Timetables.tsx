import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrTopbar from '../components/TrTopbar';
import Teacherleftsidebar from '../components/teacherleftsidebar';
import { toast } from 'react-hot-toast';

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  class: string;
  teacher: string;
}

interface Timetable {
  id: string;
  title: string;
  description: string;
  class: string;
  createdAt: string;
  updatedAt: string;
  type: 'uploaded' | 'created';
  fileUrl?: string;
  timeSlots?: TimeSlot[];
  gridTimeSlots: { time: string; monday: string; tuesday: string; wednesday: string; thursday: string; friday: string }[];
}

const Timetables = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upload' | 'create'>('upload');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [timetableToDelete, setTimetableToDelete] = useState<Timetable | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Mock data for timetables
  const [timetables] = useState<Timetable[]>([
    {
      id: '1',
      title: 'Class 10A Weekly Schedule',
      description: 'Regular weekly timetable for Class 10A',
      class: 'Class 10A',
      createdAt: '2024-03-15',
      updatedAt: '2024-03-15',
      type: 'uploaded',
      fileUrl: '/assets/timetables/class10a.pdf',
      gridTimeSlots: [
        { time: '07:00-08:30', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
        { time: '08:30-09:45', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
        { time: '09:45-10:30', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
        { time: '10:30-11:30', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
        { time: '11:30-13:00', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
      ]
    },
    {
      id: '2',
      title: 'Class 11B Schedule',
      description: 'Updated timetable for Class 11B',
      class: 'Class 11B',
      createdAt: '2024-03-10',
      updatedAt: '2024-03-18',
      type: 'created',
      timeSlots: [
        {
          id: 'slot1',
          day: 'Monday',
          startTime: '09:00',
          endTime: '10:00',
          subject: 'Mathematics',
          class: 'Class 11B',
          teacher: 'John Smith'
        },
        {
          id: 'slot2',
          day: 'Monday',
          startTime: '10:15',
          endTime: '11:15',
          subject: 'Physics',
          class: 'Class 11B',
          teacher: 'Sarah Johnson'
        }
      ],
      gridTimeSlots: [
        { time: '07:00-08:30', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
        { time: '08:30-09:45', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
        { time: '09:45-10:30', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
        { time: '10:30-11:30', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
        { time: '11:30-13:00', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
      ]
    }
  ]);

  // New state for create timetable form
  const [newTimetable, setNewTimetable] = useState({
    title: '',
    class: '',
    description: '',
    gridTimeSlots: [
      { time: '07:00-08:30', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
      { time: '08:30-09:45', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
      { time: '09:45-10:30', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
      { time: '10:30-11:30', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
      { time: '11:30-13:00', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
    ]
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && file.type !== 'image/jpeg' && file.type !== 'image/png') {
        toast.error('Please upload a PDF, JPEG, or PNG file');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Timetable uploaded successfully');
      setSelectedFile(null);
    } catch (error) {
      toast.error('Failed to upload timetable');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteClick = (timetable: Timetable) => {
    setTimetableToDelete(timetable);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!timetableToDelete) return;
    
    try {
      // Simulate delete operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Timetable "${timetableToDelete.title}" has been deleted`);
      setShowDeleteModal(false);
      setTimetableToDelete(null);
    } catch (error) {
      toast.error('Failed to delete timetable');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewTimetable(prevState => ({ ...prevState, [id]: value }));
  };

  const handleGridInputChange = (timeIndex: number, day: keyof Omit<Timetable['gridTimeSlots'][number], 'time'>, value: string) => {
    setNewTimetable(prevState => {
      const updatedGridTimeSlots = [...prevState.gridTimeSlots];
      updatedGridTimeSlots[timeIndex] = {
        ...updatedGridTimeSlots[timeIndex],
        [day]: value,
      };
      return { ...prevState, gridTimeSlots: updatedGridTimeSlots };
    });
  };

  const handleAddRow = () => {
    setNewTimetable(prevState => ({
      ...prevState,
      gridTimeSlots: [
        ...prevState.gridTimeSlots,
        { time: '', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
      ],
    }));
  };

  const handleRemoveRow = (index: number) => {
    setNewTimetable(prevState => ({
      ...prevState,
      gridTimeSlots: prevState.gridTimeSlots.filter((_, i) => i !== index),
    }));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the newTimetable data to your backend
    console.log('New Timetable Data:', newTimetable);
    toast.success('Timetable created successfully (simulated)');
    setShowCreateModal(false);
    // Optionally reset the form
    setNewTimetable({
      title: '',
      class: '',
      description: '',
      gridTimeSlots: [
        { time: '07:00-08:30', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
        { time: '08:30-09:45', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
        { time: '09:45-10:30', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
        { time: '10:30-11:30', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
        { time: '11:30-13:00', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' },
      ],
    });
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
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Timetables</h1>
              <div className="flex items-center space-x-4">
                <div className="bg-gray-200 p-1 rounded-lg flex space-x-1">
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`px-4 py-2 rounded-lg ${
                      activeTab === 'upload'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Upload Timetable
                  </button>
                  <button
                    onClick={() => setActiveTab('create')}
                    className={`px-4 py-2 rounded-lg ${
                      activeTab === 'create'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Create Timetable
                  </button>
                </div>
              </div>
            </div>

            {/* Upload/Create Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              {activeTab === 'upload' ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="timetable-file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="timetable-file"
                      className="cursor-pointer inline-flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <span>Choose file or drag and drop</span>
                    </label>
                    <p className="mt-2 text-sm text-gray-500">
                      PDF, JPEG, or PNG up to 10MB
                    </p>
                    {selectedFile && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          Selected file: {selectedFile.name}
                        </p>
                        <button
                          onClick={handleUpload}
                          disabled={isUploading}
                          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isUploading ? 'Uploading...' : 'Upload Timetable'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full py-3 px-4 border border-gray-300 rounded-md text-left hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <svg
                          className="h-6 w-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span className="text-gray-700">Create New Timetable</span>
                      </div>
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Timetables List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Timetables</h2>
                <div className="space-y-4">
                  {timetables.map((timetable) => (
                    <div
                      key={timetable.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{timetable.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{timetable.description}</p>
                          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                            <span>Class: {timetable.class}</span>
                            <span>Type: {timetable.type === 'uploaded' ? 'Uploaded' : 'Created'}</span>
                            <span>Last updated: {timetable.updatedAt}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/teacherdashboard/timetables/${timetable.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteClick(timetable)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && timetableToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{timetableToDelete.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTimetableToDelete(null);
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

      {/* Create Timetable Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 overflow-y-auto max-h-[90vh]">
            <h3 className="text-lg font-semibold mb-4">Create New Timetable</h3>
            <form className="space-y-4" onSubmit={handleCreateSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={newTimetable.title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter timetable title"
                  />
                </div>
                <div>
                  <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                    Class
                  </label>
                  <select
                    id="class"
                    value={newTimetable.class}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a class</option>
                    <option value="Class 10A">Class 10A</option>
                    <option value="Class 10B">Class 10B</option>
                    <option value="Class 11A">Class 11A</option>
                    <option value="Class 11B">Class 11B</option>
                    <option value="Class 12A">Class 12A</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  value={newTimetable.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter timetable description"
                />
              </div>
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-4">Timetable Grid</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Time</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Monday</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Tuesday</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Wednesday</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-300">Thursday</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Friday</th>
                        <th></th> {/* Add a column for the remove button */}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {newTimetable.gridTimeSlots.map((timeSlot, timeIndex) => (
                        <tr key={timeIndex}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-300">
                            <input
                              type="text"
                              value={timeSlot.time}
                              onChange={(e) => handleGridInputChange(timeIndex, 'time' as any, e.target.value)}
                              className="w-full border-none focus:ring-0 focus:outline-none text-sm text-gray-900"
                              placeholder="Time"
                            />
                          </td>
                          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day, dayIndex) => (
                            <td key={dayIndex} className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 border-r border-gray-300">
                              <input
                                type="text"
                                value={timeSlot[day as keyof Omit<Timetable['gridTimeSlots'][number], 'time'>]}
                                onChange={(e) => handleGridInputChange(timeIndex, day as keyof Omit<Timetable['gridTimeSlots'][number], 'time'>, e.target.value)}
                                className="w-full border-none focus:ring-0 focus:outline-none text-sm text-gray-900"
                                placeholder="Class"
                              />
                            </td>
                          ))}
                          <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                             <button
                                type="button"
                                onClick={() => handleRemoveRow(timeIndex)}
                                className="text-red-600 hover:text-red-800"
                                aria-label="Remove time slot row"
                              >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Another Row
                  </button>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Timetable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetables; 

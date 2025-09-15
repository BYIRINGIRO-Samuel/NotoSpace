import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface User {
  _id: string;
  name: string;
  email: string;
  role: { type: string };
  classname?: string;
  school?: { 
    _id: string; 
    name: string;
  } | null; 
  profilePicture?: string; 
}

const TrProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [initials, setInitials] = useState<string>('');
  // State for editable fields
  const [editableName, setEditableName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData: User = JSON.parse(userStr);
        setUser(userData);
        // Initialize editable states
        setEditableName(userData.name || '');
        setProfilePicturePreview(userData.profilePicture || null);

        // Generate initials
        if (userData.name) {
          const names = userData.name.split(' ').filter(n => n); 
          if (names.length > 1) {
            setInitials(names[0][0] + names[names.length - 1][0]);
          } else if (names.length === 1) {
            setInitials(names[0][0]);
          }
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleSaveChanges = async () => {
    setIsLoading(true);

    const dataToUpdate: any = {
      name: editableName,
    };

    // Include new password if it's not empty
    if (newPassword) {
      dataToUpdate.password = newPassword; 
    }

    // Handle profile picture upload
    if (profilePictureFile) {
       const reader = new FileReader();
       reader.onloadend = async () => {
         dataToUpdate.profilePicture = reader.result as string;
         sendUpdateRequest(dataToUpdate);
       };
       reader.readAsDataURL(profilePictureFile);
       return;

    } else if (profilePicturePreview === null && user?.profilePicture) {
      // Case where user had a profile picture but cleared it
      dataToUpdate.profilePicture = '';
       sendUpdateRequest(dataToUpdate);
       return;
    }

    // If no new profile picture file is selected and existing wasn't cleared, send update request for other fields
    sendUpdateRequest(dataToUpdate);
  };

  // Helper function to send the actual PUT request
  const sendUpdateRequest = async (data: any) => {
     if (user?._id) {
       try {
         const response = await axios.put('/api/users/profile', data);
         console.log('Profile updated:', response.data);
         
         if (response.data.user) {
           localStorage.setItem('user', JSON.stringify(response.data.user));
           setUser(response.data.user as User);
           setEditableName(response.data.user.name || '');
           setProfilePicturePreview(response.data.user.profilePicture || null);
           setNewPassword('');
           setProfilePictureFile(null);
           toast.success('Profile updated successfully!');
         }
       } catch (error) {
         console.error('Error updating profile:', error);
         if (axios.isAxiosError(error)) {
           const backendErrorMessage = error.response?.data?.message;
           const backendError = error.response?.data?.error;
           const displayMessage = backendErrorMessage || backendError || 'Failed to update profile. Please try again.';
           toast.error(displayMessage);
         } else {
           toast.error('An unexpected error occurred while updating profile.');
         }
       } finally {
         setIsLoading(false);
       }
     } else {
       console.error("User ID is missing, cannot update profile.");
       toast.error('User information missing. Please log in again.');
       setIsLoading(false);
     }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setProfilePictureFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const { name, value } = e.target;
     switch (name) {
       case 'name':
         setEditableName(value);
         break;
       case 'newPassword':
         setNewPassword(value);
         break;
       default:
         break;
     }
   };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow">
      <div className="flex items-center gap-6">
        {profilePicturePreview ? (
          <img 
            src={profilePicturePreview}
            alt="Profile Preview"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-4xl font-bold">
            {initials.toUpperCase()} 
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Profile Picture</h2>
          <p className="text-sm text-gray-500 mb-2">Upload a new avatar or change your current photo</p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
          />
          <button
            onClick={handleUploadClick}
            className="px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
          >
            Upload Photo
          </button>
           {profilePictureFile && <span className="ml-2 text-sm text-gray-600">{profilePictureFile.name}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">Full Name</label>
          <input 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-600"
            name="name"
            value={editableName}
            onChange={handleInputChange}
            placeholder="John Doe" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">Email Address</label>
          <input 
            type="email" 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-600 text-gray-500"
            value={user?.email || ''}
            readOnly
            placeholder="john.doe@example.com"
          />
        </div>
         {user?.role.type === 'teacher' && (
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">School Name</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-600 text-gray-500"
              value={user?.school?.name || ''}
              readOnly
              placeholder="e.g., High School"
            />
          </div>
         )}
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">New Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-600"
            name="newPassword"
            value={newPassword}
            onChange={handleInputChange}
            placeholder="Enter new password"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveChanges}
          className={`px-6 py-2 bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring focus:ring-blue-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default TrProfilePage;

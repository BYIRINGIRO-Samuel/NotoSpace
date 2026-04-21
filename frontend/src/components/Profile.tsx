import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface User {
  _id: string;
  name: string;
  email: string;
  role: { type: string };
  classname?: { _id: string; name: string; } | null;
  school?: { 
    _id: string; 
    name: string;
  } | null; 
  profilePicture?: string; // Added profilePicture to interface
}

// Helper function to compress image
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to JPEG with 0.7 quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedDataUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

const ProfilePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [initials, setInitials] = useState<string>('');
  // State for editable fields
  const [editableName, setEditableName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null); // State for image preview

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData: User = JSON.parse(userStr);
        setUser(userData);
        // Initialize editable states
        setEditableName(userData.name || '');
        setProfilePicturePreview(userData.profilePicture || null); // Set initial profile picture preview

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
        // Consider showing a toast or error message here if local storage is corrupt
        toast.error('Failed to load user data from local storage.');
      }
    }
  }, []);

  const handleSaveChanges = async () => {
    setIsLoading(true);

    const dataToUpdate: any = {
      name: editableName,
    };

    if (newPassword) {
      dataToUpdate.password = newPassword;
    }

    try {
      if (profilePictureFile) {
        // Compress the image before sending
        const compressedImage = await compressImage(profilePictureFile);
        dataToUpdate.profilePicture = compressedImage;
      } else if (profilePicturePreview === null && user?.profilePicture) {
        dataToUpdate.profilePicture = '';
      }

      // Send the update request
      await sendUpdateRequest(dataToUpdate);
    } catch (error) {
      console.error('Error processing image:', error);
      // Display specific error message if available, otherwise a generic one
      const errorMessage = (error as any).message || 'Error processing image. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to send the actual PUT request
  const sendUpdateRequest = async (data: any) => {
     if (user?._id) {
       try {
         // Backend updateProfile endpoint is PUT /api/users/profile (expects auth cookie)
         const response = await axios.put('/api/users/profile', data);
         console.log('Profile updated:', response.data);
         
         // Update local storage and user state with new data from response
         if (response.data.user) {
           localStorage.setItem('user', JSON.stringify(response.data.user));
           setUser(response.data.user as User);
           // Re-initialize editable name and profile picture preview on successful update
           setEditableName(response.data.user.name || '');
           setProfilePicturePreview(response.data.user.profilePicture || null);
           setNewPassword(''); // Clear password field after successful update
           setProfilePictureFile(null); // Clear selected file after update
           toast.success('Profile updated successfully!');
         }
       } catch (error) {
         console.error('Error updating profile:', error);
         // Handle error - display backend message if available
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
      setProfilePictureFile(selectedFile); // Store the selected file object
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string); // Set preview URL
      };
      reader.readAsDataURL(selectedFile); // Read file as data URL for preview
    }
  };

   // Helper function to handle input changes for editable fields
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
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-[#349156] flex items-center justify-center text-white text-4xl font-bold">
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
        {user?.role.type === 'student' && (
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Class</label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-600 text-gray-500"
              value={user?.classname?.name || ''}
              readOnly
              placeholder="e.g., 10th Grade"
            />
          </div>
        )}
        {(user?.role.type === 'student' || user?.role.type === 'teacher') && (
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
          className={`px-6 py-2 bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring focus:ring-blue-200 flex items-center gap-2 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Saving...</span>
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;

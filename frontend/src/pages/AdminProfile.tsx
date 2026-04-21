import AdminLeftsidebar from "../components/adminleftsidebar"
import ProfilePage from "../components/Profile"
import AdminTopbar from "../components/AdminTopbar"

const AdminProfile = () => {
  return (
    <div className='flex h-screen w-full hide-scrollbar bg-gray-50'>
      <div className="hidden md:flex">
        <AdminLeftsidebar/>
      </div>
      <div className="flex flex-col flex-1 overflow-x-hidden">
          <div className="sticky top-0 z-50">
          <AdminTopbar userName="" />
        </div>
        <ProfilePage/>
      </div>
    </div>
  )
}

export default AdminProfile 

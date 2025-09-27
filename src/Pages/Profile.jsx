import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import person from "../assests/icons/profile.png";

export default function Profile() {
  const fileRef = useRef(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    const fileName = e.target.files[0]?.name || "";
    setFormData((prev) => ({ ...prev, avatar: fileName }));
    console.log(`File Selected: ${fileName}`);
  };

  const handleUpdate = () => {
    console.log("Update Button Clicked");
    console.log("Form Data to Submit:", formData);
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
    

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
       

        {/* Profile Content */}
        <div className="flex-1 p-6">
          <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                onChange={handleFileChange}
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
              />
              <img
                onClick={() => fileRef.current.click()}
                src={person}
                alt="profile"
                className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
              />
              <p className="text-sm self-center">
                {fileUploadError ? (
                  <span className="text-red-700">
                    Error uploading image (must be less than 2 MB)
                  </span>
                ) : filePerc > 0 && filePerc < 100 ? (
                  <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
                ) : filePerc === 100 ? (
                  <span className="text-green-700">
                    Image Successfully Uploaded!
                  </span>
                ) : (
                  ""
                )}
              </p>

              {/* User Information */}
              <input
                type="text"
                placeholder="Username"
                id="username"
                value={formData.username}
                className="border p-3 rounded-lg"
                onChange={handleChange}
              />
              <input
                type="email"
                placeholder="Email"
                id="email"
                value={formData.email}
                className="border p-3 rounded-lg"
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="Password"
                id="password"
                value={formData.password}
                className="border p-3 rounded-lg"
                onChange={handleChange}
              />
              <button
                className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
                onClick={handleUpdate}
              >
                Update
              </button>

              <Link
                className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
                to="/create-listing"
              >
                Create Listing
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

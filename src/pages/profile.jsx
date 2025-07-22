import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "../styles/App.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserById, updateUser } from "../RESTapi/api";
import { NavLink } from "react-router-dom";
import Loading from "../components/Loading";
import Footer from "../components/footer";
import { lazy, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave } from "@fortawesome/free-solid-svg-icons";
const Navbar = lazy(() => import("../components/dashNavBar"));

function ProfilePage() {
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("currentUser");

  const { error, isLoading, data } = useQuery({
    queryKey: ["UserInfo"],
    queryFn: () => getUserById(userId),
    cacheTime: 0,
  });

  const mutation = useMutation({
    mutationFn: (updatedFields) => updateUser(userId, updatedFields),
    onSuccess: () => {
      queryClient.invalidateQueries(["UserInfo"]);
    },
  });

  const [editMode, setEditMode] = useState({
    username: false,
    bio: false,
    role: false,
  });

  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    role: "USER",
  });

  useGSAP(() => {
    gsap.from(".profile-card", {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
    });
    gsap.from(".info-item", {
      opacity: 0,
      x: -30,
      duration: 0.6,
      stagger: 0.2,
      delay: 0.5,
      ease: "power2.out",
    });
  }, []);

  if (isLoading) return <Loading />;
  if (error) {
    const status = error?.response?.status;
    if (status === 401)
      return (
        <div className="error-page flex flex-col gap-4">
          <p className="  text-white">
            You must be logged in to view your profile.
          </p>
          <div>
            <NavLink className={`btn text-lg m-4`} to={`/login`}>
              Go to login
            </NavLink>
            <NavLink className={`btn text-lg`} to={`/`}>
              Back to homepage
            </NavLink>
          </div>
        </div>
      );
    if (status === 404) return <p className="error-page">User not found</p>;
    return <div className="error-page ">Error loading user. Try again.</div>;
  }

  // Handlers
  const toggleEdit = (field) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    setFormData((prev) => ({
      ...prev,
      [field]: data[field],
    }));
  };

  const handleSave = async (field) => {
    setEditMode((prev) => ({ ...prev, [field]: false }));
    if (formData[field] !== data[field]) {
      mutation.mutate({ [field]: formData[field] });
    }
  };

  const inputField = (field) => (
    <div className="flex w-full items-center justify-between gap-2">
      <input
        className="input w-full"
        value={formData[field]}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, [field]: e.target.value }))
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave(field);
        }}
        onBlur={() => handleSave(field)}
        autoFocus
      />
      <button onClick={() => handleSave(field)}>
        <FontAwesomeIcon icon={faSave} className="text-white/85 text-sm" />
      </button>
    </div>
  );

  const selectField = (
    <div className="flex w-full items-center justify-between gap-2">
      <select
        value={formData.role}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, role: e.target.value }))
        }
        onBlur={() => handleSave("role")}
        className="input w-full"
        autoFocus
      >
        <option value="USER">USER</option>
        <option value="AUTHOR">AUTHOR</option>
      </select>
      <button onClick={() => handleSave("role")}>
        <FontAwesomeIcon icon={faSave} className="text-white/85 text-sm" />
      </button>
    </div>
  );

  return (
    <div className=" bg-slate-800 text-white ">
      <Navbar />
      <div className="flex flex-col justify-around items-center min-h-[80vh]">
        <h1 className="michroma text-2xl text-cyan-500 font-bold">
          Your Profile
        </h1>
        <div className="profile-card bg-slate-700 shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
          <img
            src={data.avatar}
            alt="your-avatar"
            className="w-32 h-32 flex justify-center items-center rounded-full mx-auto object-cover border-4 border-slate-500 mb-4"
          />
          {/* Username */}
          <div className="info-item flex justify-between items-center">
            {editMode.username ? (
              inputField("username")
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-1">{data.username}</h1>
                <button onClick={() => toggleEdit("username")}>
                  <FontAwesomeIcon icon={faEdit} className="text-[18px]" />
                </button>
              </>
            )}
          </div>
          <p className="text-sm text-slate-300 mb-4 text-start">{data.email}</p>
          <div className="space-y-4 text-left">
            {/* Role */}
            <div className="info-item flex justify-between items-center">
              <div className="w-full">
                <span className="font-semibold text-slate-400">Role:</span>
                <span className="text-white pl-2">
                  {editMode.role ? selectField : data.role}
                </span>
              </div>
              {!editMode.role && (
                <button onClick={() => toggleEdit("role")}>
                  <FontAwesomeIcon icon={faEdit} className="text-[18px]" />
                </button>
              )}
            </div>
            {/* Bio */}
            <div className="info-item flex justify-between items-center">
              <div className="w-full">
                <span className="font-semibold text-slate-400">Bio:</span>
                <span className="text-white pl-2">
                  {editMode.bio ? inputField("bio") : data.bio || "No bio yet"}
                </span>
              </div>
              {!editMode.bio && (
                <button onClick={() => toggleEdit("bio")}>
                  <FontAwesomeIcon icon={faEdit} className="text-[18px]" />
                </button>
              )}
            </div>
            {/* Joined Date */}
            <div className="info-item">
              <span className="font-semibold text-slate-400">Joined:</span>
              <span className="text-white pl-2">
                {new Date(data.createdAt).toDateString()}
              </span>
            </div>
            {/* Post Count */}
            <div className="info-item">
              <span className="font-semibold text-slate-400">Posts:</span>
              <span className="text-white pl-2">{data._count?.posts || 0}</span>
            </div>
            <div>
              {data.role === "AUTHOR" || data.role === "ADMIN" ? (
                <p>Visit This App to add posts</p>
              ) : (
                <p>Become an author to add posts</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProfilePage;

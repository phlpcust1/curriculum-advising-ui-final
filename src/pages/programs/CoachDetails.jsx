import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "../../components/ui/Navbar";
import { Sidebar } from "../../components/ui/Sidebar";
import { PORT } from "../../utils/constants";

export default function CoachDetails() {
  const { id } = useParams(); // Get coach ID from URL
  const [coach, setCoach] = useState(null);
  const [students, setStudents] = useState([]);
  const [yearFilter, setYearFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoachDetails = async () => {
      try {
        const response = await axios.get(`${PORT}/coaches/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });
        setCoach(response.data);
        setStudents(response.data.assignments.map((a) => a.student));
      } catch (error) {
        console.error("Error fetching coach details:", error);
      }
    };

    fetchCoachDetails();
  }, [id]);

  if (!coach) return <div>Loading...</div>;

  const filteredStudents = students.filter((student) =>
    `${student.firstName} ${student.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) &&
    (yearFilter === "ALL" || student.yearLevel.toUpperCase() === yearFilter)
  );

  return (
    <div>
      <Sidebar />
      <div className="ml-60 bg-base-200">
        <Navbar />
        <div className="p-8">
          <h1 className="font-bold text-xl mb-4">Curriculum Coach</h1>

          <div className="card bg-white shadow-xl p-6 mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                  <img src="/logo.png" alt="Coach" />
                </div>
              </div>
              <div>
                <h2 className="font-bold text-lg">
                  {coach.firstName} {coach.lastName}
                </h2>
                <p className="text-gray-500">Curriculum Coach</p>
              </div>
            </div>
            <div className="text-right">
              <p className="mt-6">
                No. of assigned students <strong>{students.length} Students</strong>
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Search Students here..."
              className="input input-bordered w-72"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="flex space-x-4">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => navigate("/dashboard?tab=dashboard")}
              >
                Go to Coach Dashboard
              </button>

              <button
                className="btn btn-sm btn-outline"
                onClick={() => navigate("/summary?tab=summary")}
              >
                View Coaching Summary
              </button>

              <select
                className="select select-bordered"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                <option value="ALL">All Years</option>
                <option value="FIRST">1st Year</option>
                <option value="SECOND">2nd Year</option>
                <option value="THIRD">3rd Year</option>
                <option value="FOURTH">4th Year</option>
              </select>
            </div>
          </div>

          <div className="card bg-white w-full shadow-xl">
            <div className="card-body">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Student ID</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        {student.firstName} {student.lastName}
                      </td>
                      <td>{student.studentId}</td>
                      <td>{student.email}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() =>
                            navigate(`/programs/student-subjects/${student.id}`)
                          }
                        >
                          View subjects
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Navbar } from "../../components/ui/Navbar";
import { Sidebar } from "../../components/ui/Sidebar";
import axios from "axios";
import { PORT } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

export default function SubjectSummary() {
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("summary"); // Default tab is 'summary'

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const navigate = useNavigate();

  const [yearFilter, setYearFilter] = useState("All");
  const [semFilter, setSemFilter] = useState("All");
  const [studentCourses, setStudentCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${PORT}/courses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchStudentCourses = async () => {
    try {
      const response = await axios.get(`${PORT}/student-course`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setStudentCourses(response.data);
    } catch (error) {
      console.error("Error fetching student-course data:", error);
    }
  };

  const filteredCourses = courses
    .map((course) => {
      const matchesYear = yearFilter === "All" || course.year === yearFilter;
      const matchesSem = semFilter === "All" || course.sem.toString() === semFilter;

      if (!matchesYear || !matchesSem) {
        return null;
      }

      // Count Passed, Failed, IP for this course
      const courseStudentData = studentCourses.filter((sc) => sc.courseId === course.id);
      const passedCount = courseStudentData.filter((sc) => sc.remark === "PASSED").length;
      const failedCount = courseStudentData.filter((sc) => sc.remark === "FAILED").length;
      const ipCount = courseStudentData.filter((sc) => sc.remark === "IP").length;

      return {
        ...course,
        passedCount,
        failedCount,
        ipCount,
      };
    })
    .filter(Boolean);

  useEffect(() => {
    fetchCourses();
    fetchStudentCourses();
  }, []);

  return (
    <div>
      <Sidebar />
      <div className="ml-60 bg-base-200">
        <Navbar />
        <div className="p-8">
          <h1 className="font-bold text-xl mb-8 pl-4"> Coaching Summary</h1>

          {/* Tab Navigation */}
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 ${activeTab === "summary" ? "border-b-2 border-red-500 font-bold" : ""}`}
              onClick={() => handleTabChange("summary")}
            >
              Summary
            </button>
            <button
              className={`px-4 py-2 ${activeTab === "detailed" ? "border-b-2 border-red-500 font-bold" : ""}`}
              onClick={() => handleTabChange("detailed")}
            >
              Detailed View
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "summary" && (
            <div className="card bg-white w-full shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 mb-4">
                    <select
                      className="select select-bordered"
                      value={yearFilter}
                      onChange={(e) => setYearFilter(e.target.value)}
                    >
                      <option value="All">All Years</option>
                      <option value="FIRST">First Year</option>
                      <option value="SECOND">Second Year</option>
                      <option value="THIRD">Third Year</option>
                      <option value="FOURTH">Fourth Year</option>
                    </select>
                    <select
                      className="select select-bordered"
                      value={semFilter}
                      onChange={(e) => setSemFilter(e.target.value)}
                    >
                      <option value="All">All Semesters</option>
                      <option value="1">1st Semester</option>
                      <option value="2">2nd Semester</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Description</th>
                        <th>Passed</th>
                        <th>Failed</th>
                        <th>IP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.map((course) => (
                        <tr
                          key={course.id}
                          className="cursor-pointer hover:bg-red-100"
                          onClick={() => navigate(`/summary/${course.id}`)}
                        >
                          <td>{course.subject}</td>
                          <td>{course.description}</td>
                          <td>{course.passedCount}</td>
                          <td>{course.failedCount}</td>
                          <td>{course.ipCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "detailed" && (
            <div className="card bg-white w-full shadow-xl p-6">
              <h2 className="text-lg font-bold mb-4">Detailed Subject Information</h2>
              <p>Here you can display more detailed insights about subjects.</p>
              {/* Add more details based on your data structure */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

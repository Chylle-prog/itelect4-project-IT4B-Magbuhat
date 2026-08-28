import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import type { Course } from "../types/index";
import CourseCard from "../assets/CourseCard";
import usePrevious from "../hooks/usePrevious";
import useUiStore from "../store/uiStore";
import { fetchCourses } from "../api/client";
import { Input } from "@/components/ui/input";

function CoursesPage() {
  // These four lines replace ALL of Session 6's fetching state
  const { data, isPending, isError, error } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  // The search box now reads and writes the store, not local state
  const searchTerm = useUiStore((state) => state.searchTerm);
  const setSearchTerm = useUiStore((state) => state.setSearchTerm);
  const previousSearch = usePrevious(searchTerm);

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => setSearchTerm(e.target.value);

  // Below this line data is Course[], never undefined -- the two
  // returns above ruled the other cases out, and TypeScript followed.
  const filteredCourses = (data as Course[]).filter((c: Course) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isPending) {
    return <div className="animate-pulse p-6">Loading courses...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error.message} -- is json-server running on port 3001?
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Courses</h2>
      <Input
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search courses..."
        className="max-w-sm"
      />
      {previousSearch !== undefined && previousSearch !== searchTerm && (
        <p className="mt-1 text-sm text-gray-500">
          Previous search: "{previousSearch}"
        </p>
      )}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((c: Course) => (
          <Link key={c.code} to={`/courses/${c.code}`}>
            <CourseCard course={c} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CoursesPage;
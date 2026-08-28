import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ApiSubmission } from "../types/index";
import SubmissionBadge from "../assets/SubmissionBadge";
import { fetchSubmissions, createSubmission } from "../api/client";
import { submissionSchema, type SubmissionFormValues } from "../schemas/submissionSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmissionsPage() {
  const queryClient = useQueryClient();

  // 1. READ -- exactly the same useQuery pattern as CoursesPage
  const { data, isPending, isError } = useQuery<ApiSubmission[]>({
    queryKey: ["submissions"],
    queryFn: fetchSubmissions,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    mode: "onBlur",
    defaultValues: { courseCode: "", repoUrl: "" },
  });

  // 2. WRITE -- mutationFn does the POST, onSuccess clears up after it
  const addSubmission = useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      // "the submissions list is out of date now -- go and refetch it"
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      reset();
    },
  });

  const onSubmit = (values: SubmissionFormValues): void => {
    addSubmission.mutate({
      studentId: 1,
      courseCode: values.courseCode,
      repoUrl: values.repoUrl,
      submittedAt: new Date().toISOString(), // a STRING, not a Date
    });
  };

  if (isPending) {
    return <div className="animate-pulse p-6">Loading submissions...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Could not load submissions.
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
        My Submissions
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 grid max-w-xl gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="courseCode" className="text-foreground">Course</Label>
          <select
            id="courseCode"
            {...register("courseCode")}
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm dark:border-gray-700 dark:bg-gray-900"
            aria-invalid={errors.courseCode ? true : undefined}
          >
            <option value="">Select a course</option>
            <option value="ITELECT4">IT Elective 4</option>
            <option value="ITELECT3">IT Elective 3</option>
            <option value="CSSWENG">Software Engineering</option>
          </select>
          {errors.courseCode && <p className="text-sm text-red-600">{errors.courseCode.message}</p>}
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="repoUrl" className="text-foreground">Repository URL</Label>
          <Input
            id="repoUrl"
            {...register("repoUrl")}
            aria-invalid={errors.repoUrl ? true : undefined}
            placeholder="https://github.com/you/your-repo"
          />
          {errors.repoUrl && <p className="text-sm text-red-600">{errors.repoUrl.message}</p>}
        </div>
        <Button type="submit" disabled={addSubmission.isPending} className="justify-self-start">
          {addSubmission.isPending ? "Saving..." : "Add submission"}
        </Button>
      </form>
      {addSubmission.isError && (
        <p className="mb-4 text-sm text-red-700">
          {addSubmission.error.message}
        </p>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data.map((s: ApiSubmission) => (
          <SubmissionBadge key={s.id} submission={s}>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Course: {s.courseCode}
            </p>
          </SubmissionBadge>
        ))}
      </div>
    </div>
  );
}

export default SubmissionsPage;
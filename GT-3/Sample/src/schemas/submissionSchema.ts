import { z } from "zod";

export const submissionSchema = z.object({
  courseCode: z.string().min(1, "Please select a course"),
  repoUrl: z
    .url("Must be a valid URL starting with https://")
    .refine(
      (url) => url.includes("github.com"),
      "Must be a GitHub repository URL"
    ),
});

export type SubmissionFormValues = z.infer<typeof submissionSchema>;
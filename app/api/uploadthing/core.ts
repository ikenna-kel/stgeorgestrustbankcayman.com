import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  paymentProof: f({
    image: { maxFileSize: "4MB", maxFileCount: 3 },
  })
    .middleware(async () => ({}))
    .onUploadComplete(async ({ file }) => ({
      url: file.ufsUrl ?? file.url,
      name: file.name,
      size: file.size,
      type: file.type,
    })),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

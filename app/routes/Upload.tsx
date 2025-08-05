import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { prepareInstructions } from "~/constants";
import type { AnalyzerPropsTypes } from "~/interfacePropTypes/analyzerPropTypes";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

const Upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();
  const navigate = useNavigate;
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelects = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: AnalyzerPropsTypes) => {
    setIsProcessing(true);
    setStatusMessage("File uploading...📩");

    const uploadedFile = await fs.upload([file]);
    if (!uploadedFile)
      return setStatusMessage("Error failed to upload file ❌");

    setStatusMessage("Converting to image file...");
    const imageFile = await convertPdfToImage(file);
    if (!imageFile.file)
      return setStatusMessage("Error: failed to convert PDF to Image⛓️‍💥");

    setStatusMessage("Uploading image...");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage)
      return setStatusMessage("Error failed to upload image ❌");

    setStatusMessage("Preparing data...");

    const uuid = generateUUID;
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };
    await kv.set(`resume${uuid}`, JSON.stringify(data));

    setStatusMessage("Analyzing...");

    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription })
    );

    if (!feedback) return setStatusMessage("Error: Failed to analyze resume");
    const feedbackText =
      typeof feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = JSON.parse(feedbackText);
    await kv.set(`resume${uuid}`, JSON.stringify(data));
    setStatusMessage("Analysis complete, redirecting🤖");
    console.log(data);
  };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const form = evt.currentTarget.closest("form");
    if (!form) return;

    const formData = new FormData(form);
    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    if (!file) return;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main
      className="bg-[url('/images/bg-main.svg')] bg-cover"
      aria-label="Upload Resume page"
    >
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Smart feedback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusMessage}</h2>
              <img
                src="/images/resume-scan.gif"
                alt="resume scanning gif"
                className="w-full"
              />
            </>
          ) : (
            <h2>
              Drop your resume for an
              <em className="font-medium text-green-400 p-1">ATS-Score</em>
              and improvement tips
              <span className="text-blue-500 font-semibold p-1">✓</span>
            </h2>
          )}
          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 mt-8"
            >
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  id="company-name"
                  placeholder="Enter company name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input
                  type="text"
                  name="job-title"
                  id="job-title"
                  placeholder="Enter job title"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Enter job description"
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploder">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelects} />
              </div>

              <button type="submit" className="primary-button">
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;

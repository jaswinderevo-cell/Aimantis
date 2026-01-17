import { useDropzone } from "react-dropzone";
import { useState, useCallback, useEffect } from "react";
import { COLOR_LIGHT_GRAY } from "@/constants/constants";
import { Loader2, X } from "lucide-react";

type FileWithPreview = File & { preview: string };

type DropzoneUploaderProps = {
  marginTop?: number;
  showLabel?: boolean;
  borderColor?: string;
  backgroundColor?: string;
  height?: string;
  onFilesSelected: (file: FileWithPreview | null) => void;
};

export default function DropzoneUploader({
  showLabel = true,
  onFilesSelected,
  marginTop,
  borderColor,
  backgroundColor,
  height,
}: DropzoneUploaderProps) {
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      setLoading(true);

      const selectedFile = Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0]),
      });

      setFile(selectedFile);
      onFilesSelected(selectedFile);
    },
    [onFilesSelected],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
  });

  useEffect(() => {
    return () => {
      if (file) URL.revokeObjectURL(file.preview);
    };
  }, [file]);

  //handle remove
  const handleRemoveFile = () => {
    setFile(null);
    onFilesSelected(null);
  };

  return (
    <div style={{ marginTop: marginTop ? marginTop : 8 }}>
      {showLabel && (
        <label
          className="block mb-2 font-semibold text-[14px]"
          style={{ color: COLOR_LIGHT_GRAY }}
        >
          {file ? "Selected Image" : "Select file to upload"}
        </label>
      )}

      {!file ? (
        <div
          {...getRootProps()}
          className="border border-dashed p-6 rounded-md cursor-pointer flex items-center justify-center text-center"
          style={{
            borderColor: borderColor || COLOR_LIGHT_GRAY,
            backgroundColor: backgroundColor || "",
            height: height,
          }}
        >
          <input {...getInputProps()} />
          {loading ? (
            <div className="flex items-center justify-center gap-2 text-blue-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Uploading...</span>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Drag & drop an image here, or click to select.
            </p>
          )}
        </div>
      ) : (
        <div className="relative inline-block">
          <img
            src={file.preview}
            alt={file.name}
            className="w-40 h-40 object-cover rounded-md shadow"
            onLoad={() => setLoading(false)}
          />
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1 hover:bg-gray-200"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { useDropzone } from "react-dropzone";

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const BusinessMediaManager = ({
  value = [],
  onChange,
  logo = "",
  onLogoChange,
}) => {
  const [uploading, setUploading] = useState([]);
  const [logoUploading, setLogoUploading] = useState(false);

  // ================= CLOUDINARY UPLOAD =================

  const uploadFile = async (file) => {
    const data = new FormData();

    data.append("file", file);
    data.append("upload_preset", "servdial");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dkz4ihfuv/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const json = await res.json();

    console.log("Cloudinary response:", json);

    if (!json.secure_url) {
      console.error("Cloudinary upload error:", json);

      throw new Error(
        json?.error?.message || "Upload failed"
      );
    }

    return json.secure_url;
  };

  // ================= BUSINESS IMAGES =================

  const onDrop = async (files) => {
    if (!files?.length) return;

    // Remaining slots
    const remainingSlots =
      MAX_IMAGES - value.length;

    if (remainingSlots <= 0) {
      alert(
        `Maximum ${MAX_IMAGES} business images allowed.`
      );
      return;
    }

    // Only take available slots
    const filesToUpload =
      files.slice(0, remainingSlots);

    try {
      // Temporary previews
      const tempPreviews =
        filesToUpload.map((file) => ({
          file,
          preview: URL.createObjectURL(file),
        }));

      // Show instantly
      setUploading((prev) => [
        ...prev,
        ...tempPreviews,
      ]);

      // Upload
      const uploaded =
        await Promise.all(
          tempPreviews.map((item) =>
            uploadFile(item.file)
          )
        );

      const valid =
        uploaded.filter(Boolean);

      // Merge existing + new images
      const updated = [
        ...new Set([
          ...value,
          ...valid,
        ]),
      ].slice(0, MAX_IMAGES);

      onChange?.(updated);

    } catch (err) {
      console.error(
        "Business image upload failed:",
        err
      );

      alert(
        err?.message ||
        "Image upload failed"
      );

    } finally {

      // Cleanup previews
      setUploading((prev) => {
        prev.forEach((item) =>
          URL.revokeObjectURL(
            item.preview
          )
        );

        return [];
      });
    }
  };

  // ================= BUSINESS IMAGE DROPZONE =================

  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    onDrop,

    multiple: true,

    accept: {
      "image/*": [],
    },

    maxSize: MAX_FILE_SIZE,
  });

  // ================= REMOVE IMAGE =================

  const removeImage = (index) => {
    const updated =
      value.filter(
        (_, i) => i !== index
      );

    onChange?.(updated);
  };

  // ================= LOGO UPLOAD =================

  const handleLogoUpload = async (file) => {
    if (!file) return;

    try {

      setLogoUploading(true);

      const url =
        await uploadFile(file);

      if (url) {
        onLogoChange?.(url);
      }

    } catch (err) {

      console.error(
        "Logo upload failed:",
        err
      );

      alert(
        err?.message ||
        "Logo upload failed"
      );

    } finally {

      setLogoUploading(false);

    }
  };

  // ================= LOGO DROPZONE =================

  const {
    getRootProps: getLogoRootProps,
    getInputProps: getLogoInputProps,
  } = useDropzone({

    onDrop: (files) => {
      if (files?.[0]) {
        handleLogoUpload(
          files[0]
        );
      }
    },

    multiple: false,

    accept: {
      "image/*": [],
    },

    maxSize: MAX_FILE_SIZE,

  });

  // ================= REMOVE LOGO =================

  const removeLogo = () => {
    onLogoChange?.("");
  };

  // ================= UI =================

  return (
    <div className="space-y-6">

      {/* ================================================= */}
      {/* LOGO */}
      {/* ================================================= */}

      <div className="space-y-3">

        <h3 className="font-semibold">
          Business Logo
        </h3>

        <div
          {...getLogoRootProps()}
          className="
            border-2
            border-dashed
            p-4
            text-center
            rounded-xl
            cursor-pointer
            hover:border-indigo-500
            transition
          "
        >

          <input
            {...getLogoInputProps()}
          />

          <p className="text-sm text-gray-600">
            {logoUploading
              ? "Uploading logo..."
              : logo
              ? "Click or drop to replace logo"
              : "Upload business logo"}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Maximum size: 2MB
          </p>

        </div>

        {/* LOGO PREVIEW */}

        {logo && !logoUploading && (
          <div className="flex items-center gap-4">

            <div className="relative">

              <img
                src={logo}
                alt="Business logo"
                className="
                  w-24
                  h-24
                  object-contain
                  rounded-xl
                  border
                  bg-white
                  p-2
                "
              />

              <button
                type="button"
                onClick={removeLogo}
                className="
                  absolute
                  -top-2
                  -right-2
                  w-6
                  h-6
                  rounded-full
                  bg-red-500
                  text-white
                  text-xs
                  flex
                  items-center
                  justify-center
                "
              >
                ✕
              </button>

            </div>

            <div>
              <p className="text-sm font-medium">
                Current Logo
              </p>

              <p className="text-xs text-gray-500">
                Drop a new image above to replace it.
              </p>
            </div>

          </div>
        )}

        {/* LOGO UPLOADING */}

        {logoUploading && (
          <div
            className="
              w-24
              h-24
              rounded-xl
              border
              bg-gray-100
              flex
              items-center
              justify-center
              text-xs
              text-gray-500
            "
          >
            Uploading...
          </div>
        )}

      </div>


      {/* ================================================= */}
      {/* BUSINESS IMAGES */}
      {/* ================================================= */}

      <div className="space-y-3">

        <div className="flex items-center justify-between">

          <h3 className="font-semibold">
            Business Images
          </h3>

          <span className="text-xs text-gray-500">
            {value.length}/{MAX_IMAGES}
          </span>

        </div>

        {/* UPLOAD */}

        <div
          {...getRootProps()}
          className="
            border-2
            border-dashed
            p-4
            text-center
            rounded-xl
            cursor-pointer
            hover:border-indigo-500
            transition
          "
        >

          <input
            {...getInputProps()}
          />

          <p className="text-sm text-gray-600">

            {uploading.length > 0
              ? "Uploading..."
              : value.length >= MAX_IMAGES
              ? "Maximum images reached"
              : "Click or drop business images"}

          </p>

          <p className="text-xs text-gray-400 mt-1">
            Maximum 10 images • 2MB each
          </p>

        </div>


        {/* PREVIEW GRID */}

        <div className="grid grid-cols-3 gap-2">

          {/* UPLOADING PREVIEWS */}

          {uploading.map(
            (item, i) => (

              <div
                key={`uploading-${i}`}
                className="relative"
              >

                <img
                  src={item.preview}
                  alt="uploading"
                  className="
                    w-full
                    h-24
                    object-cover
                    rounded
                    opacity-60
                  "
                />

                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    text-xs
                    bg-black/40
                    text-white
                    rounded
                  "
                >
                  Uploading...
                </div>

              </div>

            )
          )}


          {/* FINAL IMAGES */}

          {value.length > 0
            ? value.map(
                (img, i) => (

                  <div
                    key={`${img}-${i}`}
                    className="
                      relative
                      group
                    "
                  >

                    <img
                      src={img}
                      alt={`business-${i}`}
                      className="
                        w-full
                        h-24
                        object-cover
                        rounded
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(i)
                      }
                      className="
                        absolute
                        top-1
                        right-1
                        bg-red-500
                        text-white
                        text-xs
                        px-2
                        py-1
                        rounded
                        opacity-0
                        group-hover:opacity-100
                        transition
                      "
                    >
                      ✕
                    </button>

                  </div>

                )
              )

            : uploading.length === 0 && (

                <p
                  className="
                    text-xs
                    text-gray-400
                    col-span-3
                    text-center
                    py-3
                  "
                >
                  No business images
                </p>

              )}

        </div>

      </div>

    </div>
  );
};

export default BusinessMediaManager;
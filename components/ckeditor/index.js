"use client";
import { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// extra plugins
// import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";
// import Font from "@ckeditor/ckeditor5-font/src/font";

export default function TaskEditorWithImage({ onChange }) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]); // store uploaded images

  // Custom Upload Adapter
  class CustomUploadAdapter {
    constructor(loader) {
      this.loader = loader;
    }

    upload() {
      return this.loader.file.then(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const base64 = reader.result;
              setImages((prev) => [...prev, { name: file.name, data: base64 }]);

              resolve({
                default: base64, // CKEditor will insert this image
              });
            };
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
          })
      );
    }

    abort() {}
  }

  function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader);
    };
  }

  return (
    <div className="w-full h-full">
      <div className="border rounded-lg shadow-sm">
        <CKEditor
          editor={ClassicEditor}
          data={content}
          config={{
            extraPlugins: [CustomUploadAdapterPlugin],
            toolbar: [
              "heading",
              "|",
              "bold",
              "italic",
              "underline",
              "strikethrough",
              "|",
              "fontSize",
              "fontFamily",
              "fontColor",
              "fontBackgroundColor",
              "|",
              "alignment",
              "|",
              "numberedList",
              "bulletedList",
              "|",
              "insertTable",
              "blockQuote",
              "link",
              "imageUpload",
              "|",
              "undo",
              "redo",
            ],
            fontSize: {
              options: [8, 10, 12, 14, "default", 18, 24, 36],
            },
            alignment: {
              options: ["left", "center", "right", "justify"],
            },
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            setContent(data);
            if (onChange) onChange({ html: data, images });
          }}
        />
      </div>

      {/* Preview Uploaded Images */}
      {images.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-medium text-gray-700">Uploaded Images:</h3>
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, i) => (
              <img
                key={i}
                src={img.data}
                alt={img.name}
                className="w-full h-24 object-cover rounded-lg border"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

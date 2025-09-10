"use client"
export const dynamic = 'force-dynamic'
import { CKEditor } from "@ckeditor/ckeditor5-react";

import { useField, useFormikContext } from "formik";
// import CustomEditor from "./ckeditor";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import is from "@/utils/is";
import { forwardRef, useRef } from "react";
// import cx from "@/utils/class-names";
import "./index.css";
import FormError from "../form-error";
import deepMergeObjects from "@/utils/deep-merge-objects";
import { cn } from "@/lib/utils"

const RichTextEditor = forwardRef((props, ref) => {
  const { value, onChange, onFocus, onBlur, readOnly, classNames, config = {}, ...restProps } = props;
  const editorRef = useRef(null);
  const defaultConfig = {
    toolbar: {
      items: [
        "fontSize",
        "|",
        "bold",
        "italic",
        "strikethrough",
        "underline",
        "superscript",
        "subscript",
        "bulletedList",
        "todoList",
        "numberedList",
        "|",
        "outdent",
        "indent",
        "|",
        "blockQuote",
        "undo",
        "redo",
        "specialCharacters",
        "removeFormat",
        "horizontalLine",
        "highlight",
        "fontColor",
        "fontBackgroundColor",
        "alignment",
      ],
    },
  };

  const editorConfig = deepMergeObjects(defaultConfig, config);
  return (
    <CKEditor
      ref={editorRef}
      className={cn("rich-text-editor h-[200px]", classNames?.input)}
      style={{ height: "200px" }}
      editor={ClassicEditor }//|| CustomEditor}
      data={value}
      onReady={(editor) => {
        if (ref?.current) {
          ref.current = editor;
        }
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange && onChange(data);
      }}
      // config={editorConfig}
      {...restProps}
    />
  );
});

export default function FormikRichTextEditor(props) {
  const { name, classNames = {}, onChange, ...restProps } = props;

  const [field, meta, { setValue }] = useField(name);
  const { submitCount } = useFormikContext();
  const isError = submitCount > 0 && !!meta.error;
  const helperText = (submitCount > 0 && meta.error) || "";
  const handleOnChange = (value) => {
    const _value = is.undefined(value) ? undefined : value;
    setValue(_value);
    onChange && onChange(_value);
  };

  return (
    <>
      <RichTextEditor {...field} onChange={handleOnChange} {...restProps} />
      <FormError show={isError} message={helperText} className={classNames.error} />
    </>
  );
}

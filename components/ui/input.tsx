import * as React from "react"

import { cn } from "@/lib/utils"
import { useField, useFormikContext } from "formik";
import FormError from "./form-error";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export function FormikInput(props) {
  const { name, classNames = {}, setRef = () => {} } = props;
  const [field, meta] = useField(name);
  const { submitCount, validateOnChange, touched } = useFormikContext();
  const isError = (validateOnChange && touched[name]) || (submitCount > 0 && !!meta.error);
  const helperText = (validateOnChange && touched[name]) ? meta.error : (submitCount > 0 && meta.error) || "";
  return (
    <>
      <Input ref={setRef} error={isError} {...field} {...props} />
      <FormError show={isError} message={helperText} className={classNames.error} />
    </>
  );
}

export { Input }

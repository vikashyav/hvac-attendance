/**
 * v0 by Vercel.
 * @see https://v0.app/t/c4jip3xoOx0
 * Documentation: https://v0.app/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Button } from "@/components/ui/button"

export default function BackButton(props) {
  return (
    <Button variant="ghost" size="icon"  {...props}>
      <ArrowLeftIcon className="h-5 w-5" />
      <span className="sr-only">Back</span>
    </Button>
  )
}

function ArrowLeftIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}
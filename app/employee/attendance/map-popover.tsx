"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface MapProps {
  latitude: number;
  longitude: number;
  label?: string;
}

export default function Map({ latitude, longitude, label = "Selected Location" }: MapProps) {
  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* <Button > */}
        <samp className="cursor-pointer text-blue-600 text-sm underline">{label}{"   "}{latitude},{longitude}
          {/* <a
            // href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
            // target="_blank"
            // rel="noopener noreferrer"
            className="text-blue-600 text-sm underline mt-2 inline-block"
          >
            {`  Open in Google Maps`}
          </a> */}

        </samp>

        {/* </Button> */}
      </PopoverTrigger>
      <PopoverContent className="p-3">
        {/* <h4 className="font-semibold">{label}</h4>
            <p className="text-sm text-muted-foreground">
              Latitude: {latitude.toFixed(4)} <br />
              Longitude: {longitude.toFixed(4)}
            </p>
             */}
        <div className="w-full h-[450px] rounded-2xl ">
          {/* overflow-hidden shadow-md relative */}
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            className="rounded-2xl"
          ></iframe>
        </div>

      </PopoverContent>
    </Popover>
  );
}

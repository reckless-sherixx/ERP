"use client";

import { UploadDropzone } from "@uploadthing/react";
import { Label } from "../ui/label";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { OurFileRouter } from "@/app/api/uploadthing/core";

interface UploadButtonProps {
    onChange: (url?: string) => void;
    value?: string;
}

export function UploadButton({ onChange, value }: UploadButtonProps) {
    if (value) {
        return (
            <div className="flex flex-col gap-2">
            <Label className="mb-2">Attachment</Label>   
                <div className="relative h-32 w-32">
                    <Image
                        src={value}
                        alt="Order Image"
                        className="object-cover"
                        fill
                    />
                    <Button
                        onClick={() => onChange(undefined)}
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-md "
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <UploadDropzone<OurFileRouter, "imageUploader">
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                        onChange(res[0].ufsUrl);
                    }
                }}
                onUploadError={(error: Error) => {
                    console.error(error);
                }}
                className="ut-button:bg-primary ut-button:text-white ut-button:p-4 ut-button:hover:bg-primary/90 ut-button:rounded-md ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground ut- border-primary h-[250px] max-w-full p-2"
            />
            
        </div>
    );
}
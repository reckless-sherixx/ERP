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
                <div className="relative h-48 w-48">
                    <Image
                        src={value}
                        alt="Order Image"
                        className="object-cover rounded-md"
                        fill
                    />
                    <Button
                        onClick={() => onChange(undefined)}
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <Label>Order Image</Label>
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
                className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90 ut-label:text-muted-foreground ut-allowed-content:text-muted-foreground border-primary"
            />
        </div>
    );
}
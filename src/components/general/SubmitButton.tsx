"use client"
import { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps{
    text:string;
    variant?: 
    |"default"
    |"destructive" 
    |"outline"
    |"secondary"
    |"ghost"
    |"link"
    |null
    |undefined;
    width?:string;
    icon?:ReactNode;
}
export function SubmitButton({
    text,
    variant,
    width,
    icon
}:SubmitButtonProps){
    const { pending } = useFormStatus();
    return(
        <Button variant={variant} className={width} disabled={pending}>
            {pending ? (
                <>
                <Loader2 className="size-4 animate-spin"/>
                <span className="text-muted-foreground">{text}</span>
                </>
            ) : (
                <>
                {icon && <div>{icon}</div>}
                <span>{text}</span>
                </>
            )}
        </Button>
    )
}

export function SaveJobButton({savedJob}: {savedJob:boolean}){
    const {pending} = useFormStatus();

    return (
        <Button disabled={pending} variant="outline">
            {pending ? (
                <>
                    <Loader2 className="size-4 animate-spin"/>
                    <span>Saving...</span>
                </>
            ):(
                <>
                    <Heart className={cn(
                        savedJob ? 'fill-current text-red-500' : "" ,
                        "size-4 transition-colors"
                    )}/>
                    {
                        savedJob ? "Saved" : "Save"
                    }
                </>
            )}
        </Button>
    )
}
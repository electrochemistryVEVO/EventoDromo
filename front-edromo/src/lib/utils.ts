//'use server'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export async function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getApiUrl(){
    //Puerto de docker: 8080
    //Puerto sin docker: 5189
    return process.env.NEXT_PUBLIC_API_BASE_URL
}
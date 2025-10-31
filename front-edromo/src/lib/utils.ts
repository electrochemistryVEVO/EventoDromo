'use server'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export async function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getApiUrl(){
    //Puerto de docker: 8080
    //Puerto sin docker: 5189
    let port = process.env.REACT_APP_DOCKERENV ? '8080' : '5189';
    let url = 'http://localhost:'
    return url+port+'/api/'
}
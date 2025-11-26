'use server'
//import { pdf } from '@react-pdf/renderer';
import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import bwipjs  from 'bwip-js';
import { readFileSync } from 'fs';
import { readFile } from "node:fs/promises";
import '@/lib/hbsHelpers'
import * as QRCode from 'qrcode';
//import EntradaPDF from '../components/pdf/EntradaPDF';

export const generateEntradaPDF = async (entradaData) => {
    try {
        //Preparar imagenes
        let images = {
            logo_eventodromo: "public/images/logo/logo_eventodromo.png"
        }
        let urls = {}
        let qrcode = await QRCode.toDataURL(entradaData.idEvento.toString())
        entradaData.qrUrl = qrcode
        await Promise.all(Object.keys(images).map(async (key)=>{
            let ext = images[key].split('.')[1]
            urls[key] = await readFile(images[key]).then((buffer)=>`data:image/${ext};base64,${buffer.toString("base64")}`)
        }))
        let barcode = await bwipjs.toBuffer({
            bcid:        'code128',       // Barcode type
            text:        entradaData.idEvento.toString().padStart(10,"0"),    // Text to encode
            scale:       3,               // 3x scaling factor
            height:      10,              // Bar height, in millimeters
            includetext: true,            // Show human-readable text
            textxalign:  'center',        // Always good to set this
        })
        //Preparar datos
        entradaData.urls = urls;
        entradaData.barCode = `data:image/png;base64,${barcode.toString("base64")}`;
        let [fecha,hora] = entradaData.fechaHora.split('-')
        entradaData.fecha = fecha
        entradaData.hora = hora;
        // Crear el blob del PDF
        let html = Handlebars.compile(readFileSync(`src/assets/hbsTemplates/ticket.hbs`,"utf-8"))(entradaData)
        //console.log(html)
        return puppeteer.launch({executablePath:"/usr/bin/chromium",
		args: ['--no-sandbox'],
   		 timeout: 10000}).then((browser)=>browser.newPage().then(
            (page)=>page.setContent(html,{ waitUntil: "networkidle0" })
                .then(()=>page.setViewport({width:1236,height:612,deviceScaleFactor:1}))
                .then(()=>page.pdf({
                    printBackground: true,
                    preferCSSPageSize: true,
                    width:1236,
                    height:612
                })
                .then((resPdf)=>{
                    console.log("xd")
                    browser.close();
                    return resPdf;})
            )
        ))
            .then((pdfBuffer)=>{
                console.log("Buffer: ",pdfBuffer)
                let blob = new Blob([pdfBuffer], {
                    type: 'application/pdf',
                })
                console.log("Blob: ",blob)
                return blob
            })
            .catch((error)=>{
                console.error('Error generando el PDF:', error);
                throw error;
            })

        // Crear URL del blob

    } catch (error) {
        console.error('Error generando el PDF:', error);
        throw error;
    }
};

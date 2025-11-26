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

/**
 * Obtiene la configuración de Puppeteer según el sistema operativo
 * @returns {Object} Configuración de launch para Puppeteer
 */
const getPuppeteerConfig = () => {
    const platform = process.platform;
    
    // Configuración base
    const baseConfig = {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu'
        ],
        timeout: 10000
    };

    // En producción o si no encontramos Chrome, usar el bundled Chromium de Puppeteer
    // En desarrollo, intentar usar el Chrome/Chromium del sistema
    if (process.env.NODE_ENV === 'production') {
        return {
            ...baseConfig,
            headless: 'new'
        };
    }

    // Paths según SO (solo para desarrollo)
    const chromePaths = {
        win32: [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
        ],
        darwin: [
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
        ],
        linux: [
            '/usr/bin/chromium-browser',
            '/usr/bin/chromium',
            '/usr/bin/google-chrome',
            '/snap/bin/chromium'
        ]
    };

    const paths = chromePaths[platform] || chromePaths.linux;
    
    // Intentar encontrar un path válido
    const fs = require('fs');
    for (const path of paths) {
        try {
            if (fs.existsSync(path)) {
                console.log(`✅ Chrome/Chromium encontrado en: ${path}`);
                return {
                    ...baseConfig,
                    executablePath: path,
                    headless: 'new'
                };
            }
        } catch (err) {
            // Ignorar errores de acceso a archivos
        }
    }

    // Si no encontramos Chrome, usar el bundled de Puppeteer
    console.log('⚠️ Chrome no encontrado, usando Chromium bundled de Puppeteer');
    return {
        ...baseConfig,
        headless: 'new'
    };
};

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
        
        // Obtener configuración multiplataforma de Puppeteer
        const puppeteerConfig = getPuppeteerConfig();
        
        return puppeteer.launch(puppeteerConfig).then((browser)=>browser.newPage().then(
            (page)=>page.setContent(html,{ waitUntil: "networkidle0" })
                .then(()=>page.setViewport({width:1236,height:612,deviceScaleFactor:1}))
                .then(()=>page.pdf({
                    printBackground: true,
                    preferCSSPageSize: true,
                    width:1236,
                    height:612
                })
                .then((resPdf)=>{
                    console.log("✅ PDF generado exitosamente");
                    browser.close();
                    return resPdf;})
            )
        ))
            .then((pdfBuffer)=>{
                console.log("✅ Buffer de PDF creado:", pdfBuffer.length, "bytes")
                let blob = new Blob([pdfBuffer], {
                    type: 'application/pdf',
                })
                console.log("✅ Blob de PDF creado:", blob.size, "bytes")
                return blob
            })
            .catch((error)=>{
                console.error('❌ Error generando el PDF:', error);
                console.error('Stack trace:', error.stack);
                
                // Agregar información útil para debugging
                if (error.message.includes('Could not find Chrome')) {
                    console.error('💡 Solución: Instala Google Chrome o ejecuta: npm install puppeteer');
                } else if (error.message.includes('Navigation timeout')) {
                    console.error('💡 Solución: Verifica que las imágenes y recursos existan');
                } else if (error.message.includes('executablePath')) {
                    console.error('💡 Solución: Chrome no encontrado en el sistema');
                }
                
                throw error;
            })

        // Crear URL del blob

    } catch (error) {
        console.error('Error generando el PDF:', error);
        throw error;
    }
};

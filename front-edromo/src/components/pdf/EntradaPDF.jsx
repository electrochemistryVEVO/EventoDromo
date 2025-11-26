import {Document, Page, Text, View, StyleSheet, Image, Font, Svg, Line} from '@react-pdf/renderer';
import { QRCodeSVG } from 'qrcode.react';

Font.register({
  family: 'Nunito',
  fonts:[
    {src: "https://fonts.gstatic.com/s/nunito/v32/XRXI3I6Li01BKofiOc5wtlZ2di8HDLshRTM9jo7eTWk.ttf" },
    {src:"https://fonts.gstatic.com/s/nunito/v32/XRXI3I6Li01BKofiOc5wtlZ2di8HDGUmRTM9jo7eTWk.ttf",
    fontWeight:"bold"}
//GET
// 	https://fonts.gstatic.com/s/nunito/v32/XRXV3I6Li01BKofINeaB.woff2
  ]
})

const styles = StyleSheet.create({
  page: {
    fontFamily:"Nunito",
    padding: 30,
   // width: 1236,
   // height: 612,
    backgroundColor: '#ffffff'
  },
  header: {
    marginBottom: 20,
    alignItems: 'center'
  },
  logo: {
    width: 150,
    marginBottom: 15
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center'
  },
  section: {
    fontFamily:"Nunito",
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    //width:1200,
    justifyContent:"space-between",
    marginVertical: 5
  },
  label: {
    width: 120,
    fontWeight: 'bold'
  },
  value: {fontFamily:"Nunito"
  },
  qrCode: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 20
  },
  sideText: {

  }
});

const Headline = () => (
    <Svg height="10" width="495">
      <Line x1="0" y1="5" x2="280" y2="5" strokeWidth={2} stroke="rgb(0,0,0)" />
    </Svg>
)

const EntradaPDF = ({ entrada }) => (
  <Document>
    <Page size={{width:1236,height:612}} style={styles.page}>
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Lugar:</Text>
          <Text style={styles.value}>{entrada.lugar}</Text>
        </View>
        <Headline/>
        <View style={styles.row}>
          <View>
            <Image
                src="/images/logo/logo_eventodromo.png"
                style={styles.logo}
            />
            <Image
                src="/images/otros/qr-code-example.png"
                style={styles.qrCode}
            />
            <Text style={styles.title}>{entrada.nombreEvento}</Text>
            <Text style={styles.value}>{entrada.lugar}</Text>
            <Text style={styles.label}>{entrada.fechaHora}</Text>
            <Text style={styles.label}>Tipo de Entrada</Text>
            <Text style={styles.value}>{entrada.tipoEntrada}</Text>
          </View>
          <View style={styles.row}>
            <View>
              <Text style={styles.value}>{entrada.nombreCliente}</Text>
              <Text style={styles.label}>DNI: </Text>
              <Text style={styles.value}>{entrada.dniCliente}</Text>
            </View>
            <View>
              <Text style={styles.value}>{entrada.tipoEntrada}</Text>
              <Headline/>
              <Text style={styles.value}>{entrada.fechaHora}</Text>
              <Headline/>
              <Text style={styles.value}>S/ {entrada.precio.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.row}>

          </View>
        </View>
      </View>
    </Page>
  </Document>
);


export default EntradaPDF;
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { QRCodeSVG } from 'qrcode.react';

const styles = StyleSheet.create({
  page: {
    padding: 30,
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
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  row: {
    flexDirection: 'row',
    marginVertical: 5
  },
  label: {
    width: 120,
    fontWeight: 'bold'
  },
  value: {
    flex: 1
  },
  qrCode: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginTop: 20
  }
});

const EntradaPDF = ({ entrada }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image
          src="/public/images/logo/eventodromo-logo.png"
          style={styles.logo}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>{entrada.nombreEvento}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Lugar:</Text>
          <Text style={styles.value}>{entrada.lugar}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Fecha y Hora:</Text>
          <Text style={styles.value}>{entrada.fechaHora}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Cliente:</Text>
          <Text style={styles.value}>{entrada.nombreCliente}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>DNI:</Text>
          <Text style={styles.value}>{entrada.dniCliente}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tipo de Entrada:</Text>
          <Text style={styles.value}>{entrada.tipoEntrada}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Precio:</Text>
          <Text style={styles.value}>S/ {entrada.precio.toFixed(2)}</Text>
        </View>

        <Image
          src="/public/images/otros/qr-code-example.png"
          style={styles.qrCode}
        />
      </View>
    </Page>
  </Document>
);

export default EntradaPDF;
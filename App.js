
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const USDT_ADDRESS = 'TXsdtxxgDXWtYDNgkqtCPVPb2a9CTHsDkF';

export default function App() {
  const [showQR, setShowQR] = useState(false);
  const [txId, setTxId] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendTxId = async () => {
    if (!txId) return Alert.alert('خطا', 'لطفاً TXID را وارد کنید.');
    setIsSending(true);
    try {
      const response = await fetch('http://your-server-ip:5000/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txId }),
      });
      if (response.ok) {
        setSent(true);
        Alert.alert('موفق', 'TXID با موفقیت ارسال شد.');
      } else {
        Alert.alert('خطا', 'ارسال ناموفق بود.');
      }
    } catch (err) {
      Alert.alert('خطا', 'ارتباط با سرور برقرار نشد.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff8e1' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>💰 اشتراک ربات طلا</Text>
        <Text style={styles.subtitle}>
          لطفاً مبلغ <Text style={styles.gold}>10 USDT</Text> را به آدرس زیر پرداخت کنید.
        </Text>

        {showQR ? (
          <View style={styles.qrContainer}>
            <QRCode value={USDT_ADDRESS} size={150} />
            <Text selectable style={styles.address}>{USDT_ADDRESS}</Text>
            <TextInput
              style={styles.input}
              placeholder="TXID تراکنش را وارد کنید"
              value={txId}
              onChangeText={setTxId}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={handleSendTxId}
              disabled={isSending || sent}
            >
              <Text style={styles.buttonText}>
                {sent ? '✓ ارسال شد' : isSending ? 'در حال ارسال...' : 'ارسال TXID'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => setShowQR(true)}>
            <Text style={styles.buttonText}>نمایش QR برای پرداخت</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#cfa000'
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20
  },
  gold: {
    color: '#cfa000',
    fontWeight: 'bold'
  },
  qrContainer: {
    alignItems: 'center'
  },
  address: {
    marginVertical: 12,
    textAlign: 'center',
    color: '#444'
  },
  input: {
    borderWidth: 1,
    borderColor: '#cfa000',
    padding: 10,
    width: '100%',
    borderRadius: 6,
    marginTop: 12
  },
  button: {
    backgroundColor: '#cfa000',
    padding: 14,
    borderRadius: 8,
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

type ActiveField = 'length' | 'circumference';

const App: React.FC = () => {
  const [length, setLength] = useState('');
  const [circumference, setCircumference] = useState('');
  const [activeField, setActiveField] = useState<ActiveField>('length');

  const handleNumberPress = (num: string) => {
    if (activeField === 'length') setLength(prev => prev + num);
    else setCircumference(prev => prev + num);
  };

  const handleBackspace = () => {
    if (activeField === 'length') setLength(prev => prev.slice(0, -1));
    else setCircumference(prev => prev.slice(0, -1));
  };

  const handleNext = () => {
    if (length && circumference) {
      setLength('');
      setCircumference('');
      setActiveField('length');
      return;
    }
    if (activeField === 'length' && length) setActiveField('circumference');
  };

  const handleReset = () => {
    setLength('');
    setCircumference('');
    setActiveField('length');
  };

  // Compute volume
  const L = parseFloat(length);
  const C = parseFloat(circumference);
  let result = "0′ 0″";
  if (L > 0 && C > 0) {
    const volume = (C * C * L) / 2304;
    let feet = Math.floor(volume);
    let inches = Math.round((volume - feet) * 12);
    if (inches === 12) { feet++; inches = 0; }
    result = `${feet}′ ${inches}″`;
  }

  // Keypad layout
  const keys = [
    ['1','2','3','⌫'],
    ['4','5','6','⟲'],
    ['7','8','9','→'],
    ['0']
  ];

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Timber Cubic</Text>

        {/* Inputs Row */}
        <View style={styles.inputRow}>
          <TouchableOpacity onPress={() => setActiveField('length')} style={styles.inputBox}>
            <Text style={styles.inputLabel}>Length (ft)</Text>
            <Text style={[styles.inputValue, activeField==='length' && styles.activeInput]}>{length || '0'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveField('circumference')} style={styles.inputBox}>
            <Text style={styles.inputLabel}>Circumference (in)</Text>
            <Text style={[styles.inputValue, activeField==='circumference' && styles.activeInput]}>{circumference || '0'}</Text>
          </TouchableOpacity>
        </View>

        {/* Result */}
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Volume</Text>
          <Text style={styles.resultValue}>{result}</Text>
        </View>

        {/* Keypad */}
        <View style={styles.keypad}>
          {keys.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keyRow}>
              {row.map((key, keyIndex) => {
                let onPress: () => void;
                let bgColor = '#374151'; // default number key

                if (key==='⌫') { onPress = handleBackspace; bgColor='#10b981'; } // teal
                else if (key==='→') { onPress = handleNext; bgColor='#3b82f6'; } // blue
                else if (key==='⟲') { onPress = handleReset; bgColor='#f59e0b'; } // orange
                else { onPress = () => handleNumberPress(key); }

                // Adjust flex for 0 key
                const flexStyle = key==='0' ? { flex: 2 } : { flex: 1 };

                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.keyButton, flexStyle, { backgroundColor: bgColor }, keyIndex < row.length-1 && { marginRight:6 }]}
                    onPress={onPress}
                  >
                    <Text style={styles.keyText}>{key}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          ))}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#111827', justifyContent:'center', alignItems:'center', padding:10 },
  title: { fontSize:28, fontWeight:'700', color:'#f3f4f6', marginBottom:20, textAlign:'center' },
  inputRow: { flexDirection:'row', justifyContent:'space-between', marginBottom:12, width:'100%' },
  inputBox: { flex:1, backgroundColor:'#1f2937', padding:16, borderRadius:16, marginHorizontal:4, alignItems:'center' },
  inputLabel: { color:'#9ca3af', fontSize:14 },
  inputValue: { color:'#f3f4f6', fontSize:28, marginTop:6 },
  activeInput: { color:'#10b981', fontWeight:'700' },
  resultBox: { backgroundColor:'#1f2937', padding:16, borderRadius:16, alignItems:'center', borderWidth:2, borderColor:'#374151', marginBottom:20, width:'100%' },
  resultLabel: { color:'#9ca3af', fontSize:14 },
  resultValue: { color:'#f3f4f6', fontSize:28, fontWeight:'700', marginTop:6 },
  keypad: { width:'100%' },
  keyRow: { flexDirection:'row', marginBottom:6 },
  keyButton: { height:60, borderRadius:12, justifyContent:'center', alignItems:'center' },
  keyText: { color:'#f3f4f6', fontSize:22, fontWeight:'700' },
});
